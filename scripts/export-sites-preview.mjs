// Build an isolated static preview; the application keeps its Next.js server.
import { cp, mkdir, readdir, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(root, "package.json"));
// sharp is provided by the locked Next.js installation; no extra dependency.
const sharp = require("sharp");
const { imageConfigDefault } = require("next/dist/shared/lib/image-config.js");
const output = path.resolve(process.argv[2] || path.join(root, ".preview/sites-export"));
const build = path.join(root, ".preview/sites-build");
if (output === root || output === build || build.startsWith(output + path.sep)) {
  throw new Error("Choose a separate generated output directory.");
}
await rm(build, { recursive: true, force: true });
await mkdir(build, { recursive: true });
for (const entry of ["app", "components", "lib", "public", "package.json", "package-lock.json", "postcss.config.mjs", "tsconfig.json", "next-env.d.ts"]) {
  await cp(path.join(root, entry), path.join(build, entry), { recursive: true });
}
// Static hosting cannot execute the AMap security proxy. Never copy .env files.
await rm(path.join(build, "app/api"), { recursive: true, force: true });
await symlink(path.join(root, "node_modules"), path.join(build, "node_modules"), "dir");

const imageMap = {};
const optimized = path.join(build, "public/images/optimized");
await mkdir(optimized, { recursive: true });
// Merge display sizes in the embedded Sites build: 640/750/828/1080/1200
// -> 1280, and 1920/2048 -> 3840 (capped at the original width).
// Common 1260/1280px originals share
// their full-size WebP with larger requests. Small 32/48/64px thumbnails remain;
// original files, highest resolutions and quality stay unchanged.
const deviceSizes = imageConfigDefault.deviceSizes
  .filter((width) => ![640, 750, 828, 1080, 1920, 2048].includes(width))
  .map((width) => (width === 1200 ? 1280 : width));
// Use the existing 384px rendition for intermediate thumbnail requests.
const imageSizes = imageConfigDefault.imageSizes.filter(
  (width) => ![96, 128, 256].includes(width),
);
const widths = [...deviceSizes, ...imageSizes];
async function optimizeDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await optimizeDirectory(file);
    } else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
      const src = "/" + path.relative(path.join(root, "public"), file).split(path.sep).join("/");
      const metadata = await sharp(file).metadata();
      const digest = createHash("sha256").update(src).digest("hex").slice(0, 12);
      imageMap[src] = {};
      for (const width of new Set(widths.map((width) => Math.min(width, metadata.width)))) {
        const name = `${digest}-${width}.webp`;
        await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 75 }).toFile(path.join(optimized, name));
      }
      for (const width of widths) {
        imageMap[src][width] = `/images/optimized/${digest}-${Math.min(width, metadata.width)}.webp`;
      }
    }
  }
}
await optimizeDirectory(path.join(root, "public/images"));
await writeFile(path.join(build, "sites-image-loader.ts"), `"use client";
const images: Record<string, Record<number, string>> = ${JSON.stringify(imageMap)};
export default function imageLoader({src, width}: {src: string; width: number}) {
  const result = images[src]?.[width];
  if (!result) throw new Error("Static preview image has no optimized variant: " + src + " @ " + width);
  return result;
}
`);
await writeFile(path.join(build, "next.config.ts"), `import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  devIndicators: false,
  images: { loader: "custom", loaderFile: "./sites-image-loader.ts", deviceSizes: ${JSON.stringify(deviceSizes)}, imageSizes: ${JSON.stringify(imageSizes)} },
};
export default config;
`);
console.log(`Prepared responsive WebP variants for ${Object.keys(imageMap).length} images.`);
execFileSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
  cwd: build,
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_AMAP_KEY: "", AMAP_SECURITY_CODE: "", NEXT_TELEMETRY_DISABLED: "1" },
});
// Preserve legacy event entry links without a server redirect.
for (const id of ["weekend", "sunset", "walk"]) {
  const directory = path.join(build, "out/events", id);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/events/"><title>活动现场 · 江城 Encore</title><a href="/events/">前往活动现场</a></html>');
}
await mkdir(path.dirname(output), { recursive: true });
await rm(output, { recursive: true, force: true });
await cp(path.join(build, "out"), output, { recursive: true });
console.log(`Static preview exported to ${output}. AMap server proxy is excluded.`);
