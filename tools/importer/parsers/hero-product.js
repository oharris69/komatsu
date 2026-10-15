/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-product. Base: hero (custom key | value block, blocks/hero-product).
 * Deliberately NOT the library Hero convention (1 col, image row + text row): the project
 * block contract (migration-work/model-detail-contract.md, blocks/hero-product/README.md)
 * defines key rows, because the header carries a gallery, quick specs and two CTAs.
 * Source: https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71exi-24
 *   (coverage: d475a-8, d65px-18-wh)
 * Instance selector: .equipmentdetail .equipment-details
 * Source shape (live DOM verified):
 *   .equipment-details__galleryDiv .large-image img          (main image)
 *   .equipment-details__galleryDiv .scrollable-images .image-item img  (thumbnails, 1st = main)
 *   button.count ("+0 images")                                -> dropped (UI chrome)
 *   .equipment-details__descriptionDiv h4.equipment-details_levelOne (family eyebrow)
 *     h1.equipment-details__sku (model), h2.equipment-details__name (sub-category)
 *     li.equipment-details__specs[data-unit=METRIC|IMPERIAL] > span.label + span.value
 *   .equipment-details__purchaseOptions > p + a.primary + a.secondary
 * Output, first cell = key, 4 columns:
 *   images  | all gallery pictures (unique, in order, first = main, alt = model)
 *   intro   | <p> eyebrow, <h1> model, <p> subtitle
 *   spec    | Label | Value | Units (imperial | metric | empty)
 *   actions | <p>Purchase options</p>, <p><strong><a>primary</a></strong></p>, <p><em><a>secondary</a></em></p>
 * Units: data-unit on the spec <li> (added by the page JS, authoritative); fallback = the
 *   label's unit suffix ((mm), (kg), (m³), (kW) -> metric; (in), (ft), (lbs), (yd³), (HP) -> imperial).
 * Rows are padded to 4 cells (the block reads only the cells it needs).
 * Generated: 2026-10-15
 */
const clean = (s) => String(s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

const METRIC_RE = /\((?:mm|cm|m|km|cm²|cm2|m²|m2|m³|m3|kg|t|tonnes?|kw|kn|kpa|mpa|kg\/cm²|kg\/cm2|l|ltr|liters?|litres?|l\/min|ltr\/min|km\/h|kmh|°c)\)\s*:?\s*$/i;
const IMPERIAL_RE = /\((?:in|ft|ft2|ft²|ft3|ft³|yd|yd²|yd³|yd3|lb|lbs|lbs\.|tons?|hp|psi|lbf|us gal|u\.s\. gal|gal|gpm|us gpm|u\.s\. gal\/min|mph|°f)\)\s*:?\s*$/i;

function unitOf(el, label) {
  const attr = clean(el && el.getAttribute('data-unit')).toLowerCase();
  if (attr === 'metric' || attr === 'imperial') return attr;
  if (METRIC_RE.test(label)) return 'metric';
  if (IMPERIAL_RE.test(label)) return 'imperial';
  return '';
}

export default function parse(element, { document }) {
  const model = clean((element.querySelector('h1.equipment-details__sku, .equipment-details__descriptionDiv h1, h1') || {}).textContent)
    || clean(element.getAttribute('data-sku'));
  const family = clean((element.querySelector('.equipment-details_levelOne, .equipment-details__descriptionDiv h4') || {}).textContent)
    || clean(element.getAttribute('data-category'));
  const subtitle = clean((element.querySelector('.equipment-details__name, .equipment-details__descriptionDiv h2') || {}).textContent)
    || clean(element.getAttribute('data-subcategory'));

  // Gallery: main image, then thumbnails (de-duplicated by src, source order)
  const gallery = element.querySelector('.equipment-details__galleryDiv') || element;
  const srcs = [];
  [...gallery.querySelectorAll('.large-image img, .image-item img')]
    .forEach((img) => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src && !srcs.includes(src)) srcs.push(src);
    });
  const images = srcs.map((src) => {
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', model);
    return img;
  });

  // Quick specs
  let specItems = [...element.querySelectorAll('li.equipment-details__specs')];
  if (!specItems.length) specItems = [...element.querySelectorAll('.equipment-details__descriptionDiv li')];
  const specs = specItems
    .map((li) => {
      const labelEl = li.querySelector('.label') || li.querySelector('span');
      const valueEl = li.querySelector('.value') || li.querySelectorAll('span')[1];
      const label = clean(labelEl && labelEl.textContent).replace(/:$/, '');
      const value = clean(valueEl && valueEl.textContent);
      return { label, value, unit: unitOf(li, label) };
    })
    .filter((s) => s.label && s.value);

  // Purchase options
  const purchase = element.querySelector('.equipment-details__purchaseOptions');
  const actions = [];
  if (purchase) {
    const title = clean((purchase.querySelector('p, h2, h3, h4') || {}).textContent);
    if (title) {
      const p = document.createElement('p');
      p.textContent = title;
      actions.push(p);
    }
    [...purchase.querySelectorAll('a[href]')].forEach((a, i) => {
      // Label only - drop the "opens in a new tab" screen-reader suffix (also removed by cleanup)
      const labelClone = a.cloneNode(true);
      labelClone.querySelectorAll('.cmp-link__screen-reader-only, .sr-only').forEach((s) => s.remove());
      const text = clean(labelClone.textContent);
      if (!text) return;
      const isPrimary = a.classList.contains('primary') || (!a.classList.contains('secondary') && i === 0);
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href'));
      link.textContent = text;
      const wrap = document.createElement(isPrimary ? 'strong' : 'em');
      wrap.append(link);
      const p = document.createElement('p');
      p.append(wrap);
      actions.push(p);
    });
  }

  if (!model && !images.length && !specs.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (images.length) cells.push(['images', images, '', '']);

  const intro = [];
  if (family) {
    const p = document.createElement('p');
    p.textContent = family;
    intro.push(p);
  }
  if (model) {
    const h1 = document.createElement('h1');
    h1.textContent = model;
    intro.push(h1);
  }
  if (subtitle) {
    const p = document.createElement('p');
    p.textContent = subtitle;
    intro.push(p);
  }
  if (intro.length) cells.push(['intro', intro, '', '']);

  specs.forEach((s) => cells.push(['spec', s.label, s.value, s.unit]));

  if (actions.length) cells.push(['actions', actions, '', '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
