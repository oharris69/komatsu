/**
 * hm-hero — campaign hero for /en-us/home-modern (prototype section.hero, data-section "hero").
 * Template-slotted (#95): fixed composition, authored nodes are MOVED into role slots (EW1).
 * Schema: stardust/eds-schema/home-modern.json → sections[hero].
 *
 * Authoring (one row, two cells; a single-cell shape is tolerated — content is queried):
 *   cell 1: <picture> desktop image (21:9) [+ optional 2nd <picture> = mobile art direction, 3:4]
 *   cell 2: <h1> headline, <p> lede, <p><em><a>…</a></em></p> CTA (→ a.button.secondary)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const isMedia = (el) => el.matches('picture, img');

export default function decorate(block) {
  // 1. QUERY the authored content before moving anything.
  const media = [...block.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')));
  const heading = block.querySelector('h1, h2, h3');
  const paras = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const ctas = paras.filter((p) => p.querySelector('a'));
  const ledes = paras.filter((p) => !p.querySelector('a'));
  const leftovers = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((el) => !isMedia(el) && el !== heading && !paras.includes(el)
      && !el.querySelector('picture, img') && el.textContent.trim());

  // 2. CREATE the prototype's layout wrappers.
  const mediaBox = document.createElement('div');
  mediaBox.className = 'hm-hero-media';
  media.slice(0, 2).forEach((m, i) => {
    mediaBox.append(wrapNode(m, i === 0 ? 'hm-hero-desktop' : 'hm-hero-mobile'));
  });

  const copy = document.createElement('div');
  copy.className = 'hm-hero-copy';
  if (heading) copy.append(wrapNode(heading, 'headline'));
  ledes.forEach((p) => copy.append(wrapNode(p, 'lede')));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    ctas.forEach((p) => actions.append(p));
    copy.append(actions);
  }
  leftovers.forEach((el) => copy.append(el));

  const inner = document.createElement('div');
  inner.className = 'hm-wrap hm-hero-inner';
  inner.append(copy);

  // 3. LCP: eager-load only the image the current breakpoint shows (#100).
  const imgs = media.map((m) => (m.tagName === 'IMG' ? m : m.querySelector('img')));
  const mobile = imgs.length > 1 && window.matchMedia('(max-width: 899px)').matches;
  const lcp = mobile ? imgs[1] : imgs[0];
  if (lcp) {
    lcp.loading = 'eager';
    lcp.fetchPriority = 'high';
  }
  imgs.filter((img) => img && img !== lcp).forEach((img) => { img.loading = 'lazy'; });

  block.replaceChildren(mediaBox, inner);
}
