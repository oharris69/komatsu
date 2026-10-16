#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * Uploads imported pages to Document Authoring, copying their source-site images into DA first.
 *
 * For each page (content/<path>.plain.html):
 *   1. every image on the source host (src / srcset) is downloaded once and uploaded to
 *      DA under media/<asset path>, mirroring the source DAM structure (shared across pages)
 *   2. image URLs in the page are rewritten to the DA copies
 *   3. the page is wrapped as a DA document and uploaded to <path>.html
 *
 * Re-runnable: assets already in the manifest or already in DA are not uploaded again.
 *
 * Usage:
 *   node tools/importer/upload-to-da.mjs <page-path>... [--source-host=www.komatsu.com]
 *     [--dry-run] [--skip-pages]
 *   node tools/importer/upload-to-da.mjs --urls=tools/importer/urls-article.txt
 */

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const OUT_DIR = 'migration-work/da-upload';
const MANIFEST = path.join(OUT_DIR, 'media-manifest.json');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.avif': 'image/avif',
};

function parseArgs(argv) {
  const opts = {
    pages: [], sourceHost: 'www.komatsu.com', dryRun: false, skipPages: false,
  };
  argv.forEach((a) => {
    if (a.startsWith('--source-host=')) [, opts.sourceHost] = a.split('=');
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--skip-pages') opts.skipPages = true;
    else if (a.startsWith('--urls=')) {
      fs.readFileSync(a.split('=')[1], 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)
        .forEach((u) => opts.pages.push(new URL(u).pathname));
    } else opts.pages.push(a);
  });
  opts.pages = opts.pages.map((p) => p.replace(/^\/+/, '').replace(/\.(plain\.)?html$/, ''));
  return opts;
}

