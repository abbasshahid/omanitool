/**
 * Uplink meter.
 *
 * OmniTool processes files in your browser, so nothing you open should ever be
 * sent anywhere. Rather than asserting that in marketing copy, we measure it:
 * `fetch` and `XMLHttpRequest.send` are wrapped to total the bytes of every
 * request body the page produces, and the UI reports that number.
 *
 * Counting request *bodies* rather than resource timings is deliberate. Page
 * assets and Next.js route prefetches are bodyless GETs, so they contribute
 * nothing — the figure reflects data leaving your machine and nothing else.
 * If a tool ever did upload, the number would climb, which is the point.
 */

type Listener = (bytes: number) => void;

const listeners = new Set<Listener>();
let bytesSent = 0;
let installed = false;

function publish() {
  for (const listener of listeners) listener(bytesSent);
}

function add(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return;
  bytesSent += bytes;
  publish();
}

/** Best-effort byte length of a request body, without consuming streams. */
function sizeOf(body: unknown): number {
  if (body == null) return 0;
  if (typeof body === 'string') return new Blob([body]).size;
  if (body instanceof Blob) return body.size;
  if (body instanceof ArrayBuffer) return body.byteLength;
  if (ArrayBuffer.isView(body)) return body.byteLength;
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    let total = 0;
    body.forEach((value) => {
      total += value instanceof File ? value.size : new Blob([String(value)]).size;
    });
    return total;
  }
  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
    return new Blob([body.toString()]).size;
  }
  // ReadableStream and anything exotic: unmeasurable without consuming it.
  return 0;
}

export function installUplinkMeter() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  const nativeFetch = window.fetch;
  window.fetch = function patchedFetch(input: RequestInfo | URL, init?: RequestInit) {
    try {
      if (init?.body != null) {
        add(sizeOf(init.body));
      } else if (typeof Request !== 'undefined' && input instanceof Request && input.body) {
        // A Request carrying a stream body; size is not knowable up front.
        add(0);
      }
    } catch {
      // Measuring must never break the request it is measuring.
    }
    return nativeFetch.call(this, input as RequestInfo, init);
  };

  const nativeSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function patchedSend(this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    try {
      if (body != null && !(typeof Document !== 'undefined' && body instanceof Document)) {
        add(sizeOf(body));
      }
    } catch {
      // As above.
    }
    return nativeSend.call(this, body as XMLHttpRequestBodyInit | null);
  };
}

export function subscribeToUplink(listener: Listener): () => void {
  listeners.add(listener);
  listener(bytesSent);
  return () => {
    listeners.delete(listener);
  };
}

export function getBytesSent() {
  return bytesSent;
}

/** Formats a byte count the way an instrument would: terse and unpadded. */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const decimals = exponent === 0 ? 0 : value < 10 ? 1 : 0;
  return `${value.toFixed(decimals)} ${units[exponent]}`;
}
