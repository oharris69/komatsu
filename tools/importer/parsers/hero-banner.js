/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.komatsu.com/en-us
 * Instance selector: div.herocomponent.large_hero
 * Structure (DA block table, 1 column):
 *   row 1 = background image
 *   row 2 = text (h1 heading, description paragraph(s), CTA link paragraph)
 * Generated: 2026-10-12
 */
export default function parse(element, { document }) {
  // Background image: .hero-background picture/img (validated in source.html)
  const bgImage = element.querySelector('.hero-background picture, .hero-background img, .bgimg picture, .bgimg img');

  // Title: h1.cmp-title__text (fallback to any heading)
  const heading = element.querySelector('.hero-field h1, .hero-field h2, h1, h2, h3');

  // Description paragraphs inside .left-constrained-container
  const descriptions = Array.from(element.querySelectorAll('.hero-field .left-constrained-container p, .hero-field > p'));

  // CTA buttons
  const ctas = Array.from(element.querySelectorAll('.hero-field a.cmp-button, .hero-field .button a'))
    .filter((a, i, arr) => arr.indexOf(a) === i);

  if (!heading && !descriptions.length && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: image
  cells.push([bgImage ? [bgImage] : '']);

  // Row 2: text (heading, description, CTA)
  const textCell = [];
  if (heading) textCell.push(heading);
  textCell.push(...descriptions);
  ctas.forEach((a) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    p.appendChild(link);
    textCell.push(p);
  });
  cells.push([textCell.length ? textCell : '']);

  // homepage hero = large_hero (default); category banners (blue_bg / hero-max-width) = compact
  const isCompact = !element.classList.contains('large_hero');
  const block = WebImporter.Blocks.createBlock(document, {
    name: isCompact ? 'hero-banner (compact)' : 'hero-banner',
    cells,
  });
  element.replaceWith(block);
}
