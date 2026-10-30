// Run after build-sites-worker.mjs. No live network or credentials are needed.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
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
const request = (route, options) =>
  new Request("https://preview.example" + route, options);
const pins = new Set();
let outboundRequests = 0;
try {
  globalThis.fetch = async () => {
    outboundRequests++;
    throw new Error("Static assets must not require a Worker subrequest");
  };
  for (const route of originals) {
    const response = await worker.fetch(
      request(route + "?url=https://invalid.example", {
        headers: {
          Authorization: "Bearer do-not-forward",
          Cookie: "private=do-not-forward",
        },
      }),
      {},
    );
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("Cache-Control"), "no-cache");
    assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
    const location = new URL(response.headers.get("Location"));
    assert.equal(location.origin, "https://raw.githubusercontent.com");
    const match = location.pathname.match(
      /^\/ruixuecr\/TianyiserverWeb\/([a-f0-9]{40})\/public(\/images\/.+)$/,
    );
    assert(match);
    pins.add(match[1]);
    assert.equal(decodeURIComponent(match[2]), route);
    assert.equal(location.search, "");
    assert.equal(location.username, "");
    assert.equal(location.password, "");
    const committed = execFileSync(
      "git",
      ["show", `${match[1]}:public${route}`],
      { cwd: root, maxBuffer: 32 * 1024 * 1024 },
    );
    assert.deepEqual(
      committed,
      await fs.readFile(path.join(root, "public", route)),
    );
    const head = await worker.fetch(request(route, { method: "HEAD" }), {});
    assert.equal(head.status, 302);
    assert.equal(head.headers.get("Location"), location.href);
    assert.equal((await head.arrayBuffer()).byteLength, 0);
  }
  assert.equal(pins.size, 1);
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
  assert.equal(outboundRequests, 0);
  console.log(
    JSON.stringify({
      originals: originals.length,
      embeddedVariants: variants.length,
      pinnedCommit: [...pins][0],
      redirectsAndCommittedBytes: "passed",
      outboundRequests,
    }),
  );
} finally {
  globalThis.fetch = originalFetch;
}
