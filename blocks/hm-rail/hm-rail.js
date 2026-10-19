/**
 * hm-rail — equipment category rail for /en-us/home-modern (prototype section.rail,
 * data-section "equipment-rail"): cut-out machines on white, scroll-snap, paging arrows + dots.
 * Reconstructive (#95): one authored row per category. Schema:
 * stardust/eds-schema/home-modern.json → sections[equipment-rail] (21 × LI.rail-item).
 *
 * Authoring (one row per item): cell 1 <picture> | cell 2 <p><a href>Category name</a></p>.
 * The whole item becomes one link (card-as-link, EW6): the authored label <p> is MOVED into the
 * generated <a> and its inner anchor unwrapped after reading the href.
 * The paging controls are runtime chrome: their aria-labels ("Previous page", "Next page",
 * "Go to page N" — captured strings) are not visible text.
 */

// Responsive renditions: the pipeline gives each picture only a 750px and a 2000px file. Point
// the SAME elements at a width ladder plus the slot's display size, so a 200px slot fetches a
// ~400px file. Attributes only — the authored image element keeps its identity (and index).
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

function el(tag, attrs = {}) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function buildItem(row) {
  const media = row.querySelector('picture') || row.querySelector('img');
  const link = row.querySelector('a[href]');
  if (!link) return null;
  const label = link.closest('p') || link;
  const li = el('li', { class: 'hm-rail-item' });
  const card = el('a', { class: 'hm-rail-link', href: link.getAttribute('href') });
  if (media) {
    const img = media.tagName === 'IMG' ? media : media.querySelector('img');
    if (img) img.loading = 'lazy';
    sizePicture(media, '(min-width: 1280px) 220px, (min-width: 900px) 25vw, 45vw', [240, 360, 480, 720]);
    card.append(wrapNode(media, 'hm-rail-media'));
  }
  if (label === link) {
    // HARNESS-ONLY fallback (EW5): a bare link with no <p>; DA content always has the <p>.
    const name = el('div', { class: 'hm-rail-name' });
    name.append(...link.childNodes);
    link.remove();
    card.append(name);
  } else {
    // runtime buttonization (bare link alone in a <p>) does not apply to a card label
    label.classList.remove('button-container');
    if (!label.classList.length) label.removeAttribute('class');
    card.append(wrapNode(label, 'hm-rail-name'));
    link.replaceWith(...link.childNodes);
  }
  li.append(card);
  return li;
}

function initPaging(track, controls) {
  const dotWrap = controls.querySelector('.hm-rail-dots');
  const arrows = [...controls.querySelectorAll('.hm-rail-arrow')];
  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 24;
  const step = () => track.clientWidth + gap();
  const pages = () => Math.max(1, Math.ceil(track.scrollWidth / step() - 0.05));
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  const page = () => (atEnd() ? pages() - 1 : Math.round(track.scrollLeft / step()));
  const go = (p) => track.scrollTo({ left: p * step() });
  const ensureDots = (n) => {
    while (dotWrap.children.length < n) {
      const d = el('button', {
        type: 'button',
        class: 'hm-rail-dot',
        'aria-label': `Go to page ${dotWrap.children.length + 1}`,
      });
      dotWrap.append(d);
    }
    [...dotWrap.children].forEach((d, i) => {
      d.hidden = i >= n;
      d.onclick = () => go(i);
    });
  };
  const update = () => {
    const n = pages();
    const p = page();
    ensureDots(n);
    [...dotWrap.children].forEach((d, i) => {
      if (i === p) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    arrows[0].disabled = track.scrollLeft <= 2;
    arrows[1].disabled = atEnd();
  };
  arrows.forEach((a) => a.addEventListener('click', () => go(page() + Number(a.dataset.dir))));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  update();
}

export default function decorate(block) {
  const rows = [...block.children];
  const items = rows.map(buildItem).filter(Boolean);
  if (!items.length) return;

  const trackId = `hm-rail-track-${Math.random().toString(36).slice(2, 8)}`;
  const track = el('ul', { class: 'hm-rail-track', id: trackId, tabindex: '-1' });
  track.append(...items);

  const controls = el('div', { class: 'hm-rail-controls' });
  const dots = el('div', { class: 'hm-rail-dots' });
  const arrowBox = el('div', { class: 'hm-rail-arrows' });
  [['-1', 'Previous page'], ['1', 'Next page']].forEach(([dir, label]) => {
    const b = el('button', {
      type: 'button', class: 'hm-rail-arrow', 'data-dir': dir, 'aria-label': label, 'aria-controls': trackId,
    });
    b.append(el('span', { 'aria-hidden': 'true' }));
    arrowBox.append(b);
  });
  controls.append(dots, arrowBox);

  const wrap = el('div', { class: 'hm-wrap' });
  wrap.append(track, controls);
  block.replaceChildren(wrap);
  initPaging(track, controls);
}
