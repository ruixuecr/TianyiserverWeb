// The build embeds the UI/responsive images and pins original-image sources.
import assets from "./generated-assets.mjs";
import { mapConfiguration, proxyMapRequest } from "../lib/amap-service.ts";

async function originalImage(request, asset, headers) {
  const etag = `"${asset.sha256}"`;
  headers.set("ETag", etag);
  if (request.headers.get("If-None-Match") === etag)
    return new Response(null, { status: 304, headers });
  headers.set("Content-Length", String(asset.size));
  if (request.method === "HEAD") return new Response(null, { headers });
  try {
    // Only build-generated, commit-pinned URLs are fetched. Never forward
    // visitor headers, credentials, request paths or query parameters.
    const response = await fetch(asset.source, {
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      cf: { cacheEverything: true, cacheTtl: 31536000 },
    });
    if (!response.ok) throw new Error("Original unavailable");
    const body = await response.arrayBuffer();
    if (body.byteLength !== asset.size)
      throw new Error("Original size mismatch");
    const hash = Array.from(
      new Uint8Array(await crypto.subtle.digest("SHA-256", body)),
    )
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    if (hash !== asset.sha256) throw new Error("Original integrity mismatch");
    return new Response(body, { headers });
  } catch {
    return new Response("Original image temporarily unavailable", {
      status: 502,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.replace(/\/$/, "") === "/api/map-config") {
      if (request.method !== "GET") return new Response(null, { status: 405 });
      return mapConfiguration(env);
    }
    const prefix = ["/_AMapService/", "/api/amap/"].find((prefix) =>
      url.pathname.startsWith(prefix),
    );
    if (prefix)
      return proxyMapRequest(
        request,
        url.pathname.slice(prefix.length),
        env,
        {},
      );
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return new Response("Invalid path", { status: 400 });
    }
    let asset = assets[pathname];
    if (!asset && !pathname.endsWith("/") && assets[pathname + "/index.html"]) {
      url.pathname += "/";
      return Response.redirect(url.href, 308);
    }
    if (!asset && pathname.endsWith("/"))
      asset = assets[pathname + "index.html"];
    const status = asset ? 200 : 404;
    asset ||= assets["/404.html"];
    const headers = new Headers({
      "Content-Type": asset.type,
      "Cache-Control": pathname.startsWith("/_next/static/")
        ? "public, max-age=31536000, immutable"
        : "no-cache",
      Vary: "Accept-Encoding",
      "X-Content-Type-Options": "nosniff",
    });
    if (asset.source) return originalImage(request, asset, headers);
    if (request.method === "HEAD")
      return new Response(null, { status, headers });
    const compressed = Uint8Array.from(atob(asset.body), (character) =>
      character.charCodeAt(0),
    );
    if (/\bgzip\b/.test(request.headers.get("Accept-Encoding") || "")) {
      headers.set("Content-Encoding", "gzip");
      return new Response(compressed, {
        status,
        headers,
        encodeBody: "manual",
      });
    }
    const stream = new Response(compressed).body.pipeThrough(
      new DecompressionStream("gzip"),
    );
    return new Response(stream, { status, headers });
  },
};
