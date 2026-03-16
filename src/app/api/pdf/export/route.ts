import { NextRequest, NextResponse } from 'next/server';

// --- Helper Functions for Adobe REST API Flow ---

async function getAccessToken(clientId: string, clientSecret: string) {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  // Note: Adobe PDF Services /token endpoint only accepts client_id and client_secret.
  // DO NOT add grant_type or scope — those are IMS-specific and cause INVALID_REQUEST_FORMAT.

  const response = await fetch('https://pdf-services.adobe.io/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
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
    body: JSON.stringify({ mediaType })
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
    headers: {
      'Content-Type': mediaType
    },
    body: new Uint8Array(fileBuffer)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[Adobe Upload] Failed (${response.status}):`, errText);
    throw new Error(`[Upload] ${response.status} - ${errText}`);
  }
}

async function submitExportJob(accessToken: string, clientId: string, assetId: string, targetFormat: string) {
  const response = await fetch('https://pdf-services.adobe.io/operation/exportpdf', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': clientId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assetID: assetId,
      targetFormat: targetFormat.toLowerCase(),
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[Adobe Export Job] Failed (${response.status}):`, errText);
    throw new Error(`[Export Job] ${response.status} - ${errText}`);
  }

  // The poll URL is returned in the Location header
  return response.headers.get('Location');
}

async function pollJobStatus(pollUrl: string, accessToken: string, clientId: string) {
  const maxRetries = 30; // 30 seconds max wait
  let retries = 0;

  while (retries < maxRetries) {
    const response = await fetch(pollUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': clientId,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to poll job status: ${await response.text()}`);
    }

    const data = await response.json();

    if (data.status === 'done') {
      return data.asset.downloadUri;
    } else if (data.status === 'failed') {
      throw new Error('Adobe PDF Services job failed.');
    }

    // Wait 1 second before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
    retries++;
  }

  throw new Error('Export job timed out');
}

async function downloadResult(downloadUri: string) {
  const response = await fetch(downloadUri);
  if (!response.ok) {
    throw new Error(`Failed to download result: ${await response.text()}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetFormat = formData.get('targetFormat') as string | null; // 'DOCX', 'PPTX', 'XLSX'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (!targetFormat) {
      return NextResponse.json({ error: 'No targetFormat provided' }, { status: 400 });
    }

    const clientId = process.env.PDF_SERVICES_CLIENT_ID;
    const clientSecret = process.env.PDF_SERVICES_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Adobe PDF Services credentials missing in backend configuration' }, { status: 500 });
    }

    // Read the incoming file into a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Step 1: Get Access Token
    const accessToken = await getAccessToken(clientId, clientSecret);

    // Step 2: Request Upload URI
    const assetResponse = await getUploadUri(accessToken, clientId, 'application/pdf');
    const uploadUri = assetResponse.uploadUri;
    const assetId = assetResponse.assetID;

    // Step 3: Upload the File
    await uploadFileToUri(uploadUri, fileBuffer, 'application/pdf');

    // Step 4: Submit the Export Job
    const pollUrl = await submitExportJob(accessToken, clientId, assetId, targetFormat);

    if (!pollUrl) {
       throw new Error("Missing poll URL from export job submission");
    }

    // Step 5: Poll for Completion
    const downloadUri = await pollJobStatus(pollUrl, accessToken, clientId);

    // Step 6: Download the Result
    const resultBuffer = await downloadResult(downloadUri);

    // Return the converted file stream to the client
    return new NextResponse(resultBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', `.${targetFormat.toLowerCase()}`)}"`,
        'Content-Type': 'application/octet-stream',
      },
    });

  } catch (err: any) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error processing request' }, { status: 500 });
  }
}
