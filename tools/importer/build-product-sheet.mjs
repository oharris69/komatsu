#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * Builds the cards-product spreadsheet (products.json) for equipment category listing pages
 * from the live Komatsu product feed, following migration-work/cards-product-contract.md.
 *
 * For each listing page:
 *   1. reads the listing's Commerce category uid from the page
 *      (data-category on .cmp-equipmentlisting)
 *   2. fetches every product, plus one filtered query per facet option to learn facet
 *      membership (the feed does not carry facet values per product)
 *   3. writes content/<page>/products.json (local preview) and
 *      migration-work/da-upload/<page>/products.json
 *   4. with --upload, uploads the sheet to Document Authoring at <page>/products.json
 *
 * Usage:
 *   node tools/importer/build-product-sheet.mjs <listing-url>... [--upload]
 */

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const OUT_DIR = 'migration-work/da-upload';

// feed attribute code -> sheet column (unit-dependent facets get -imperial / -metric suffixes)
const FACET_KEYS = {
  equipment_type: 'equipment-type',
  equipment_specialties: 'specialties',
};
const SKIP_FACETS = new Set(['price', 'category_uid']);
const UNIT_SYMBOLS = {
  'yd^3': 'yd³', 'm^3': 'm³', lbs: 'lbs', 'lbs.': 'lbs', kg: 'kg', hp: 'HP', kw: 'kW',
};

const slugify = (v) => String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function facetColumn(code) {
  if (FACET_KEYS[code]) return FACET_KEYS[code];
  const m = code.match(/^(.*)_(imperial|metric)$/);
  return m ? `${m[1].replace(/_/g, '-')}-${m[2]}` : code.replace(/_/g, '-');
}

/** "Bucket capacity (yd^3)" -> { name: "Bucket capacity", unit: "yd³" } */
function splitLabel(label) {
  const m = label.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!m) return { name: label.trim(), unit: '' };
  return { name: m[1].trim(), unit: UNIT_SYMBOLS[m[2].toLowerCase()] || m[2] };
}

async function getText(url) {
  const resp = await fetch(url, { headers: { 'user-agent': UA } });
  if (!resp.ok) throw new Error(`${url}: HTTP ${resp.status}`);
  return resp.text();
}

async function feed(origin, locale, uid, params = {}) {
  const q = new URLSearchParams({
    uid, c: '1', z: '200', s: 'a', e: 'y', ...params,
  });
  return JSON.parse(await getText(`${origin}/${locale}/gql/productlisting/equipment?${q}`));
}

