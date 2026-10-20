/**
 * hm-tiles — photo tiles with scrimmed title links for /en-us/home-modern.
 * Default variant = routing bento (prototype section.tiles, "routing-tiles": 1 lead + 2×2).
 * Variant `contact` = 4 equal tiles (prototype section.contact, "get-in-touch"; its "Get in touch"
 * head is section default content). Reconstructive (#95): one authored row per tile.
 * Schema: stardust/eds-schema/home-modern.json → sections[routing-tiles], sections[get-in-touch].
 *
 * Authoring (one row per tile): cell 1 <picture> | cell 2 <h2>/<h3> wrapping the tile <a>.
 * The authored heading link is the whole-tile target (stretched ::after); headings keep their tag.
 * External targets open in a new tab; the hidden "opens in a new tab" hint + aria-describedby
 * mirror the prototype (a11y chrome tied to that behaviour).
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

function markNewTab(a, tile) {
  const url = new URL(a.href, window.location.href);
  if (url.origin === window.location.origin || url.hostname.endsWith('komatsu.com')) return;
  a.target = '_blank';
  a.rel = 'noopener';
  const hint = document.createElement('span');
  hint.id = `hm-newtab-${Math.random().toString(36).slice(2, 8)}`;
  hint.hidden = true;
  hint.textContent = 'opens in a new tab';
  a.setAttribute('aria-describedby', hint.id);
  tile.append(hint);
}

function buildTile(row, index, lead) {
  const media = row.querySelector('picture') || row.querySelector('img');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const label = heading || [...row.querySelectorAll('p')].find((p) => p.querySelector('a'));
  if (!label) return null;
  const tile = document.createElement('article');
  tile.className = index === 0 && lead ? 'hm-tile hm-tile-lead' : 'hm-tile';
  if (media) {
    const img = media.tagName === 'IMG' ? media : media.querySelector('img');
    if (img) img.loading = 'lazy';
    const sizes = index === 0 && lead ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 50vw';
    sizePicture(media, sizes, [320, 480, 640, 800, 960, 1280, 1600]);
    tile.append(wrapNode(media, 'hm-tile-media'));
  }
  // a heading link is never buttonized; a <p> fallback label may be — undo that skin
  label.classList.remove('button-container');
  if (!label.classList.length) label.removeAttribute('class');
  const link = label.querySelector('a[href]');
  if (link) {
    link.classList.remove('button', 'primary', 'secondary');
    if (!link.classList.length) link.removeAttribute('class');
  }
  tile.append(wrapNode(label, 'hm-tile-label'));
  if (link) markNewTab(link, tile);
  return tile;
}

export default function decorate(block) {
  const lead = !block.classList.contains('contact');
  const tiles = [...block.children]
    .map((row, i) => buildTile(row, i, lead))
    .filter(Boolean);
  if (!tiles.length) return;
  const grid = document.createElement('div');
  grid.className = 'hm-tiles-grid';
  grid.append(...tiles);
  const wrap = document.createElement('div');
  wrap.className = 'hm-wrap';
  wrap.append(grid);
  block.replaceChildren(wrap);
}
