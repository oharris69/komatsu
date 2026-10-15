/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-resources. Base: columns (custom block, blocks/columns-resources).
 * Source: https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71exi-24
 *   (coverage: d475a-8, d65px-18-wh)
 * Instance selector: .machineresources .cmp-machineresources
 * Source shape (live DOM verified):
 *   .cmp-machineresources__product-description > h3 + p(s) + ul      (overview)
 *   .cmp-machinresources__resources (sic) > h3.cmp-machinresources__resources-title "Resources"
 *     ul.from-product > li > a[href][target]
 *       span.cmp-machinresources__resources-icon > img (decorative svg)  -> dropped
 *       span[data-link-brochure] (label)
 *       span.cmp-link__screen-reader-only "opens in a new tab"           -> dropped
 * Output (library Columns convention, model-detail contract): ONE row, 2 cells
 *   [ H3 + paragraph(s) + list ] | [ H3 "Resources" + list of plain links ]
 * Hrefs: DAM assets (/content/dam/..., e.g. brochure PDFs) and new-tab links
 *   (target=_blank, e.g. the competitive comparison tool - not migrated) are made absolute
 *   on https://www.komatsu.com; external hosts stay as they are; other site paths stay relative.
 *   The block derives icons / new-tab behaviour from the link itself.
 * Generated: 2026-10-15
 */
const ORIGIN = 'https://www.komatsu.com';
const clean = (s) => String(s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

function resolveHref(a) {
  const raw = (a.getAttribute('href') || '').trim();
  if (!raw || raw.startsWith('#') || /^(mailto|tel):/i.test(raw)) return raw;
  let u;
  try { u = new URL(raw, ORIGIN); } catch (e) { return raw; }
  const isSite = /(^|\.)komatsu\.com$/.test(u.hostname);
  if (!isSite) return u.href; // external host: absolute as-is
  const asset = /^\/content\/dam\//.test(u.pathname) || /\.pdf$/i.test(u.pathname);
  const newTab = (a.getAttribute('target') || '').toLowerCase() === '_blank';
  if (asset || newTab) return `${ORIGIN}${u.pathname}${u.search}${u.hash}`;
  return /^https?:/i.test(raw) ? `${u.pathname}${u.search}${u.hash}` : raw;
}

function linkLabel(a) {
  const labelled = a.querySelector('[data-link-brochure]');
  if (labelled && clean(labelled.textContent)) return clean(labelled.textContent);
  const c = a.cloneNode(true);
  c.querySelectorAll('.cmp-link__screen-reader-only, .sr-only, [class*="resources-icon"], img, svg').forEach((n) => n.remove());
  return clean(c.textContent);
}

export default function parse(element, { document }) {
  const desc = element.querySelector('.cmp-machineresources__product-description')
    || element.querySelector(':scope > div:first-child');
  const rail = element.querySelector('.cmp-machinresources__resources, .cmp-machineresources__resources')
    || (desc ? desc.nextElementSibling : null);

  // Cell 1: overview heading, paragraphs, lists (source order)
  const main = [];
  if (desc) {
    [...desc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
      .filter((n) => !n.parentElement.closest('ul, ol, p') && clean(n.textContent))
      .forEach((n) => {
        if (/^H[1-6]$/.test(n.tagName)) {
          const h = document.createElement(n.tagName === 'H1' || n.tagName === 'H2' ? 'h3' : n.tagName.toLowerCase());
          h.textContent = clean(n.textContent);
          main.push(h);
        } else {
          main.push(n);
        }
      });
  }

  // Cell 2: "Resources" heading + list of links
  const side = [];
  if (rail) {
    const title = rail.querySelector('.cmp-machinresources__resources-title, h2, h3, h4');
    if (title && clean(title.textContent)) {
      const h3 = document.createElement('h3');
      h3.textContent = clean(title.textContent);
      side.push(h3);
    }
    const ul = document.createElement('ul');
    rail.querySelectorAll('li').forEach((li) => {
      const a = li.querySelector('a[href]');
      if (!a) return;
      const text = linkLabel(a);
      if (!text) return;
      const link = document.createElement('a');
      link.setAttribute('href', resolveHref(a));
      link.textContent = text;
      const item = document.createElement('li');
      item.append(link);
      ul.append(item);
    });
    if (ul.children.length) side.push(ul);
  }

  if (!main.length && !side.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[main.length ? main : '', side.length ? side : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-resources', cells });
  element.replaceWith(block);
}
