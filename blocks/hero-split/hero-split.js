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
 * Turn a media cell (poster picture + YouTube link) into a lightweight
 * click-to-play facade. The iframe is only created on click.
 * @param {Element} media
 */
function decorateMedia(media) {
  const link = [...media.querySelectorAll('a')].find((a) => getYoutubeId(a.href));
  const picture = media.querySelector('picture');

  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [
        { media: '(min-width: 900px)', width: '1200' },
        { width: '750' },
      ]);
      moveInstrumentation(img, optimized.querySelector('img'));
      picture.replaceWith(optimized);
    }
  }

  if (!link) return;
  const videoId = getYoutubeId(link.href);
  const title = link.title || link.textContent.trim() || 'Play video';
  const poster = media.querySelector('picture');

  // drop the raw link (and its now-empty paragraph)
  const holder = link.closest('p');
  if (holder && holder.textContent.trim() === link.textContent.trim() && !holder.querySelector('picture')) holder.remove();
  else link.remove();

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-split-play';
  button.setAttribute('aria-label', /^https?:/.test(title) ? 'Play video' : `Play video: ${title}`);

  const frame = document.createElement('div');
  frame.className = 'hero-split-video';
  if (poster) {
    const posterHolder = poster.parentElement?.tagName === 'P' ? poster.parentElement : poster;
    posterHolder.replaceWith(frame);
    frame.append(poster);
  } else {
    media.append(frame);
  }
  frame.append(button);

  button.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
    iframe.title = /^https?:/.test(title) ? 'YouTube video' : title;
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.replaceChildren(iframe);
    frame.classList.add('hero-split-video-playing');
    iframe.focus();
  }, { once: true });
}

/**
 * Hero Split: page intro with H1 + text on one side and a media
 * (image, or YouTube poster with click-to-play) on the other.
 * Content contract: 1 row -> H1 + paragraph(s) | poster image + YouTube link.
 * Either cell order is accepted; the media cell is detected, not assumed.
 * A single cell holding everything is split automatically.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const cells = [...block.children].flatMap((row) => [...row.children]);
  const content = document.createElement('div');
  content.className = 'hero-split-content';
  const media = document.createElement('div');
  media.className = 'hero-split-media';
  let mediaFirst = false;

  const isMediaCell = (cell) => !cell.querySelector('h1, h2, h3, h4, h5, h6')
    && (cell.querySelector('picture') || [...cell.querySelectorAll('a')].some((a) => getYoutubeId(a.href)))
    && [...cell.querySelectorAll('p')].every((p) => p.querySelector('picture, a') || !p.textContent.trim());

  cells.forEach((cell) => {
    if (!cell.children.length && !cell.textContent.trim()) return;
    if (isMediaCell(cell)) {
      if (!content.children.length) mediaFirst = true;
      moveInstrumentation(cell, media);
      while (cell.firstChild) media.append(cell.firstChild);
    } else {
      // mixed cell: pull out the picture and any YouTube link into the media column
      cell.querySelectorAll('picture').forEach((pic) => {
        const holder = pic.parentElement?.tagName === 'P' && !pic.parentElement.textContent.trim() ? pic.parentElement : pic;
        media.append(holder);
      });
      cell.querySelectorAll('a').forEach((a) => {
        if (!getYoutubeId(a.href)) return;
        const p = a.closest('p');
        media.append(p && p.textContent.trim() === a.textContent.trim() ? p : a);
      });
      moveInstrumentation(cell, content);
      while (cell.firstChild) content.append(cell.firstChild);
    }
  });

  // standalone links in their own paragraph are CTAs
  content.querySelectorAll(':scope > p').forEach((p) => {
    const a = p.querySelector('a');
    if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
      p.classList.add('button-container');
      a.classList.add('button');
    }
  });

  if (media.children.length) decorateMedia(media);

  const parts = [content];
  if (media.children.length) {
    if (mediaFirst) parts.unshift(media);
    else parts.push(media);
  } else {
    block.classList.add('hero-split-no-media');
  }
  if (mediaFirst) block.classList.add('hero-split-media-first');
  block.replaceChildren(...parts);
}