function daTarget() {
  const fstab = fs.readFileSync('fstab.yaml', 'utf8');
  const m = fstab.match(/https:\/\/content\.da\.live\/([^/]+)\/([^/\s"]+)/);
  if (!m) throw new Error('fstab.yaml does not point at content.da.live');
  return { org: m[1], repo: m[2] };
}

/** media/<dam path without /content/dam/>, each segment made URL- and DA-safe */
function mediaPath(url) {
  const segments = url.pathname.replace(/^\/content\/dam\//, '').split('/').filter(Boolean)
    .map((s) => decodeURIComponent(s).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-')
      .replace(/^-|-$/g, ''));
  return `media/${segments.join('/')}`;
}

async function curlStatus(args) {
  const { stdout } = await run('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', ...args], { maxBuffer: 1024 * 1024 });
  return Number(stdout.trim());
}

async function daExists(target, daPath) {
  return (await curlStatus([`https://admin.da.live/source/${target.org}/${target.repo}/${daPath}`])) === 200;
}

async function daUpload(target, daPath, file, type) {
  const status = await curlStatus(['-X', 'POST', '-F', `data=@${file};type=${type}`, `https://admin.da.live/source/${target.org}/${target.repo}/${daPath}`]);
  if (status === 401 || status === 403) {
    throw new Error(`DA upload refused (HTTP ${status}): enable Adobe credentials for Document Authoring uploads in Settings`);
  }
  if (status < 200 || status >= 300) throw new Error(`DA upload of ${daPath} failed: HTTP ${status}`);
}

async function download(url, file) {
  const resp = await fetch(url, { headers: { 'user-agent': UA } });
  if (!resp.ok) throw new Error(`download ${url}: HTTP ${resp.status}`);
  const type = (resp.headers.get('content-type') || '').split(';')[0];
  if (!type.startsWith('image/')) throw new Error(`download ${url}: not an image (${type})`);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(file, buf);
  return { type, bytes: buf.length };
}

/** all source-host image URLs referenced by src / srcset, as they appear in the HTML */
function findImages(html, host) {
  const found = new Set();
  const add = (raw) => {
    const value = raw.trim().split(/\s+/)[0];
    if (!value) return;
    try {
      const u = new URL(value.replace(/&amp;/g, '&'));
      if (u.host === host) found.add(value);
    } catch (e) { /* relative or invalid: not a source-host image */ }
  };
  [...html.matchAll(/\bsrc="([^"]+)"/g)].forEach((m) => add(m[1]));
  [...html.matchAll(/\bsrcset="([^"]+)"/g)].forEach((m) => m[1].split(',').forEach(add));
  return [...found];
}

/**
 * Edge Delivery refuses to preview a document with an image over 20MB, and multi-megabyte DAM
 * originals are slow anyway: originals over this size are replaced by the DAM's web rendition.
 */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const RENDITIONS = ['cq5dam.zoom.2048.2048.jpeg', 'cq5dam.web.1280.1280.jpeg'];

/** first DAM rendition of an oversized asset that is within the size limit, or null */
async function downloadRendition(key, file) {
  // eslint-disable-next-line no-restricted-syntax
  for (const name of RENDITIONS) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const meta = await download(`${key}/jcr:content/renditions/${name}`, file);
      if (meta.bytes <= MAX_IMAGE_BYTES) return meta;
    } catch (e) { /* rendition missing: try the next one */ }
  }
  return null;
}

async function copyImage(raw, ctx) {
  const url = new URL(raw.replace(/&amp;/g, '&'));
  const key = `${url.origin}${url.pathname}`;
  const oversized = ctx.manifest[key] && ctx.manifest[key].bytes > MAX_IMAGE_BYTES;
  if (ctx.manifest[key] && !oversized) return { raw, entry: ctx.manifest[key], status: 'cached' };
  let daPath = mediaPath(url);
  if (!path.extname(daPath)) daPath += '.jpg';
  let type = TYPES[path.extname(daPath).toLowerCase()];
  let entry = { daPath, url: `https://content.da.live/${ctx.target.org}/${ctx.target.repo}/${daPath}` };
  if (ctx.dryRun) return { raw, entry, status: 'dry-run' };
  if (!oversized && await daExists(ctx.target, daPath)) {
    ctx.manifest[key] = entry;
    return { raw, entry, status: 'exists' };
  }
  const file = path.join(ctx.tmp, path.basename(daPath));
  let meta = await download(key, file);
  if (meta.bytes > MAX_IMAGE_BYTES) {
    const rendition = await downloadRendition(key, file);
    if (!rendition) {
      throw new Error(`${key}: ${(meta.bytes / 1e6).toFixed(1)}MB and no web rendition under the limit`);
    }
    meta = { ...rendition, original: meta.bytes };
    daPath = `${daPath.replace(/\.[^./]+$/, '')}.jpg`;
    type = 'image/jpeg';
    entry = { daPath, url: `https://content.da.live/${ctx.target.org}/${ctx.target.repo}/${daPath}` };
  }
  await daUpload(ctx.target, daPath, file, type || meta.type);
  fs.rmSync(file);
  ctx.manifest[key] = { ...entry, bytes: meta.bytes, type: meta.type };
  if (meta.original) ctx.manifest[key].originalBytes = meta.original;
  return { raw, entry: ctx.manifest[key], status: 'uploaded' };
}

async function inBatches(items, size, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    // eslint-disable-next-line no-await-in-loop
    results.push(...await Promise.all(items.slice(i, i + size).map(fn)));
  }
  return results;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.pages.length) {
    console.error('Usage: node tools/importer/upload-to-da.mjs <page-path>... [--urls=<file>] [--source-host=<host>] [--dry-run] [--skip-pages]');
    process.exit(2);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const ctx = {
    target: daTarget(),
    manifest: fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {},
    tmp: fs.mkdtempSync(path.join(os.tmpdir(), 'da-media-')),
    dryRun: opts.dryRun,
  };
  const totals = {
    pages: 0, uploaded: 0, exists: 0, cached: 0, 'dry-run': 0, failed: 0,
  };
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const page of opts.pages) {
      const src = `content/${page}.plain.html`;
      if (!fs.existsSync(src)) {
        console.error(`✗ ${page}: ${src} not found (import it first)`);
        totals.failed += 1;
        // eslint-disable-next-line no-continue
        continue;
      }
      let html = fs.readFileSync(src, 'utf8');
      const images = findImages(html, opts.sourceHost);
      // eslint-disable-next-line no-await-in-loop
      const results = await inBatches(
        images,
        4,
        (raw) => copyImage(raw, ctx).catch((e) => ({ raw, error: e.message })),
      );
      const failed = results.filter((r) => r.error);
      results.filter((r) => r.entry).forEach((r) => {
        html = html.split(r.raw).join(r.entry.url);
        totals[r.status] += 1;
      });
      failed.forEach((r) => console.error(`  ✗ ${r.raw}: ${r.error}`));
      totals.failed += failed.length;
      fs.writeFileSync(MANIFEST, `${JSON.stringify(ctx.manifest, null, 2)}\n`);

      const doc = path.join(OUT_DIR, `${page}.html`);
      fs.mkdirSync(path.dirname(doc), { recursive: true });
      fs.writeFileSync(doc, `<body>\n  <header></header>\n  <main>\n${html}\n  </main>\n  <footer></footer>\n</body>\n`);
      const summary = results.reduce((acc, r) => ({ ...acc, [r.status || 'failed']: (acc[r.status || 'failed'] || 0) + 1 }), {});
      if (!opts.dryRun && !opts.skipPages && !failed.length) {
        // eslint-disable-next-line no-await-in-loop
        await daUpload(ctx.target, `${page}.html`, doc, 'text/html');
        totals.pages += 1;
        console.log(`✓ ${page}: ${images.length} image(s) ${JSON.stringify(summary)}, page uploaded`);
      } else {
        console.log(`${failed.length ? '✗' : '•'} ${page}: ${images.length} image(s) ${JSON.stringify(summary)}, page ${failed.length ? 'NOT uploaded (image failures)' : 'not uploaded'}`);
      }
    }
  } finally {
    fs.rmSync(ctx.tmp, { recursive: true, force: true });
  }
  console.log(`\nDone: ${totals.pages} page(s) uploaded; images uploaded ${totals.uploaded}, already in DA ${totals.exists}, reused ${totals.cached}, failed ${totals.failed}${opts.dryRun ? ` (dry run: ${totals['dry-run']} planned)` : ''}`);
  process.exit(totals.failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
