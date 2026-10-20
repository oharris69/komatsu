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

// --- videos option (equipment-model-detail, live DOM d65px-18-wh / d475a-8) ---
//   .cmp-carousel__item > [.columncontainer > ... >] .videocomponent > .video-container
//     > .video-thumb-btn-wrapper > img.video-thumbnail (poster) + button.play-btn (dropped)
//     + iframe.youtube-frame[src=https://www.youtube.com/embed/<id>?mute=1]
//   optional .textcontent .cmp-text > p > b (title) + p (description)
// Output (Carousel convention, 2 columns), one row per slide:
//   [ poster img (YouTube hqdefault when the slide has none) | watch link + <strong> title + description p(s) ]
function youtubeId(root) {
  const candidates = [];
  root.querySelectorAll('iframe[src], iframe[data-src]').forEach((f) => {
    candidates.push(f.getAttribute('src'), f.getAttribute('data-src'));
  });
  root.querySelectorAll('[data-video-id], [data-youtube-id], [data-video-url]').forEach((el) => {
    candidates.push(el.getAttribute('data-video-url'));
    const id = el.getAttribute('data-video-id') || el.getAttribute('data-youtube-id');
    if (id && /^[\w-]{6,}$/.test(id)) candidates.push(`https://www.youtube.com/watch?v=${id}`);
  });
  root.querySelectorAll('img[src*="img.youtube.com/vi/"], img[src*="ytimg.com/vi/"]').forEach((img) => {
    candidates.push(img.getAttribute('src'));
  });
  for (const c of candidates) {
    if (!c) continue;
    let m = c.match(/youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/([\w-]+)/);
    if (!m) m = c.match(/youtube\.com\/watch\?(?:.*&)?v=([\w-]+)/);
    if (!m) m = c.match(/youtu\.be\/([\w-]+)/);
    if (!m) m = c.match(/(?:img\.youtube\.com|ytimg\.com)\/vi\/([\w-]+)\//);
    if (m) return m[1];
  }
  return '';
}

function parseVideos(element, document, items) {
  const cells = [];
  items.forEach((item) => {
    const id = youtubeId(item);
    const posterEl = item.querySelector('img.video-thumbnail')
      || [...item.querySelectorAll('img')].find((img) => !img.closest('button, .textcontent'));
    const posterSrc = (posterEl && (posterEl.getAttribute('src') || posterEl.getAttribute('data-src')))
      || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '');
    if (!id && !posterSrc) return;

    // Title: first bold-only paragraph; description: the other non-empty paragraphs
    let title = '';
    const desc = [];
    // the title sometimes sits in a bare <div><b>…</b></div> rather than a <p> (WE-series loaders);
    // a div only counts when it holds no paragraphs of its own (those are read as <p>)
    const textNodes = [...item.querySelectorAll('.textcontent p, .cmp-text p, .cmp-text > div')]
      .filter((el) => el.tagName === 'P' || !el.querySelector('p'));
    textNodes.forEach((p) => {
      const t = clean(p.textContent);
      if (!t) return;
      const bold = p.querySelector('b, strong');
      if (!title && bold && clean(bold.textContent) === t) title = t;
      else desc.push(t);
    });
    const caption = clean((item.querySelector('.video-title, .cmp-video__title, figcaption') || {}).textContent);
    if (!title && caption) title = caption;

    const text = [];
    if (id) {
      const href = `https://www.youtube.com/watch?v=${id}`;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = href;
      p.append(a);
      text.push(p);
    }
    if (title) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title;
      p.append(strong);
      text.push(p);
    }
    desc.forEach((t) => {
      const p = document.createElement('p');
      p.textContent = t;
      text.push(p);
    });

    let poster = '';
    if (posterSrc) {
      poster = document.createElement('img');
      poster.setAttribute('src', posterSrc);
      poster.setAttribute('alt', title || 'Video');
    }
    cells.push([poster, text.length ? text : '']);
  });
  return cells;
}

export default function parse(element, { document }) {
  // Video slides (YouTube video component inside the slides) -> videos option
  const videoItems = [...element.querySelectorAll('.cmp-carousel__item')]
    .filter((item) => item.querySelector('.videocomponent, .video-container, iframe[src*="youtube"]'));
  if (videoItems.length) {
    const cells = parseVideos(element, document, videoItems);
    if (!cells.length) {
      element.remove();
      return;
    }
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
    const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-gallery (videos)', cells });
    element.replaceWith(block);
    if (before.length) block.before(...before);
    return;
  }

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
