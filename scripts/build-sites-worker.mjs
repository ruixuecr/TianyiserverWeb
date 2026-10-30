import { readFile, readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import ts from "typescript";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.resolve(
  process.argv[2] || path.join(root, ".preview/sites-export"),
);
const output = path.resolve(process.argv[3] || path.join(root, "dist"));
if (
  output === root ||
  input === output ||
  input.startsWith(output + path.sep) ||
  root.startsWith(output + path.sep)
) {
  throw new Error("Worker output must be a separate generated directory.");
}
const manifest = JSON.parse(
  await readFile(path.join(root, ".openai/hosting.json"), "utf8"),
);
if (manifest.static)
  throw new Error("Remove the static manifest field when publishing a Worker.");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const assets = {};
// Originals stay in the public application repository and static export. Pin
// their delivery to verified Git bytes; keep responsive images in the Worker.
const imageCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();
if (!/^[a-f0-9]{40}$/.test(imageCommit))
  throw new Error("Invalid image commit.");
let originalCount = 0;
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(filename);
    else {
      const route =
        "/" + path.relative(input, filename).split(path.sep).join("/");
      const content = await readFile(filename);
      const type = types[path.extname(filename)] || "application/octet-stream";
      if (
        route.startsWith("/images/") &&
        !route.startsWith("/images/optimized/") &&
        /\.(png|jpe?g|webp)$/i.test(route)
      ) {
        const gitPath = `public${route}`;
        const committed = execFileSync(
          "git",
          ["show", `${imageCommit}:${gitPath}`],
          {
            cwd: root,
            maxBuffer: 32 * 1024 * 1024,
          },
        );
        if (!content.equals(committed))
          throw new Error(
            `Commit original image changes before building: ${gitPath}`,
          );
        assets[route] = {
          type,
          source: `https://raw.githubusercontent.com/ruixuecr/TianyiserverWeb/${imageCommit}/${gitPath.split("/").map(encodeURIComponent).join("/")}`,
          sha256: createHash("sha256").update(content).digest("hex"),
          size: content.length,
        };
        originalCount++;
        continue;
      }
      assets[route] = {
        type,
        body: gzipSync(content, { level: 9 }).toString("base64"),
      };
    }
  }
}
await collect(input);
if (!assets["/index.html"] || !assets["/404.html"])
  throw new Error("Incomplete static export.");
const shared = ts.transpileModule(
  await readFile(path.join(root, "lib/amap-service.ts"), "utf8"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  },
).outputText;
const worker = (await readFile(path.join(root, "sites/worker.mjs"), "utf8"))
  .replace(
    'import assets from "./generated-assets.mjs";',
    `const assets = ${JSON.stringify(assets)};`,
  )
  .replace(
    'import { mapConfiguration, proxyMapRequest } from "../lib/amap-service.ts";',
    shared,
  );
// Keep below the hosted Worker compressed script limit; never silently drop assets.
const compressedSize = gzipSync(worker).length;
if (compressedSize > 10 * 1024 * 1024)
  throw new Error(
    "Worker exceeds 10 MiB compressed. Use an asset-backed build before publishing.",
  );
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, "server"), { recursive: true });
await mkdir(path.join(output, ".openai"), { recursive: true });
await writeFile(path.join(output, "server/index.js"), worker);
await writeFile(
  path.join(output, ".openai/hosting.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Worker contains ${Object.keys(assets).length} asset routes (${originalCount} pinned originals); ${(compressedSize / 1024 / 1024).toFixed(2)} MiB compressed. Runtime credentials are not included.`,
);
