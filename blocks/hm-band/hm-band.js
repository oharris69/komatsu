/**
 * hm-band — the One Band (prototype section.parts, data-section "parts-band"): copy on a
 * full-bleed Komatsu Blue band, 48×4 yellow accent rule, photo bleeding to the right page edge.
 * Template-slotted (#95): authored nodes are MOVED into fixed role slots (EW1).
 * Schema: stardust/eds-schema/home-modern.json → sections[parts-band].
 * D1 note: prose-shaped, kept a block for the bespoke split/bleed composition (conversion log).
 *
 * Authoring (one row): cell 1 <h2>, <p> body, <p><strong><a>…</a></strong></p> CTA
 * (primary, reskinned to the approved solid-white inverse) | cell 2 <picture> (decorative, alt="").
 * External CTA targets open in a new tab with the prototype's sr-only "opens in a new tab"
 * announcement inside the link (a11y chrome tied to that behaviour).
 */

// Responsive renditions: the pipeline gives each <picture> only a 750px and a 2000px file. Point
// the SAME elements at a width ladder plus the slot's display size, so a 200px slot fetches a
// ~400px file. Attributes only — the authored <img> keeps its identity (and data-image-index).
function sizePicture(media, sizes, widths) {
  const pic = media.tagName === 'PICTURE' ? media : media.closest('picture');
  if (!pic) return;
  const ladder = (src) => {
    const u = new URL(src, window.location.href);
    if (!u.pathname.includes('/media_')) return null;
    return widths.map((w) => {
      u.searchParams.set('width', w);
      return `${u.pathname}${u.search} ${w}w`;
    }).join(', ');
  };
  pic.querySelectorAll('source').forEach((s) => {
    const set = ladder(s.getAttribute('srcset').split(' ')[0]);
    if (!set) return;
    s.srcset = set;
    s.sizes = sizes;
    s.removeAttribute('media');
  });
  const img = pic.querySelector('img');
  const set = img && ladder(img.getAttribute('src'));
  if (set) {
    img.srcset = set;
    img.sizes = sizes;
  }
}

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function markNewTab(a) {
  const url = new URL(a.href, window.location.href);
  if (url.origin === window.location.origin || url.hostname.endsWith('komatsu.com')) return;
  a.target = '_blank';
  a.rel = 'noopener';
  const hint = document.createElement('span');
  hint.className = 'hm-sr-only';
  hint.textContent = ' opens in a new tab';
  a.append(hint);
}

export default function decorate(block) {
  const media = block.querySelector('picture') || block.querySelector('img');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const ctas = paras.filter((p) => p.querySelector('a'));
  const body = paras.filter((p) => !p.querySelector('a'));

  const copy = document.createElement('div');
  copy.className = 'hm-band-copy';
  const rule = document.createElement('span');
  rule.className = 'hm-accent-rule';
  rule.setAttribute('aria-hidden', 'true');
  copy.append(rule);
  if (heading) copy.append(wrapNode(heading, 'headline'));
  body.forEach((p) => copy.append(wrapNode(p, 'body')));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    ctas.forEach((p) => {
      actions.append(p);
      const a = p.querySelector('a[href]');
      if (a) markNewTab(a);
    });
    copy.append(actions);
  }

  const inner = document.createElement('div');
  inner.className = 'hm-wrap hm-band-inner';
  inner.append(copy);
  const parts = [inner];
  if (media) {
    const img = media.tagName === 'IMG' ? media : media.querySelector('img');
    if (img) img.loading = 'lazy';
    sizePicture(media, '(min-width: 900px) 50vw, 100vw', [480, 640, 960, 1280]);
    parts.push(wrapNode(media, 'hm-band-photo'));
  }
  block.replaceChildren(...parts);
}
