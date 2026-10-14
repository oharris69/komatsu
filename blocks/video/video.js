/*
 * Video Block
 * One row; the cell holds an optional poster <picture>/<img> plus a link to the video
 * (YouTube watch / embed / youtu.be / shorts URL, Vimeo URL, or a direct video file such as .mp4).
 *
 * - With a poster: poster + play button; the player loads only on click
 *   (YouTube via youtube-nocookie.com, files via <video controls>).
 * - Without a poster: the player is lazy-loaded when the block nears the viewport.
 *
 * Options (CSS classes on the block):
 * - `autoplay`   ambient/background playback: muted, looped, no controls, starts when in view.
 * - `playonload` start playback as soon as the player loads (muted, controls kept).
 * https://www.aem.live/developer/block-collection/video
 */

const OPTION_CLASSES = ['autoplay', 'playonload'];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getVideoSource(url) {
  const host = url.hostname.replace(/^www\./, '');
  if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com') || host === 'youtu.be') return 'youtube';
  if (host.endsWith('vimeo.com')) return 'vimeo';
  return 'video';
}

function getYoutubeId(url) {
  if (url.hostname.includes('youtu.be')) return url.pathname.split('/')[1] || '';
  const v = url.searchParams.get('v');
  if (v) return v;
  const match = url.pathname.match(/\/(?:embed|shorts|live|v)\/([^/?#]+)/);
  return match ? match[1] : '';
}

function buildQuery(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
}

function createIframe(src, title) {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  return iframe;
}

function embedYoutube(url, {
  play, background, muted, title,
}) {
  const id = encodeURIComponent(getYoutubeId(url));
  const params = { rel: '0', playsinline: '1' };
  if (play || background) params.autoplay = '1';
  if (muted) params.mute = '1';
  if (background) {
    Object.assign(params, {
      mute: '1', controls: '0', disablekb: '1', loop: '1', playlist: id,
    });
  }
  return createIframe(`https://www.youtube-nocookie.com/embed/${id}?${buildQuery(params)}`, title);
}

function embedVimeo(url, {
  play, background, muted, title,
}) {
  const id = url.pathname.split('/').filter(Boolean).pop();
  const params = { dnt: '1' };
  if (play || background) params.autoplay = '1';
  if (muted) params.muted = '1';
  if (background) params.background = '1';
  return createIframe(`https://player.vimeo.com/video/${encodeURIComponent(id)}?${buildQuery(params)}`, title);
}

function getVideoElement(url, {
  play, background, muted, poster, title,
}) {
  const video = document.createElement('video');
  video.setAttribute('preload', 'metadata');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-label', title);
  if (poster) video.setAttribute('poster', poster);
  if (background) {
    video.setAttribute('loop', '');
    video.muted = true;
  } else {
    video.setAttribute('controls', '');
    if (muted) video.muted = true;
  }

  const source = document.createElement('source');
  source.setAttribute('src', url.href);
  const ext = url.pathname.split('.').pop().toLowerCase();
  const types = {
    mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', ogv: 'video/ogg', mov: 'video/quicktime',
  };
  if (types[ext]) source.setAttribute('type', types[ext]);
  video.append(source);

  if (play || background) {
    video.addEventListener('canplay', () => {
      video.play().catch(() => { /* autoplay blocked: controls remain available */ });
    }, { once: true });
  }
  return video;
}

function loadPlayer(block, url, opts) {
  if (block.dataset.embedLoaded === 'true') return;
  block.dataset.embedLoaded = 'true';

  const frame = block.querySelector('.video-frame');
  const source = getVideoSource(url);
  let player;
  if (source === 'youtube') player = embedYoutube(url, opts);
  else if (source === 'vimeo') player = embedVimeo(url, opts);
  else player = getVideoElement(url, opts);
  player.classList.add('video-player');

  frame.querySelector('.video-placeholder')?.remove();
  frame.append(player);
  if (opts.focus) player.focus();
}

function findLink(block) {
  const anchor = block.querySelector('a[href]');
  if (anchor) return { href: anchor.href, text: anchor.textContent.trim() };
  // tolerate a bare URL typed as text
  const text = block.textContent.trim().split(/\s+/).find((t) => /^https?:\/\//.test(t));
  return text ? { href: text, text } : null;
}

export default function decorate(block) {
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  const background = active.includes('autoplay');
  const playOnLoad = active.includes('playonload');

  const link = findLink(block);
  const posterEl = block.querySelector('picture') || block.querySelector('img');
  const posterSrc = posterEl?.querySelector?.('img')?.currentSrc
    || posterEl?.querySelector?.('img')?.src
    || (posterEl?.tagName === 'IMG' ? posterEl.src : '');

  block.textContent = '';
  if (!link) return;

  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return;
  }

  const title = link.text && !/^https?:\/\//.test(link.text) ? link.text : 'Video';
  block.dataset.embedLoaded = 'false';

  const frame = document.createElement('div');
  frame.className = 'video-frame';
  block.append(frame);

  const startsAutomatically = background || playOnLoad;

  if (posterEl) {
    block.classList.add('video-has-poster');
    const placeholder = document.createElement('div');
    placeholder.className = 'video-placeholder';
    placeholder.append(posterEl);
    frame.append(placeholder);

    if (!startsAutomatically) {
      const label = `Play video${title !== 'Video' ? `: ${title}` : ''}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'video-play';
      button.setAttribute('aria-label', label);
      button.title = label;
      placeholder.append(button);
      placeholder.addEventListener('click', () => {
        loadPlayer(block, url, {
          play: true, background: false, muted: false, poster: posterSrc, title, focus: true,
        });
      });
      return;
    }
  }

  // No poster (or an auto-starting option): lazy-load once the block nears the viewport.
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      const allowMotion = !prefersReducedMotion.matches;
      const play = playOnLoad && allowMotion;
      const ambient = background && allowMotion;
      loadPlayer(block, url, {
        play,
        background: ambient,
        // reduced motion: auto-starting options degrade to a normal, user-started player
        muted: play || ambient,
        poster: posterSrc,
        title,
      });
    }
  }, { rootMargin: '200px 0px' });
  observer.observe(block);
}
