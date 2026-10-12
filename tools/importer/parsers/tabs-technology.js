/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-technology. Base: tabs.
 * Source: https://www.komatsu.com/en-us
 * Instance selector: .tabs.panelcontainer .cmp-tabs
 * Structure (DA block table, 2 columns):
 *   one row per tab: [ tab label |
 *     h2 heading, description paragraph(s), ul of pill links, CTA paragraph, image ]
 * Excluded: section heading <h3>Technology</h3> (default content, emitted before the block),
 *   h4.tab-title "Select continent" and the mobile select.dropdown.
 * Generated: 2026-10-12
 */
export default function parse(element, { document }) {
  const labels = Array.from(element.querySelectorAll(':scope > .cmp-tabs__tablist > .cmp-tabs__tab, .cmp-tabs__tablist [role="tab"]'))
    .filter((el, i, arr) => arr.indexOf(el) === i);
  const panels = Array.from(element.querySelectorAll(':scope > .cmp-tabs__tabpanel'));

  const cells = [];

  panels.forEach((panel, i) => {
    // Tab label: match by aria/id pairing first, then by index
    const panelId = panel.id || '';
    let labelEl = panelId
      ? labels.find((l) => l.id && `${l.id}panel` === panelId)
      : null;
    if (!labelEl) labelEl = labels[i];

    const headingEl = panel.querySelector('.cmp-title__text, h1, h2, h3, h4, h5, h6');
    const labelText = labelEl ? labelEl.textContent.trim() : (headingEl ? headingEl.textContent.trim() : '');

    // Description paragraphs
    const paragraphs = Array.from(panel.querySelectorAll('.cmp-text p')).filter((p) => p.textContent.trim());

    // Pill links (button group)
    const pillLinks = Array.from(panel.querySelectorAll('.buttongroup .button a, .cmp-container.justify-start .button a'))
      .filter((a, idx, arr) => arr.indexOf(a) === idx);

    // Primary CTA (button outside the button group)
    const ctaLinks = Array.from(panel.querySelectorAll('.button.primary a, a.btn-primary'))
      .filter((a, idx, arr) => arr.indexOf(a) === idx && !a.closest('.buttongroup'));

    // Panel image
    const image = panel.querySelector('.cmp-image picture') || panel.querySelector('picture, img');

    if (!labelText && !headingEl && !paragraphs.length) return;

    // Cell 1: tab label (plain text)
    const labelCell = labelText || '';

    // Cell 2: panel content, in reading order
    const contentCell = [];

    if (headingEl) {
      const h = document.createElement(/^H[2-6]$/.test(headingEl.tagName) ? headingEl.tagName.toLowerCase() : 'h2');
      h.textContent = headingEl.textContent.trim();
      contentCell.push(h);
    }

    contentCell.push(...paragraphs);

    if (pillLinks.length) {
      const ul = document.createElement('ul');
      pillLinks.forEach((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = a.textContent.trim();
        li.appendChild(link);
        ul.appendChild(li);
      });
      contentCell.push(ul);
    }

    ctaLinks.forEach((a) => {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      p.appendChild(link);
      contentCell.push(p);
    });

    // Image last - the decorator lifts the first picture into the side image column
    if (image) contentCell.push(image);

    cells.push([labelCell, contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-technology', cells });

  // Keep the section heading (default content) outside the block
  const sectionHeading = element.querySelector(':scope > div > h3, :scope > h3');
  if (sectionHeading) {
    element.replaceWith(sectionHeading, block);
  } else {
    element.replaceWith(block);
  }
}
