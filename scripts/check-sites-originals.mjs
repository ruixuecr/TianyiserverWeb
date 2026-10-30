// Run after build-sites-worker.mjs. No live network or credentials are needed.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../dist/server/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const originalFetch = globalThis.fetch;
const originals = [];
async function collect(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(filename);
    else if (/\.(png|jpe?g|webp)$/i.test(filename))
      originals.push("/" + path.relative(path.join(root, "public"), filename));
  }
}
await collect(path.join(root, "public/images"));
let calls = 0;
const pins = new Set();
const request = (route, options) =>
  new Request("https://preview.example" + route, options);
const read = (route) => fs.readFile(path.join(root, "public", route));
try {
  globalThis.fetch = async (source, options) => {
    calls++;
    const url = new URL(source);
    assert.equal(url.origin, "https://raw.githubusercontent.com");
    const match = url.pathname.match(
      /^\/ruixuecr\/TianyiserverWeb\/([a-f0-9]{40})\/public(\/images\/.+)$/,
    );
    assert(match);
    pins.add(match[1]);
    assert.equal(url.search, "");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers, undefined);
    assert(options.signal instanceof AbortSignal);
    return new Response(await read(decodeURIComponent(match[2])));
  };
  for (const route of originals) {
    const expected = await read(route);
    const response = await worker.fetch(
      request(route + "?url=https://invalid.example", {
        headers: {
          Authorization: "Bearer do-not-forward",
          Cookie: "private=do-not-forward",
        },
      }),
      {},
    );
    assert.equal(response.status, 200);
    assert.equal(
      response.headers.get("Content-Length"),
      String(expected.length),
    );
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
    const etag = response.headers.get("ETag");
    assert.match(etag, /^"[a-f0-9]{64}"$/);
    const before = calls;
    const head = await worker.fetch(request(route, { method: "HEAD" }), {});
    assert.equal(head.status, 200);
    assert.equal(head.headers.get("ETag"), etag);
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    const cached = await worker.fetch(
      request(route, { headers: { "If-None-Match": etag } }),
      {},
    );
    assert.equal(cached.status, 304);
    assert.equal(calls, before);
  }
  assert.equal(pins.size, 1);
  const before = calls;
  assert.equal(
    (await worker.fetch(request("/images/missing.jpg"), {})).status,
    404,
  );
  assert.equal(
    (await worker.fetch(request(originals[0], { method: "POST" }), {})).status,
    405,
  );
  assert.equal((await worker.fetch(request("/map/"), {})).status, 200);
  const variants = await fs.readdir(
    path.join(root, ".preview/sites-export/images/optimized"),
  );
  for (const variant of variants) {
    const response = await worker.fetch(
      request("/images/optimized/" + variant),
      {},
    );
    assert.equal(response.status, 200);
    assert.deepEqual(
      Buffer.from(await response.arrayBuffer()),
      await fs.readFile(
        path.join(root, ".preview/sites-export/images/optimized", variant),
      ),
    );
  }
  assert.equal(
    calls,
    before,
    "Pages and optimized images must not fetch originals",
  );
  const original = await read(originals[0]);
  for (const mode of ["unavailable", "wrong-size", "corrupt", "timeout"]) {
    globalThis.fetch = async () => {
      if (mode === "timeout") throw new Error("Timeout");
      if (mode === "unavailable") return new Response(null, { status: 404 });
      if (mode === "wrong-size") return new Response("wrong");
      const corrupt = Buffer.from(original);
      corrupt[0] ^= 1;
      return new Response(corrupt);
    };
    const response = await worker.fetch(request(originals[0]), {});
    assert.equal(response.status, 502, mode);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(
      await response.text(),
      "Original image temporarily unavailable",
    );
  }
  console.log(
    JSON.stringify({
      originals: originals.length,
      embeddedVariants: variants.length,
      pinnedCommit: [...pins][0],
      integrityAndErrors: "passed",
      credentialsNeverForwarded: true,
    }),
  );
} finally {
  globalThis.fetch = originalFetch;
}