function catalogUrls() {
  try {
    return new Set(fs.readFileSync('catalog/urls-all.json', 'utf8').match(/https:\/\/[^"\s]+/g) || []);
  } catch (e) {
    return new Set();
  }
}

/** Prefer the catalog's sub-category model page (small-excavators/<slug>) over the feed path. */
function productLink(origin, locale, aemUrl, catalog) {
  const feedPath = `/${locale}/products/${aemUrl.replace(/^\/+/, '')}`;
  const slug = feedPath.split('/').pop();
  const family = feedPath.split('/').slice(0, 5).join('/'); // /en-us/products/equipment/<family>
  const match = [...catalog].find((u) => u.startsWith(`${origin}${family}/`) && u.endsWith(`/${slug}`));
  return match ? new URL(match).pathname : feedPath;
}

async function buildSheet(pageUrl, catalog) {
  const page = new URL(pageUrl);
  const locale = page.pathname.split('/')[1];
  const html = await getText(pageUrl);
  const uid = (html.match(/class="cmp-equipmentlisting"[^>]*data-category="([^"]+)"/)
    || html.match(/data-category="([^"]+)"[^>]*class="cmp-equipmentlisting"/) || [])[1];
  if (!uid) throw new Error(`${pageUrl}: no product listing (data-category) found`);

  const all = await feed(page.origin, locale, uid);
  const facets = (all.aggregations || []).filter((a) => !SKIP_FACETS.has(a.attributeCode));
  const membership = new Map(); // sku -> Map(column -> [labels])
  // eslint-disable-next-line no-restricted-syntax
  for (const facet of facets) {
    const column = facetColumn(facet.attributeCode);
    // eslint-disable-next-line no-restricted-syntax
    for (const option of facet.options) {
      // eslint-disable-next-line no-await-in-loop
      const res = await feed(page.origin, locale, uid, { [facet.attributeCode]: option.value });
      (res.products || []).forEach((p) => {
        const cols = membership.get(p.sku) || new Map();
        cols.set(column, [...(cols.get(column) || []), option.label]);
        membership.set(p.sku, cols);
      });
    }
  }

  const specColumns = new Set();
  const rows = all.products.map((p) => {
    const row = {
      model: p.sku,
      description: p.shortDescription || '',
      link: productLink(page.origin, locale, p.aemUrl, catalog),
      image: p.imageUrl || '',
      'image-alt': p.sku,
    };
    (p.quickSpecs || []).forEach((s) => {
      const { name, unit } = splitLabel(s.attribute_label);
      const column = `${slugify(name)}-${s.som.toLowerCase()}`;
      const value = String(s.attribute_value).trim();
      row[column] = unit && !value.toLowerCase().includes(unit.toLowerCase()) ? `${value} ${unit}` : value;
      specColumns.add(column);
    });
    const cols = membership.get(p.sku) || new Map();
    facets.forEach((f) => {
      const column = facetColumn(f.attributeCode);
      row[column] = (cols.get(column) || []).join(', ');
    });
    return row;
  });
  // every row carries every column, so the sheet is rectangular
  const columns = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const data = rows.map((r) => Object.fromEntries(columns.map((c) => [c, r[c] ?? ''])));
  return {
    pagePath: page.pathname.replace(/\/$/, ''),
    sheet: {
      total: data.length, offset: 0, limit: data.length, data, ':type': 'sheet',
    },
    summary: {
      products: data.length, facets: facets.map((f) => `${facetColumn(f.attributeCode)}(${f.options.length})`), specs: [...specColumns],
    },
  };
}

async function upload(daPath, file) {
  const fstab = fs.readFileSync('fstab.yaml', 'utf8');
  const [, org, repo] = fstab.match(/https:\/\/content\.da\.live\/([^/]+)\/([^/\s"]+)/) || [];
  if (!org) throw new Error('fstab.yaml does not point at content.da.live');
  const { stdout } = await run('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '-X', 'POST', '-F', `data=@${file};type=application/json`, `https://admin.da.live/source/${org}/${repo}/${daPath}`]);
  const status = Number(stdout.trim());
  if (status === 401 || status === 403) throw new Error(`DA upload refused (HTTP ${status}): enable Adobe credentials for Document Authoring uploads in Settings`);
  if (status < 200 || status >= 300) throw new Error(`DA upload of ${daPath} failed: HTTP ${status}`);
}

async function main() {
  const args = process.argv.slice(2);
  const doUpload = args.includes('--upload');
  const urls = args.filter((a) => !a.startsWith('--'));
  if (!urls.length) {
    console.error('Usage: node tools/importer/build-product-sheet.mjs <listing-url>... [--upload]');
    process.exit(2);
  }
  const catalog = catalogUrls();
  let failed = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const url of urls) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { pagePath, sheet, summary } = await buildSheet(url, catalog);
      const json = `${JSON.stringify(sheet, null, 2)}\n`;
      [path.join('content', pagePath, 'products.json'), path.join(OUT_DIR, pagePath, 'products.json')].forEach((f) => {
        fs.mkdirSync(path.dirname(f), { recursive: true });
        fs.writeFileSync(f, json);
      });
      // eslint-disable-next-line no-await-in-loop
      if (doUpload) await upload(`${pagePath.replace(/^\//, '')}/products.json`, path.join(OUT_DIR, pagePath, 'products.json'));
      console.log(`✓ ${pagePath}/products.json: ${summary.products} products; facets ${summary.facets.join(', ')}; specs ${summary.specs.join(', ')}${doUpload ? '; uploaded to DA' : ''}`);
    } catch (e) {
      failed += 1;
      console.error(`✗ ${url}: ${e.message}`);
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
