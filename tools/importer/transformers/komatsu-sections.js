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

// Global chrome (header.header-xf / footer.footer-xf, removed by komatsu-cleanup.js).
// Section matches inside it are ignored: e.g. the equipment-model-detail infographic
// selector `div.columncontainer:has(> .columncontainer-main > .aem-Grid > .image)` also
// matches the footer logo container (cleaned.html) on model pages without an infographic.
// Output-neutral for the other templates: a match inside the chrome was always dropped
// together with the header/footer by the cleanup transformer, which runs first.
const CHROME_SELECTOR = 'header.header-xf, footer.footer-xf';

// section.selector is an array of candidate selectors - first match (outside chrome) wins.
function querySection(root, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    let matches = [];
    try { matches = root.querySelectorAll(sel); } catch (e) { matches = []; }
    for (const el of matches) {
      if (!el.closest(CHROME_SELECTOR)) return el;
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;
  const doc = element.ownerDocument || document;

  if (hookName === 'beforeTransform') {
    // one break per element: when two template sections resolve to the same container (e.g. the
    // wheel-loaders listing wraps its media panels and closing tiles in one container), a second
    // break would leave an empty section between them
    const broken = new Set();
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no break, no metadata
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl || broken.has(sectionEl)) continue;
      broken.add(sectionEl);

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
