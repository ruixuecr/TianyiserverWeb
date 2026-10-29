import assert from "node:assert/strict";
import { test } from "node:test";
import { mapConfiguration, proxyMapRequest } from "../lib/amap-service.ts";

test("public configuration never exposes the server security code", async () => {
  const response = mapConfiguration({ NEXT_PUBLIC_AMAP_KEY: "public-test-key", AMAP_SECURITY_CODE: "private-test-code" });
  assert.deepEqual(await response.json(), { key: "public-test-key" });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await mapConfiguration({}).json(), { key: "" });
});

test("proxy accepts only supported paths and methods without contacting upstream", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", () => { throw new Error("Unexpected upstream request"); });
  const request = new Request("https://preview.example/_AMapService/v3/place/text");
  for (const endpoint of ["https://elsewhere.example/", "v3/../secret", "v3/%2e%2e/secret", "v6/place/text"]) {
    assert.equal((await proxyMapRequest(request, endpoint, { AMAP_SECURITY_CODE: "private-test-code" })).status, 400);
  }
  assert.equal((await proxyMapRequest(request, "v3/place/text", {})).status, 503);
  assert.equal((await proxyMapRequest(new Request(request, { method: "POST" }), "v3/place/text", { AMAP_SECURITY_CODE: "private-test-code" })).status, 405);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("style and REST requests use fixed upstreams, overwrite jscode, preserve bytes and disable caching", async (t) => {
  const requests = [];
  t.mock.method(globalThis, "fetch", async (target, options) => {
    requests.push({ target, options });
    return new Response(new Uint8Array([0, 255, 13, 10]), { headers: { "Content-Type": "application/octet-stream" } });
  });
  const request = new Request("https://preview.example/?key=public-test-key&jscode=untrusted&callback=amapCallback");
  for (const endpoint of ["v4/map/styles", "v3/place/text"]) {
    const response = await proxyMapRequest(request, endpoint, { AMAP_SECURITY_CODE: "private-test-code" });
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [0, 255, 13, 10]);
    assert.equal(response.headers.get("Cache-Control"), "no-store, max-age=0");
  }
  assert.equal(requests[0].target.host, "webapi.amap.com");
  assert.equal(requests[1].target.host, "restapi.amap.com");
  for (const { target, options } of requests) {
    assert.equal(target.searchParams.get("jscode"), "private-test-code");
    assert.equal(target.searchParams.get("callback"), "amapCallback");
    assert.equal(options.redirect, "manual");
    assert.equal(options.cache, "no-store");
  }
});

test("upstream errors do not expose credentials or request details", async (t) => {
  const logs = [];
  t.mock.method(console, "warn", (...messages) => logs.push(messages.join(" ")));
  t.mock.method(globalThis, "fetch", async () => { throw new Error("private-test-code in upstream failure"); });
  const response = await proxyMapRequest(new Request("https://preview.example/"), "v3/place/text", { AMAP_SECURITY_CODE: "private-test-code" });
  assert.equal(response.status, 502);
  assert.equal(await response.text(), "Map service unavailable");
  assert(!logs.join(" ").includes("private-test-code"));
});

test("Worker mode omits unsupported cache options and never follows upstream redirects", async (t) => {
  t.mock.method(globalThis, "fetch", async (_target, options) => {
    assert.equal(options.cache, undefined);
    assert.equal(options.redirect, "manual");
    assert.equal(options.headers["Cache-Control"], "no-cache");
    return new Response(null, { status: 302, headers: { Location: "https://elsewhere.example/" } });
  });
  const response = await proxyMapRequest(new Request("https://preview.example/"), "v3/place/text", { AMAP_SECURITY_CODE: "private-test-code" }, {});
  assert.equal(response.status, 502);
  assert.equal(response.headers.get("Location"), null);
});
