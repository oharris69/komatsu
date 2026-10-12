/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Komatsu section breaks + Section Metadata.
 * Section selectors come from payload.template.sections (page-templates.json),
 * which were verified against migration-work/cleaned.html during page analysis:
 *   div.herocomponent.large_hero, div.columncontainer.pdding-top--medium,
 *   div.columncontainer.margin-bottom--medium, div.experiencefragment (parts promo),
 *   div.columncontainer (related articles), div.columncontainer (get in touch tiles).
 *
 * Breaks are inserted in beforeTransform (before parsers replace section
 * elements); Section Metadata is attached in afterTransform via marker <hr>s.
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors - first match wins.
function querySection(root, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    let el = null;
    try { el = root.querySelector(sel); } catch (e) { el = null; }
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;
  const doc = element.ownerDocument || document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no break, no metadata
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue;

      const hr = doc.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue;

      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove();
      }
    }

    // Drop a leading section break when nothing authored precedes it (e.g. the
    // article breadcrumb section is removed by cleanup), so the page does not
    // start with an empty section.
    const firstHr = element.querySelector('hr');
    if (firstHr) {
      const range = doc.createRange();
      range.setStart(element, 0);
      range.setEndBefore(firstHr);
      const before = range.cloneContents();
      const hasContent = before.textContent.trim()
        || before.querySelector('img, picture, table, video, iframe');
      if (!hasContent) firstHr.remove();
    }
  }
}
