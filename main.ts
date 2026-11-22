// LEONIDA WORLD — gta6-meme-x-01 entry #3 (Node 22, standard library only).
// The entry is the X post itself: this program's only job is to carry the
// post's address from POST.json in the repository to /output/POST.json,
// where the gate reads it. The house reads the post (first picture + text)
// from X and hands that to the judge; nothing written here is judged.
//
// This is the third entry for this bounty from this account. It reuses the
// LEONIDA WORLD ticket meme from entry #2, but the post lives on a different
// X account: entry #2's post is on @aisminzcys, which was suspended on
// 22 Nov 2026, so this entry's post is https://x.com/AmberRvR/status/2124321932091019448
// and POST.json already holds that live address — no placeholder step.
//
// Run locally to check the copy works:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// out/POST.json must then be byte for byte the repository's POST.json.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly with a plain message and a non-zero exit when the entry's
// post address cannot be carried over; a silent or partial copy would
// leave the gate with nothing to check.
function fail(message) {
  console.error(message);
  process.exit(1);
}

// Read POST.json and return its url, after checking it is a non-empty
// string. The gate only accepts a real post address, so anything else
// here is a broken entry, not something to copy through.
function readPostUrl(source) {
  if (!existsSync(source)) {
    fail(`POST.json not found: looked for ${source} (MAKEFUN_BOT_DIR=${BOT_DIR})`);
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(source, 'utf8'));
  } catch {
    fail(`POST.json in ${BOT_DIR} is not valid JSON`);
  }
  if (typeof parsed.url !== 'string' || parsed.url.length === 0) {
    fail('POST.json has no url string: expected {"url": "<https://x.com/.../status/...>"}');
  }
  return parsed.url;
}

// Copy POST.json byte for byte into the output directory, so the address
// the gate reads is exactly the address committed in the repository.
function copyPost() {
  const source = join(BOT_DIR, 'POST.json');
  const target = join(OUTPUT_DIR, 'POST.json');
  readPostUrl(source);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(source, target);
  console.log(`Copied POST.json to ${target}`);
}

copyPost();
