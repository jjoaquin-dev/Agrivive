import { request as httpsRequest } from "node:https";

type BunRequestInit = RequestInit & {
  proxy?: string | URL;
};

const configuredProxy = process.env.ADVISORY_HTTP_PROXY?.trim();

function requestDirect(url: string, signal: AbortSignal): Promise<Response> {
  const target = new URL(url);

  return new Promise((resolve, reject) => {
    const request = httpsRequest(
      {
        hostname: target.hostname,
        port: target.port || 443,
        path: `${target.pathname}${target.search}`,
        method: "GET",
        headers: { accept: "application/json" },
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          const headers = new Headers();
          for (const [name, value] of Object.entries(response.headers)) {
            if (typeof value === "string") headers.set(name, value);
            else if (Array.isArray(value)) headers.set(name, value.join(", "));
          }
          resolve(new Response(Buffer.concat(chunks), {
            status: response.statusCode ?? 502,
            headers,
          }));
        });
      },
    );

    const abort = () => request.destroy(new Error("advisory request aborted"));
    const cleanup = () => signal.removeEventListener("abort", abort);
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener("abort", abort, { once: true });
    }

    request.on("error", (error) => {
      cleanup();
      reject(error);
    });
    request.on("close", cleanup);
    request.end();
  });
}

export function fetchAdvisorySource(url: string, signal: AbortSignal): Promise<Response> {
  if (!configuredProxy && new URL(url).protocol === "https:") {
    return requestDirect(url, signal);
  }

  const init: BunRequestInit = {
    signal,
    headers: { accept: "application/json" },
    ...(configuredProxy ? { proxy: configuredProxy } : {}),
  };
  return fetch(url, init);
}
