import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = ['boxed'];

// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

/**
 * Boxed option: only the first standalone link stays a button; any further
 * standalone links (e.g. "Press release") become arrow text links set off
 * by a divider.
 * @param {Element} textCol
 */
function boxSecondaryLinks(textCol) {
  const ctas = [...textCol.querySelectorAll(':scope > p.button-container')];
  ctas.slice(1).forEach((p, i) => {
    p.classList.remove('button-container');
    p.classList.add('tabs-technology-text-link');
    p.querySelector('a.button')?.classList.remove('button');
    if (i === 0) {
      const divider = document.createElement('hr');
      divider.className = 'tabs-technology-divider';
      p.before(divider);
    }
  });
}

/**
 * Split a panel's content cell into a text column and an image column.
 * @param {Element} panel
 * @param {string[]} active option classes present on the block
 */
function layoutPanel(panel, active = []) {
  const textCol = document.createElement('div');
  textCol.className = 'tabs-technology-panel-text';
  const imageCol = document.createElement('div');
  imageCol.className = 'tabs-technology-panel-image';

  const nodes = [...panel.children].flatMap((cell) => [...cell.childNodes]);
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
    const isPicture = node.nodeType === Node.ELEMENT_NODE
      && (node.tagName === 'PICTURE'
        || (node.tagName === 'P' && node.querySelector('picture') && !node.textContent.trim()));
    if (isPicture && !imageCol.children.length) imageCol.append(node);
    else textCol.append(node);
  });

  // lists made up only of links render as a wrapped set of link chips
  textCol.querySelectorAll('ul, ol').forEach((list) => {
    const items = [...list.children];
    if (items.length && items.every((li) => li.querySelector('a') && li.textContent.trim() === li.querySelector('a').textContent.trim())) {
      list.classList.add('tabs-technology-links');
    }
  });

  // standalone links in their own paragraph are CTAs
  textCol.querySelectorAll(':scope > p').forEach((p) => {
    const a = p.querySelector(':scope > a, :scope > strong > a, :scope > em > a');
    if (a && p.textContent.trim() === a.textContent.trim() && p.children.length === 1) {
      p.classList.add('button-container');
      a.classList.add('button');
    }
  });

  if (active.includes('boxed')) boxSecondaryLinks(textCol);

  imageCol.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  panel.replaceChildren(textCol);
  if (imageCol.children.length) panel.append(imageCol);
  else panel.classList.add('tabs-technology-panel-no-image');
}

/**
 * Tabs Technology: tab bar; each panel shows heading, text, a set of link chips,
 * a CTA and a side image.
 * Content contract: one row per tab -> tab label | heading + text + link list + CTA + image.
 * @param {Element} block
 */
export default function decorate(block) {
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  tabBlockCnt += 1;
  const tablist = document.createElement('div');
  tablist.className = 'tabs-technology-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tabs-technology-list-${tabBlockCnt}`;

  const rows = [...block.children].filter((row) => row.firstElementChild
    && row.firstElementChild.textContent.trim());

  const buttons = [];
  rows.forEach((row, i) => {
    const id = `tabs-technology-${tabBlockCnt}-panel-${i + 1}`;
    const label = row.firstElementChild;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-technology-tab';
    button.id = `tab-${id}`;
    button.innerHTML = label.innerHTML;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', i === 0);
    button.tabIndex = i === 0 ? 0 : -1;
    // the label is a property of the tab item; strip instrumentation from the copy
    // (moveInstrumentation needs a real target and throws on null in Universal Editor)
    button.querySelectorAll('*').forEach((el) => {
      [...el.attributes]
        .filter(({ name }) => name.startsWith('data-aue-') || name.startsWith('data-richtext-'))
        .forEach(({ name }) => el.removeAttribute(name));
    });
    label.remove();

    row.className = 'tabs-technology-panel';
    row.id = id;
    row.setAttribute('role', 'tabpanel');
    row.setAttribute('aria-labelledby', button.id);
    row.setAttribute('aria-hidden', i !== 0);
    layoutPanel(row, active);

    button.addEventListener('click', () => {
      rows.forEach((panel) => panel.setAttribute('aria-hidden', panel !== row));
      buttons.forEach((btn) => {
        btn.setAttribute('aria-selected', btn === button);
        btn.tabIndex = btn === button ? 0 : -1;
      });
    });
    buttons.push(button);
    tablist.append(button);
  });

  tablist.addEventListener('keydown', (e) => {
    const idx = buttons.indexOf(document.activeElement);
    if (idx < 0) return;
    let nextIdx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % buttons.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + buttons.length) % buttons.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = buttons.length - 1;
    if (nextIdx === undefined) return;
    e.preventDefault();
    buttons[nextIdx].focus();
    buttons[nextIdx].click();
  });

  block.prepend(tablist);
}
