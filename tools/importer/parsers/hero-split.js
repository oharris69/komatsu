/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split. Base: hero (custom split variant).
 * Source: https://www.komatsu.com/en-us/technology/smart-construction
 * Instance selector: div.breadcrumb + div.splitcontentcomponent
 * Structure (DA block table, 1 row x 2 columns) - follows the project block
 *   blocks/hero-split/hero-split.js content contract rather than the generic
 *   library Hero (image row + text row), because the block renders text and
 *   media side by side and detects the media cell itself:
 *   [ H1 + intro paragraph(s) + optional CTA | poster image + YouTube link ]
 *   Cell order follows the source visual order: `.right` = media on the right.
 * Video: the YouTube iframe is removed later by komatsu-cleanup (afterTransform),
 *   so the embed URL is read here and emitted as https://www.youtube.com/watch?v=ID.
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

function buildMediaCell(mediaCol, document) {
  const cell = [];
  if (!mediaCol) return cell;
  // Poster: video thumbnail or a plain content image (skip the play-button icon)
  const poster = mediaCol.querySelector('img.video-thumbnail')
    || mediaCol.querySelector('picture')
    || [...mediaCol.querySelectorAll('img')].find((img) => !img.closest('button'));
  if (poster) cell.push(poster);
  const videoUrl = getYoutubeWatchUrl(mediaCol);
  if (videoUrl) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    p.append(a);
    cell.push(p);
  }
  return cell;
}

function buildCtas(contentCol, document) {
  return [...contentCol.querySelectorAll('.button a[href], a.cmp-button[href], a.split-content-module-link[href]')]
    .filter((a, i, arr) => arr.indexOf(a) === i)
    .map((a) => {
      const label = (a.querySelector('.cmp-button__buttontext') || a).textContent.trim();
      if (!label) return null;
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = label;
      p.append(link);
      return p;
    })
    .filter(Boolean);
}

export default function parse(element, { document }) {
  const contentCol = element.querySelector('.split_content_module--col.content') || element;
  const mediaCol = element.querySelector('.split_content_module--col.image, .split-content-image-video');

  const heading = contentCol.querySelector('h1, h2, h3, .split-content-title');
  const descriptions = [...contentCol.querySelectorAll('.split-content-description p, .split-content-description ul, .split-content-description ol')]
    .filter((el) => el.textContent.trim());

  const contentCell = [];
  // Eyebrow (equipment-category-listing: <p class="split-content-eyebrow">Construction / Mining</p>);
  // absent on technology-landing, so that output is unchanged.
  const eyebrow = contentCol.querySelector('.split-content-eyebrow');
  const eyebrowText = eyebrow ? eyebrow.textContent.replace(/\s+/g, ' ').trim() : '';
  if (eyebrowText) {
    const p = document.createElement('p');
    p.textContent = eyebrowText;
    contentCell.push(p);
  }
  if (heading) {
    const h = document.createElement(/^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h1');
    h.textContent = heading.textContent.trim();
    contentCell.push(h);
  }
  contentCell.push(...descriptions);
  contentCell.push(...buildCtas(contentCol, document));

  const mediaCell = buildMediaCell(mediaCol, document);

  if (!contentCell.length && !mediaCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // `.right` = media on the right (content first); otherwise media on the left
  const mediaRight = element.classList.contains('right');
  const textCell = contentCell.length ? contentCell : '';
  const media = mediaCell.length ? mediaCell : '';
  const cells = [mediaRight ? [textCell, media] : [media, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
