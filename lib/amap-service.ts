export type MapEnvironment = {
  NEXT_PUBLIC_AMAP_KEY?: string;
  AMAP_SECURITY_CODE?: string;
};

// Only the JS API key is public. Never return the security code here.
export function mapConfiguration(env: MapEnvironment) {
  return Response.json(
    { key: env.NEXT_PUBLIC_AMAP_KEY || "" },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function proxyMapRequest(
  request: Request,
  joined: string,
  env: MapEnvironment,
  fetchOptions: Pick<RequestInit, "cache"> = { cache: "no-store" },
) {
  if (request.method !== "GET" && request.method !== "HEAD")
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  if (!/^(v3|v4|v5)\/[a-zA-Z0-9/_-]+$/.test(joined))
    return new Response("Unsupported map endpoint", { status: 400 });
  if (!env.AMAP_SECURITY_CODE)
    return new Response("Map security code not configured", { status: 503 });
  const host =
    joined === "v4/map/styles"
      ? "https://webapi.amap.com/"
      : "https://restapi.amap.com/";
  const target = new URL(host + joined);
  new URL(request.url).searchParams.forEach((value, key) => {
    if (key !== "jscode") target.searchParams.set(key, value);
  });
  target.searchParams.set("jscode", env.AMAP_SECURITY_CODE);
  try {
    const response = await fetch(target, {
      ...fetchOptions,
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(10000),
      redirect: "manual",
    });
    if (response.status >= 300 && response.status < 400)
      return new Response("Map upstream redirect rejected", { status: 502 });
    return new Response(
      request.method === "HEAD" ? null : await response.arrayBuffer(),
      {
        status: response.status,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Content-Type":
            response.headers.get("Content-Type") || "application/json",
        },
      },
    );
  } catch (error) {
    // Diagnostics must never include the private code or the upstream URL.
    const message = error instanceof Error ? error.message : "Unknown failure";
    console.warn(
      "Map upstream fetch failed:",
      message
        .replaceAll(env.AMAP_SECURITY_CODE, "[redacted]")
        .replace(/https?:\/\/[^\s]+/g, "[upstream]"),
    );
    return new Response("Map service unavailable", { status: 502 });
  }
}
