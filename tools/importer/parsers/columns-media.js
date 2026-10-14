/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://www.komatsu.com/en-us/technology/smart-construction
 * Instance selector: .columncontainer-main > .aem-Grid > .splitcontentcomponent
 *   (matches 4 sibling split-content rows)
 * Structure (DA block table, N rows x 2 columns, every row the same width) -
 *   ONE block for the whole run: the first matched element builds the block from
 *   itself plus every following contiguous .splitcontentcomponent sibling; those
 *   siblings are removed, so the importer skips them (it ignores elements without
 *   a parentNode).
 *   row = [ text | media ] when the row has `.right` (media on the right),
 *         [ media | text ] otherwise (media on the left) - source visual order.
 *   text  = H2 + paragraph(s) + optional CTA link(s)
 *   media = image, or video poster + YouTube watch link
 * Video: komatsu-cleanup removes YouTube iframes in afterTransform, so the embed
 *   URL is read here and emitted as https://www.youtube.com/watch?v=ID.
 * Generated: 2026-10-13
 */
function getYoutubeWatchUrl(root) {
  const candidates = [];
  root.querySelectorAll('iframe[src], iframe[data-src]').forEach((f) => {
    candidates.push(f.getAttribute('src'), f.getAttribute('data-src'));
  });
  root.querySelectorAll('[data-video-id], [data-youtube-id], [data-video-url], [data-src]').forEach((el) => {
    candidates.push(el.getAttribute('data-video-url'), el.getAttribute('data-src'));
    const id = el.getAttribute('data-video-id') || el.getAttribute('data-youtube-id');
    if (id && /^[\w-]{6,}$/.test(id)) candidates.push(`https://www.youtube.com/watch?v=${id}`);
  });
  for (const c of candidates) {
    if (!c) continue;
    let m = c.match(/youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/([\w-]+)/);
    if (!m) m = c.match(/youtube\.com\/watch\?(?:.*&)?v=([\w-]+)/);
    if (!m) m = c.match(/youtu\.be\/([\w-]+)/);
    if (m) return `https://www.youtube.com/watch?v=${m[1]}`;
  }
  return null;
}

function isRow(el) {
  return !!el && el.nodeType === 1 && el.classList.contains('splitcontentcomponent');
}

function buildRow(rowEl, document) {
  const contentCol = rowEl.querySelector('.split_content_module--col.content');
  const mediaCol = rowEl.querySelector('.split_content_module--col.image, .split-content-image-video');

  // Text cell
  const textCell = [];
  if (contentCol) {
    const heading = contentCol.querySelector('h1, h2, h3, h4, .split-content-title');
    if (heading) {
      const h = document.createElement(/^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h2');
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }
    textCell.push(...[...contentCol.querySelectorAll('.split-content-description p, .split-content-description ul, .split-content-description ol')]
      .filter((el) => el.textContent.trim()));
    [...contentCol.querySelectorAll('.button a[href], a.split-content-module-link[href]')]
      .filter((a, i, arr) => arr.indexOf(a) === i)
      .forEach((a) => {
        // Label only - drop the "opens in a new tab" screen-reader suffix
        const label = (a.querySelector('.cmp-button__buttontext') || a).textContent.trim();
        if (!label) return;
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = label;
        p.append(link);
        textCell.push(p);
      });
  }

  // Media cell
  const mediaCell = [];
  if (mediaCol) {
    const poster = mediaCol.querySelector('img.video-thumbnail')
      || mediaCol.querySelector('picture')
      || [...mediaCol.querySelectorAll('img')].find((img) => !img.closest('button'));
    if (poster) mediaCell.push(poster);
    const videoUrl = getYoutubeWatchUrl(mediaCol);
    if (videoUrl) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = videoUrl;
      a.textContent = videoUrl;
      p.append(a);
      mediaCell.push(p);
    }
  }

  if (!textCell.length && !mediaCell.length) return null;
  const text = textCell.length ? textCell : '';
  const media = mediaCell.length ? mediaCell : '';
  return rowEl.classList.contains('right') ? [text, media] : [media, text];
}

export default function parse(element, { document }) {
  // Already consumed by the first row of this run
  if (!element.parentNode) return;
  // Not the first row of the run: the first row's parse builds the whole block
  if (isRow(element.previousElementSibling)) return;

  const rows = [element];
  let next = element.nextElementSibling;
  while (isRow(next)) {
    rows.push(next);
    next = next.nextElementSibling;
  }

  const cells = rows.map((r) => buildRow(r, document)).filter(Boolean);

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  rows.slice(1).forEach((r) => r.remove());

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
