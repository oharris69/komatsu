/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video. Base: video (custom block, blocks/video).
 * Sources (live DOM verified):
 *   1. https://www.komatsu.com/en-us/newsroom/2026/bbc-the-future-of-mining-is-human
 *      Instance selector: #articleRight .videocomponent
 *      div.videocomponent > div.video-container
 *        div.video-thumb-btn-wrapper > img.video-thumbnail (poster) + button.play-btn (UI)
 *        video.video-cmp-dam > source[src="/content/dam/....mp4"][type="video/mp4"]
 *   2. https://www.komatsu.com/en-us/blog/2019/a-reforestation-project-to-bring-back-appalachian-forests
 *      Instance selector: #articleRight iframe[src*="youtube"]
 *      div.cmp-text > <p><iframe src="https://www.youtube.com/embed/EbfM-Kx97Yk"></iframe></p>
 * Output (library convention "Video"; blocks/video/video.js): one row, one cell:
 *   [ poster image (if any) + link to the video ]
 *   - YouTube -> https://www.youtube.com/watch?v=ID
 *   - DAM file -> absolute https://www.komatsu.com/... URL
 * The block is never left inside a <p>: for the iframe-in-<p> case the paragraph is
 * split around the block (other text stays in sibling paragraphs; empty halves dropped).
 * Runs before komatsu-cleanup's afterTransform iframe removal.
 * Generated: 2026-10-13
 */

const ORIGIN = 'https://www.komatsu.com';
const NBSP = / /g;

function placeOutsideParagraph(block, document) {
  const p = block.parentElement && block.parentElement.closest('p');
  if (!p) return;
  const hasContent = (node) => node.textContent.replace(NBSP, ' ').trim()
    || (node.querySelector && node.querySelector('img, picture, a, video, iframe'));
  const before = document.createRange();
  before.setStart(p, 0);
  before.setEndBefore(block);
  const after = document.createRange();
  after.setStartAfter(block);
  after.setEnd(p, p.childNodes.length);
  const pBefore = document.createElement('p');
  pBefore.append(before.extractContents());
  const pAfter = document.createElement('p');
  pAfter.append(after.extractContents());
  const out = [];
  if (hasContent(pBefore)) out.push(pBefore);
  out.push(block);
  if (hasContent(pAfter)) out.push(pAfter);
  p.replaceWith(...out);
}

function absolute(src) {
  try {
    return new URL(src, ORIGIN).href;
  } catch (e) {
    return '';
  }
}

function youtubeWatchUrl(src) {
  let url;
  try {
    url = new URL(src, ORIGIN);
  } catch (e) {
    return '';
  }
  let id = '';
  if (url.hostname.includes('youtu.be')) id = url.pathname.split('/')[1] || '';
  else id = url.searchParams.get('v') || ((url.pathname.match(/\/(?:embed|shorts|live|v)\/([^/?#]+)/) || [])[1] || '');
  return id ? `https://www.youtube.com/watch?v=${id}` : '';
}

/** Find the video URL inside a .videocomponent (DAM file or embedded YouTube). */
function findComponentVideo(element) {
  const yt = element.querySelector('iframe[src*="youtube"], iframe[data-src*="youtube"]');
  if (yt) {
    const u = youtubeWatchUrl(yt.getAttribute('src') || yt.getAttribute('data-src'));
    if (u) return u;
  }
  const source = element.querySelector('video source[src]');
  if (source) return absolute(source.getAttribute('src'));
  const video = element.querySelector('video[src]');
  if (video) return absolute(video.getAttribute('src'));
  // Fallback: a data-* attribute carrying a video file or YouTube URL
  const candidates = [element, ...element.querySelectorAll('*')];
  for (const el of candidates) {
    for (const attr of el.attributes) {
      if (!attr.name.startsWith('data-')) continue;
      const v = attr.value || '';
      if (/youtu\.?be/.test(v)) {
        const u = youtubeWatchUrl(v);
        if (u) return u;
      }
      const m = v.match(/(?:https?:\/\/[^\s"']+?|\/content\/dam\/[^\s"']+?)\.(?:mp4|webm|mov|m4v)(?=$|[\s"'?#])/i);
      if (m) return absolute(m[0]);
    }
  }
  // Last resort: DAM rendition path of the poster (/content/dam/...mp4/_jcr_content/renditions/...)
  const thumb = element.querySelector('img[src*=".mp4/"]');
  if (thumb) return absolute(thumb.getAttribute('src').replace(/(\.mp4)\/.*$/i, '$1'));
  return '';
}

export default function parse(element, { document }) {
  const isIframe = element.tagName === 'IFRAME';
  let videoUrl = '';
  let poster = null;

  if (isIframe) {
    videoUrl = youtubeWatchUrl(element.getAttribute('src') || element.getAttribute('data-src'));
  } else {
    videoUrl = findComponentVideo(element);
    const img = element.querySelector('img.video-thumbnail')
      || element.querySelector('.video-thumb-btn-wrapper img, picture img, img');
    const videoWithPoster = element.querySelector('video[poster]');
    const posterSrc = (img && img.getAttribute('src'))
      || (videoWithPoster && videoWithPoster.getAttribute('poster'));
    if (posterSrc) {
      poster = document.createElement('img');
      poster.setAttribute('src', posterSrc);
      const alt = img && img.getAttribute('alt');
      poster.setAttribute('alt', alt && alt !== 'Video thumbnail' ? alt : '');
    }
  }

  if (!videoUrl) {
    // Nothing playable: leave no empty player behind.
    element.remove();
    return;
  }

  const link = document.createElement('a');
  link.setAttribute('href', videoUrl);
  link.textContent = videoUrl;
  const linkP = document.createElement('p');
  linkP.append(link);

  const contentCell = [];
  if (poster) {
    const posterP = document.createElement('p');
    posterP.append(poster);
    contentCell.push(posterP);
  }
  contentCell.push(linkP);

  const cells = [[contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'video', cells });
  element.replaceWith(block);
  placeOutsideParagraph(block, document);
}
