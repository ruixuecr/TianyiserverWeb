<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project handoff

- Read docs/PROJECT_REQUIREMENTS.md, docs/TECHNICAL_ARCHITECTURE.md, docs/CONVERSATION_HANDOFF.md, and docs/DEVELOPMENT_HANDOFF.md before continuing this project.
- mapapi is the current development line. Keep main as the original demo unless the user explicitly changes that decision.
- Preserve the confirmed map style, Wuhan boundary, label design, natural image proportions, and simplified page layouts. The user has restored 2D/3D switching on all map pages; keep 3D as the default and preserve selection, filters, center and zoom when switching.
- The user explicitly authorized committing the public AMap Web JS API Key (NEXT_PUBLIC_AMAP_KEY) in .env.example on 2026-10-30. This exception does not cover AMAP_SECURITY_CODE, authentication tokens, or .env.local; keep those out of Git. Do not mistake HTTP success or a build pass for verified live map behavior.
- Keep handoff documents aligned with implemented behavior and newly confirmed decisions; mark unresolved location and cloud setup work explicitly.
- Do not add promotional copy, decorative slogans, or narrative descriptions unless supplied or explicitly confirmed by the user. Preserve supplied wording; omit missing descriptions instead of inventing filler. Necessary functional labels and factual status messages may remain.
- The user requires completed code, documentation, and repository memory updates to be committed and pushed to GitHub on the current authorized work branch. Verify local and remote commits match before reporting synchronization complete; keep server secrets, authentication tokens and ignored runtime/build artifacts out of Git. The explicitly authorized browser Key in .env.example is the only credential exception.
- Release workflow confirmed on 2026-10-30: publish every completed website change to the existing Sites preview and sync GitHub first. Accumulate changes for Tencent Cloud; update the production server only when the user explicitly requests a combined release (their "hot update"). Do not treat a normal website edit, preview publication, or GitHub push as authorization to update production. Documentation-only changes require GitHub synchronization, not a redundant Sites deployment.
