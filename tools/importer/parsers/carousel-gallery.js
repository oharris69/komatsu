/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-gallery. Base: carousel (custom block, blocks/carousel-gallery).
 * Source: https://www.komatsu.com/en-us/blog/2026/reclaiming-value-the-maybach-reclamation-story
 * Instance selector: #articleRight .carousel.panelcontainer
 * Source shape (AEM Core carousel, live DOM verified):
 *   div.carousel.panelcontainer > div.cmp-carousel
 *     div.carousel-header (h1.carousel-title + p.carousel-desc, empty)  -> skipped
 *     div.cmp-carousel__content
 *       <div><h1></h1></div>                                            -> skipped
 *       div.cmp-carousel__item[data-cmp-data-layer]  (one per slide; dc:title = slide caption)
 *         div.image > div.cmp-image > picture > img.cmp-image__image
 *                                     figcaption.cmp-image__title
 *       div.cmp-carousel__actions, ol.cmp-carousel__indicators         -> skipped (UI chrome)
 * Output (library convention "Carousel"; blocks/carousel-gallery/carousel-gallery.js):
 *   one row per slide, 2 columns: [ image | caption ]
 * Caption: the slide's own dc:title (data-cmp-data-layer on .cmp-carousel__item; also
 *   shown as the slide's indicator label), falling back to the figcaption text, then the
 *   matching indicator text. The figcaption is the image component's title and can repeat
 *   across slides, so it is only the fallback.
 * A non-empty carousel title/description (rare) is emitted as default content before the block.
 * Iteration: keyed on div.cmp-carousel__item (block-level, no nested interactive elements).
 * Generated: 2026-10-13
 */

function clean(text) {
  return (text || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

function itemTitle(item) {
  const raw = item.getAttribute('data-cmp-data-layer');
  if (!raw) return '';
  try {
    const data = JSON.parse(raw);
    const entry = data[item.id] || Object.values(data)[0];
    return clean(entry && entry['dc:title']);
  } catch (e) {
    return '';
  }
}

export default function parse(element, { document }) {
  let items = [...element.querySelectorAll('.cmp-carousel__item')];
  if (!items.length) {
    // Fallback: any slide-like panel that holds an image
    items = [...element.querySelectorAll('[role="tabpanel"], [aria-roledescription="slide"]')]
      .filter((el) => el.querySelector('img'));
  }
  const indicators = [...element.querySelectorAll('.cmp-carousel__indicators > li, .cmp-carousel__indicator')];

  const cells = [];
  items.forEach((item, i) => {
    const img = item.querySelector('img.cmp-image__image') || item.querySelector('picture img, img');
    let picture = null;
    if (img) {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (src) {
        picture = document.createElement('img');
        picture.setAttribute('src', src);
        picture.setAttribute('alt', clean(img.getAttribute('alt')));
      }
    }

    const figcaption = item.querySelector('figcaption, .cmp-image__title');
    const indicator = indicators[i];
    const captionText = itemTitle(item)
      || clean(figcaption && figcaption.textContent)
      || clean(indicator && indicator.textContent);

    if (!picture && !captionText) return;
    let caption = '';
    if (captionText) {
      caption = document.createElement('p');
      caption.textContent = captionText;
    }
    cells.push([picture || '', caption]);
  });

  if (!cells.length) {
    element.remove();
    return;
  }

  // Carousel heading/description: only kept when the author actually filled them in.
  const before = [];
  const title = element.querySelector('.carousel-header .carousel-title');
  if (title && clean(title.textContent)) {
    const h = document.createElement('h2');
    h.textContent = clean(title.textContent);
    before.push(h);
  }
  const desc = element.querySelector('.carousel-header .carousel-desc');
  if (desc && clean(desc.textContent)) {
    const p = document.createElement('p');
    p.textContent = clean(desc.textContent);
    before.push(p);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-gallery', cells });
  element.replaceWith(block);
  if (before.length) block.before(...before);
}
