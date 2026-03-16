import { NextRequest, NextResponse } from 'next/server';

// --- Helper Functions for Adobe REST API Flow (Create PDF direction) ---

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  // Adobe PDF Services /token endpoint only accepts client_id and client_secret.
  // DO NOT add grant_type or scope — those are IMS-specific and cause INVALID_REQUEST_FORMAT.

  const response = await fetch('https://pdf-services.adobe.io/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[Adobe Auth] Token request failed (${response.status}):`, errText);
    throw new Error(`[Token] ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

async function getUploadUri(accessToken: string, clientId: string, mediaType: string) {
  const response = await fetch('https://pdf-services.adobe.io/assets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': clientId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mediaType }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[Adobe Upload URI] Failed (${response.status}):`, errText);
    throw new Error(`[Upload URI] ${response.status} - ${errText}`);
  }

  return await response.json();
}

async function uploadFileToUri(uploadUri: string, fileBuffer: Buffer, mediaType: string) {
  const response = await fetch(uploadUri, {
    method: 'PUT',
    headers: { 'Content-Type': mediaType },
    body: new Uint8Array(fileBuffer),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[Adobe Upload] Failed (${response.status}):`, errText);
    throw new Error(`[Upload] ${response.status} - ${errText}`);
  }
}

// Maps file extension to the Adobe input format identifier
function getAdobeDocumentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'html': 'text/html',
    'htm': 'text/html',
  };
  return map[ext || ''] || 'application/octet-stream';
}

async function submitCreatePdfJob(accessToken: string, clientId: string, assetId: string) {
  // Adobe uses inputFormat based on the MIME type of the uploaded asset
  const response = await fetch('https://pdf-services.adobe.io/operation/createpdf', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': clientId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assetID: assetId }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[Adobe Create PDF] Failed (${response.status}):`, errText);
    throw new Error(`[Create PDF] ${response.status} - ${errText}`);
  }

  return response.headers.get('Location');
}

async function pollJobStatus(pollUrl: string, accessToken: string, clientId: string): Promise<string> {
  const maxRetries = 30;
  let retries = 0;

  while (retries < maxRetries) {
    const response = await fetch(pollUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': clientId,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`[Poll] ${response.status} - ${errText}`);
    }

    const data = await response.json();

    if (data.status === 'done') {
      return data.asset.downloadUri as string;
    } else if (data.status === 'failed') {
      throw new Error(`Adobe PDF Services job failed: ${JSON.stringify(data.error || {})}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    retries++;
  }

  throw new Error('Create PDF job timed out after 30 seconds');
}

async function downloadResult(downloadUri: string): Promise<Buffer> {
  const response = await fetch(downloadUri);
  if (!response.ok) {
    throw new Error(`[Download] ${response.status} - ${await response.text()}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const clientId = process.env.PDF_SERVICES_CLIENT_ID;
    const clientSecret = process.env.PDF_SERVICES_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Adobe PDF Services credentials missing. Set PDF_SERVICES_CLIENT_ID and PDF_SERVICES_CLIENT_SECRET in .env.local' },
        { status: 500 }
      );
    }

    // Determine the correct MIME type from the file extension
    const mediaType = getAdobeDocumentType(file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Step 1: Get Access Token
    const accessToken = await getAccessToken(clientId, clientSecret);

    // Step 2: Request Upload URI
    const assetResponse = await getUploadUri(accessToken, clientId, mediaType);
    const uploadUri = assetResponse.uploadUri as string;
    const assetId = assetResponse.assetID as string;

    // Step 3: Upload the File
    await uploadFileToUri(uploadUri, fileBuffer, mediaType);

    // Step 4: Submit the Create PDF Job
    const pollUrl = await submitCreatePdfJob(accessToken, clientId, assetId);

    if (!pollUrl) {
      throw new Error('Missing poll URL from create PDF job submission');
    }

    // Step 5: Poll for Completion
    const downloadUri = await pollJobStatus(pollUrl, accessToken, clientId);

    // Step 6: Download the Result
    const resultBuffer = await downloadResult(downloadUri);

    const outputFilename = file.name.replace(/\.[^.]+$/, '.pdf');

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Type': 'application/pdf',
      },
    });

  } catch (err: any) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
