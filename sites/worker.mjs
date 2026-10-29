// The build embeds the static export and the shared, server-only map handlers.
import assets from "./generated-assets.mjs";
import { mapConfiguration, proxyMapRequest } from "../lib/amap-service.ts";

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
      return proxyMapRequest(request, url.pathname.slice(prefix.length), env, {});
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
