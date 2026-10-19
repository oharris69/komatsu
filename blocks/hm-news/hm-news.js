/**
 * hm-news — "Dig into the latest" feed for /en-us/home-modern (prototype section.news,
 * data-section "news"): 2 photo features (landscape + portrait) and a 3-item thumbnail list.
 * Reconstructive (#95); layout is POSITIONAL (stories 1–2 = features, story 2 portrait,
 * 3+ = list). Schema: stardust/eds-schema/home-modern.json → sections[news]
 * (2 × ARTICLE.tile + 3 × LI.news-item). The section title and the "Read more news" CTA are
 * section default content around the block.
 *
 * Authoring (one row per story): cell 1 <picture> | cell 2 <p> read time, <p> date,
 * <h3><a>title</a></h3>, <ul> of tags. On features the tags show as a 2-line Meta list;
 * on list items they are visually hidden (prototype sr-only). The "·" separators are CSS.
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

function parts(row) {
  const out = {
    media: row.querySelector('picture') || row.querySelector('img'),
    heading: row.querySelector('h1, h2, h3, h4, h5, h6'),
    meta: [],
    tags: null,
    extra: [],
  };
  // capture the list BEFORE moving anything (EW1)
  row.querySelectorAll(':scope > div > *').forEach((node) => {
    if (node === out.heading || node.matches('picture, img')) return;
    if (node.querySelector('picture, img')) return;
    if (node.matches('ul, ol')) {
      if (!out.tags) out.tags = node;
      else out.extra.push(node);
    } else if (node.tagName === 'P' && !node.querySelector('a') && node.textContent.trim()) {
      out.meta.push(node);
    } else if (node.textContent.trim()) {
      out.extra.push(node);
    }
  });
  return out;
}

function metaBox(paras) {
  const meta = document.createElement('div');
  meta.className = 'meta';
  paras.forEach((p) => meta.append(wrapNode(p, 'meta-part')));
  return meta;
}

function lazy(media) {
  const img = media.tagName === 'IMG' ? media : media.querySelector('img');
  if (img) img.loading = 'lazy';
}

function buildFeature(p, portrait) {
  const card = document.createElement('article');
  card.className = portrait ? 'hm-news-feature hm-news-portrait' : 'hm-news-feature';
  if (p.media) {
    lazy(p.media);
    sizePicture(p.media, portrait
      ? '(min-width: 1280px) 25vw, (min-width: 900px) 42vw, 100vw'
      : '(min-width: 1280px) 42vw, (min-width: 900px) 58vw, 100vw', [480, 640, 960, 1280]);
    card.append(wrapNode(p.media, 'hm-news-media'));
  }
  const body = document.createElement('div');
  body.className = 'hm-news-body';
  if (p.meta.length) body.append(metaBox(p.meta));
  if (p.heading) body.append(wrapNode(p.heading, 'hm-news-title'));
  if (p.tags) body.append(wrapNode(p.tags, 'meta tags'));
  p.extra.forEach((n) => body.append(n));
  card.append(body);
  return card;
}

function buildItem(p) {
  const li = document.createElement('li');
  li.className = 'hm-news-item';
  if (p.media) {
    lazy(p.media);
    sizePicture(p.media, '88px', [100, 200]);
    li.append(wrapNode(p.media, 'hm-news-thumb'));
  }
  const copy = document.createElement('div');
  copy.className = 'hm-news-copy';
  if (p.heading) copy.append(wrapNode(p.heading, 'hm-news-title'));
  if (p.meta.length) copy.append(metaBox(p.meta));
  if (p.tags) copy.append(wrapNode(p.tags, 'hm-sr-only'));
  p.extra.forEach((n) => copy.append(n));
  li.append(copy);
  return li;
}

export default function decorate(block) {
  const stories = [...block.children].map(parts).filter((p) => p.heading || p.media);
  if (!stories.length) return;
  const grid = document.createElement('div');
  grid.className = 'hm-news-grid';
  stories.slice(0, 2).forEach((p, i) => grid.append(buildFeature(p, i === 1)));
  if (stories.length > 2) {
    const list = document.createElement('ul');
    list.className = 'hm-news-list';
    stories.slice(2).forEach((p) => list.append(buildItem(p)));
    grid.append(list);
  }
  const wrap = document.createElement('div');
  wrap.className = 'hm-wrap';
  wrap.append(grid);
  block.replaceChildren(wrap);
}
