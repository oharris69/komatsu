import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = [];

/**
 * Extract a YouTube video id from watch, short (youtu.be) or embed URLs.
 * @param {string} href
 * @returns {string|null}
 */
function getYoutubeId(href) {
  try {
    const url = new URL(href, window.location.href);
    if (url.hostname.includes('youtu.be')) return url.pathname.split('/')[1] || null;
    if (!url.hostname.includes('youtube')) return null;
    if (url.searchParams.get('v')) return url.searchParams.get('v');
    const match = url.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

/**
 * A media cell holds a picture and/or a YouTube link and no heading or prose.
 * @param {Element} cell
 */
function isMediaCell(cell) {
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return false;
  const hasPicture = !!cell.querySelector('picture');
  const hasVideo = [...cell.querySelectorAll('a')].some((a) => getYoutubeId(a.href));
  if (!hasPicture && !hasVideo) return false;
  return [...cell.querySelectorAll('p')].every((p) => p.querySelector('picture, a') || !p.textContent.trim());
}

/**
 * Optimize the poster and, when a YouTube link is present, build a lightweight
 * click-to-play facade (the iframe is created only on click).
 * @param {Element} col
 */
function decorateMedia(col) {
  const picture = col.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [
        { media: '(min-width: 900px)', width: '1200' },
        { width: '750' },
      ]);
      moveInstrumentation(img, optimized.querySelector('img'));
      picture.replaceWith(optimized);
    }
  }

  const link = [...col.querySelectorAll('a')].find((a) => getYoutubeId(a.href));
  if (!link) return;
  const videoId = getYoutubeId(link.href);
  const rawTitle = link.title || link.textContent.trim();
  const title = rawTitle && !/^https?:/.test(rawTitle) ? rawTitle : '';
  const poster = col.querySelector('picture');

  const holder = link.closest('p');
  if (holder && holder.textContent.trim() === link.textContent.trim() && !holder.querySelector('picture')) holder.remove();
  else link.remove();

  const frame = document.createElement('div');
  frame.className = 'columns-media-video';
  if (poster) {
    const posterHolder = poster.parentElement?.tagName === 'P' ? poster.parentElement : poster;
    posterHolder.replaceWith(frame);
    frame.append(poster);
  } else {
    col.append(frame);
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'columns-media-play';
  button.setAttribute('aria-label', title ? `Play video: ${title}` : 'Play video');
  frame.append(button);

  button.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
    iframe.title = title || 'YouTube video';
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.replaceChildren(iframe);
    frame.classList.add('columns-media-video-playing');
    iframe.focus();
  }, { once: true });
}

/**
 * Columns Media: stacked rows of text beside media (photo or YouTube poster
 * with click-to-play). Cell order controls which side the media sits on, so
 * authors alternate rows simply by swapping cells.
 * Content contract: N rows x 2 cols -> [text | media] or [media | text];
 * text = heading + paragraph(s) + optional CTA; media = image (+ YouTube link).
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  [...block.children].forEach((row) => {
    const cols = [...row.children].filter((col) => col.children.length || col.textContent.trim());
    [...row.children].forEach((col) => { if (!cols.includes(col)) col.remove(); });
    if (!cols.length) {
      row.remove();
      return;
    }

    row.classList.add('columns-media-row', `columns-media-row-${cols.length}-cols`);
    cols.forEach((col) => {
      if (isMediaCell(col)) {
        col.classList.add('columns-media-media-col');
        decorateMedia(col);
      } else {
        col.classList.add('columns-media-text-col');
        col.querySelectorAll('p').forEach((p) => {
          const a = p.querySelector('a');
          if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
            p.classList.add('button-container');
            a.classList.add('button');
          }
        });
        col.querySelectorAll('a[href]').forEach((a) => {
          try {
            const { hostname } = new URL(a.href, window.location.href);
            if (hostname !== window.location.hostname && !hostname.endsWith('komatsu.com')) {
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
            }
          } catch (e) { /* ignore malformed hrefs */ }
        });
      }
    });

    if (cols[0].classList.contains('columns-media-media-col')) row.classList.add('columns-media-media-first');
  });
}
