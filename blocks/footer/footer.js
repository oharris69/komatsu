/**
 * Footer: link columns, brand column (logo, tagline, corporate link, social icons),
 * legal links and copyright.
 *
 * Content comes from the footer fragment (five sections):
 *   1. columns   — heading + list of links, repeated per column
 *   2. brand     — logo image, tagline, corporate link, list of social icon links
 *   3. legal     — list of links
 *   4. copyright — text
 *   5. labels    — UI strings: "opens in a new tab"
 */

const ACCORDION = window.matchMedia('(width < 450px)');

async function fetchFooter() {
  // metadata-independent: local preview serves pages (and the footer) under /content,
  // DA/EDS at the root — ask for the one that matches, so live pages make no 404 request
  const prefix = window.location.pathname.startsWith('/content/') ? '/content' : '';
  let resp = await fetch(`${prefix}/footer.plain.html`);
  if (!resp.ok && prefix) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const doc = document.createElement('div');
  doc.innerHTML = await resp.text();
  // relative image paths are relative to the fragment, not to the current page
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return doc;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  children.flat().forEach((c) => c && node.append(c));
  return node;
}

function isExternal(href) {
  try {
    return new URL(href, window.location.href).origin !== window.location.origin;
  } catch (e) {
    return false;
  }
}

/**
 * External links in lists open in a new tab and announce it to screen readers.
 * @param {Element} root
 * @param {string} newTabLabel
 */
function decorateNewTabLinks(root, newTabLabel) {
  root.querySelectorAll('li > a[href]').forEach((a) => {
    if (!isExternal(a.getAttribute('href'))) return;
    a.target = '_blank';
    a.rel = 'noopener';
    a.append(el('span', { class: 'footer-sr' }, ` ${newTabLabel}`));
  });
}

/**
 * Splits a flat section of headings and lists into one column per heading.
 * @param {Element} section
 */
function buildColumns(section) {
  const columns = el('div', { class: 'footer-columns' });
  let column = null;
  [...section.children].forEach((child) => {
    let node = child;
    if (/^H[1-6]$/.test(child.tagName)) {
      column = el('div', { class: 'footer-column' });
      columns.append(column);
      // the fragment authors column titles as h6; in the page outline they follow the main
      // content's h2/h3, so render them as h2 (same look) to keep heading levels sequential
      if (child.tagName !== 'H2') {
        node = document.createElement('h2');
        [...child.attributes].forEach((attr) => node.setAttribute(attr.name, attr.value));
        node.append(...child.childNodes);
      }
    } else if (!column) {
      column = el('div', { class: 'footer-column' });
      columns.append(column);
    }
    column.append(node);
  });
  return columns;
}

/**
 * On small screens each column heading toggles its list (several may be open).
 * @param {Element} columns
 */
function decorateAccordions(columns) {
  const headings = [...columns.querySelectorAll('.footer-column > h2')];
  const toggle = (heading) => {
    if (!ACCORDION.matches) return;
    const open = heading.parentElement.classList.toggle('is-open');
    heading.setAttribute('aria-expanded', open);
  };
  const sync = () => headings.forEach((heading) => {
    if (ACCORDION.matches) {
      heading.setAttribute('role', 'button');
      heading.setAttribute('tabindex', '0');
      heading.setAttribute('aria-expanded', heading.parentElement.classList.contains('is-open'));
    } else {
      ['role', 'tabindex', 'aria-expanded'].forEach((attr) => heading.removeAttribute(attr));
    }
  });
  headings.forEach((heading) => {
    heading.addEventListener('click', () => toggle(heading));
    heading.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      toggle(heading);
    });
  });
  sync();
  ACCORDION.addEventListener('change', sync);
}

/**
 * Brand column: logo, text, corporate link and social icon list.
 * @param {Element} section
 */
function buildBrand(section) {
  const brand = el('div', { class: 'footer-brand' });
  [...section.children].forEach((child) => {
    if (child.tagName === 'UL') {
      child.classList.add('footer-social');
    } else if (child.querySelector('img')) {
      child.classList.add('footer-logo');
    } else if (child.querySelector('a')) {
      child.classList.add('footer-cta-wrap');
      child.querySelector('a').classList.add('footer-cta');
    } else {
      child.classList.add('footer-tagline');
    }
    brand.append(child);
  });
  return el('div', { class: 'footer-brand-wrap' }, brand);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  if (!fragment) return;
  const [
    columnsSection, brandSection, legalSection, copyrightSection, labelsSection,
  ] = [...fragment.children];
  const newTabLabel = labelsSection?.textContent.trim() || 'opens in a new tab';

  const main = el(
    'div',
    { class: 'footer-main' },
    el('div', { class: 'footer-columns-wrap' }, columnsSection ? buildColumns(columnsSection) : null),
    brandSection ? buildBrand(brandSection) : null,
  );
  const legal = legalSection ? el('div', { class: 'footer-legal' }, ...legalSection.children) : null;
  const copyright = copyrightSection ? el('div', { class: 'footer-copyright' }, ...copyrightSection.children) : null;

  block.textContent = '';
  block.append(main, legal, copyright);
  decorateNewTabLinks(block, newTabLabel);
  const columns = block.querySelector('.footer-columns');
  if (columns) decorateAccordions(columns);
}
