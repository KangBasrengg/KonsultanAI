import https from "node:https";
import http from "node:http";

/**
 * Forces IPv4 DNS resolution and disables stale socket pooling,
 * preventing Undici `TypeError: fetch failed` errors on cPanel/CloudLinux hosting.
 */
export async function ipv4Fetch(
  input: string | URL | Request,
  init: RequestInit = {}
): Promise<Response> {
  const urlStr =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

  const parsed = new URL(urlStr);
  const lib = parsed.protocol === "https:" ? https : http;
  const method = (
    init.method || (input instanceof Request ? input.method : "GET")
  ).toUpperCase();

  const headers: Record<string, string> = {};
  const copyHeaders = (src: HeadersInit | undefined) => {
    if (!src) return;
    if (src instanceof Headers) {
      src.forEach((v, k) => {
        headers[k] = v;
      });
    } else if (Array.isArray(src)) {
      for (const [k, v] of src) {
        headers[k] = v;
      }
    } else {
      Object.assign(headers, src);
    }
  };

  if (input instanceof Request) {
    copyHeaders(input.headers);
  }
  copyHeaders(init.headers);

  let bodyBuf: Buffer | undefined;
  if (init.body !== undefined && init.body !== null) {
    if (typeof init.body === "string") {
      bodyBuf = Buffer.from(init.body, "utf8");
    } else if (Buffer.isBuffer(init.body)) {
      bodyBuf = init.body;
    } else if (init.body instanceof Uint8Array) {
      bodyBuf = Buffer.from(init.body);
    } else {
      bodyBuf = Buffer.from(String(init.body), "utf8");
    }
  }

  if (bodyBuf && !headers["Content-Length"] && !headers["content-length"]) {
    headers["Content-Length"] = String(bodyBuf.byteLength);
  }

  return new Promise<Response>((resolve, reject) => {
    if (init.signal?.aborted) {
      const abortErr = new Error("The operation was aborted.");
      abortErr.name = "AbortError";
      reject(abortErr);
      return;
    }

    const req = lib.request(
      parsed,
      {
        method,
        headers,
        family: 4,
        agent: false,
        timeout: 60000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        res.on("end", () => {
          cleanup();
          const buf = Buffer.concat(chunks);
          const status = res.statusCode || 500;
          const respHeaders = new Headers();
          for (const [k, v] of Object.entries(res.headers)) {
            if (Array.isArray(v)) {
              for (const item of v) respHeaders.append(k, item);
            } else if (v !== undefined) {
              respHeaders.set(k, String(v));
            }
          }
          const noBodyStatus = status === 204 || status === 205 || status === 304;
          resolve(
            new Response(noBodyStatus ? null : buf, {
              status,
              statusText: res.statusMessage || "",
              headers: respHeaders,
            })
          );
        });
      }
    );

    const onAbort = () => {
      const abortErr = new Error("The operation was aborted.");
      abortErr.name = "AbortError";
      req.destroy(abortErr);
    };

    const cleanup = () => {
      if (init.signal) {
        init.signal.removeEventListener("abort", onAbort);
      }
    };

    if (init.signal) {
      init.signal.addEventListener("abort", onAbort, { once: true });
    }

    req.on("timeout", () => {
      cleanup();
      req.destroy(new Error(`Koneksi timeout ke ${parsed.hostname}`));
    });

    req.on("error", (err) => {
      cleanup();
      reject(err);
    });

    if (bodyBuf) {
      req.write(bodyBuf);
    }
    req.end();
  });
}

export async function ipv4FetchWithRetry(
  url: string,
  init: RequestInit = {},
  maxRetries = 2,
  retryDelayMs = 1500
): Promise<Response> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await ipv4Fetch(url, init);
      if (res.ok || ![429, 502, 503, 504].includes(res.status) || attempt === maxRetries) {
        return res;
      }
      console.warn(`[ipv4Fetch] Status ${res.status} on attempt ${attempt + 1}, retrying...`);
    } catch (err: any) {
      lastError = err;
      if (err?.name === "AbortError" || attempt === maxRetries) {
        break;
      }
      console.warn(`[ipv4Fetch] Network error on attempt ${attempt + 1}:`, err?.code || err?.message);
    }

    await new Promise((r) => setTimeout(r, retryDelayMs * (attempt + 1)));
  }

  const code = lastError?.code || lastError?.cause?.code;
  const msg = lastError?.message || "Network error";
  throw new Error(code ? `${msg} (${code})` : msg);
}

