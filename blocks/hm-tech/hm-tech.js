/**
 * hm-tech — Technology text tabs for /en-us/home-modern (prototype section.tech,
 * data-section "technology"): text tabs on a rule + split panel (copy | photo) with a
 * two-column text-link list. Reconstructive (#95), WAI-ARIA tabs (arrows / Home / End).
 * Schema: stardust/eds-schema/home-modern.json → sections[technology] (3 × DIV.tab-panel).
 * The section title ("Technology") is section default content above the block.
 *
 * Authoring (one row per tab): cell 1 <p> tab label | cell 2 <h3> subtitle, <p> body,
 * <ul> of <li><a> links, <p><strong><a>…</a></strong></p> CTA, <picture>.
 * Tabs are role="tab" divs (EW7: a <button> cannot host the inline editor) holding the MOVED
 * authored label <p>. The tablist aria-label "Select a tab" is captured a11y chrome.
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

const uid = () => Math.random().toString(36).slice(2, 8);

function buildPanel(cell) {
  const panel = document.createElement('div');
  panel.className = 'hm-tab-panel';
  const copy = document.createElement('div');
  copy.className = 'hm-panel-copy';
  const photo = document.createElement('div');
  photo.className = 'hm-panel-photo';
  const actions = document.createElement('div');
  actions.className = 'actions';
  // capture the child list BEFORE moving anything (EW1)
  [...cell.children].forEach((node) => {
    const media = node.matches('picture, img') ? node : node.querySelector('picture, img');
    if (media) {
      const img = media.tagName === 'IMG' ? media : media.querySelector('img');
      if (img) img.loading = 'lazy';
      sizePicture(media, '(min-width: 900px) 50vw, 100vw', [480, 640, 960, 1280, 1600]);
      photo.append(media.tagName === 'IMG' && media.closest('picture') ? media.closest('picture') : media);
    } else if (/^H[1-6]$/.test(node.tagName)) {
      copy.append(wrapNode(node, 'subtitle'));
    } else if (node.matches('ul, ol')) {
      copy.append(wrapNode(node, 'links'));
    } else if (node.tagName === 'P' && node.querySelector('a.button, strong > a, em > a')) {
      actions.append(node);
    } else if (node.textContent.trim()) {
      copy.append(wrapNode(node, 'body'));
    }
  });
  if (actions.children.length) copy.append(actions);
  panel.append(copy);
  if (photo.children.length) panel.append(photo);
  return panel;
}

export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  if (!rows.length) return;
  const id = uid();
  const tablist = document.createElement('div');
  tablist.className = 'hm-tablist';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Select a tab');
  const panels = [];
  const tabs = [];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells.length > 1 ? cells[0] : null;
    const panelCell = cells.length > 1 ? cells[1] : cells[0];
    const tab = document.createElement('div');
    tab.className = 'hm-tab';
    tab.id = `hm-tab-${id}-${i}`;
    tab.setAttribute('role', 'tab');
    const label = labelCell && (labelCell.querySelector('p, h1, h2, h3, h4, h5, h6')
      || labelCell.firstElementChild);
    if (label) tab.append(label);
    const panel = buildPanel(panelCell);
    panel.id = `hm-panel-${id}-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.setAttribute('aria-controls', panel.id);
    tabs.push(tab);
    panels.push(panel);
  });
  tablist.append(...tabs);

  const select = (tab, focus) => {
    tabs.forEach((t, i) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) {
      tab.focus();
      tab.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  };
  const more = () => tablist.classList.toggle(
    'has-more',
    tablist.scrollLeft + tablist.clientWidth < tablist.scrollWidth - 2,
  );
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, true));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(tab, true);
        return;
      }
      const k = {
        ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1,
      }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      select(tabs[(k + tabs.length) % tabs.length], true);
    });
  });
  tablist.addEventListener('scroll', more, { passive: true });
  window.addEventListener('resize', more);

  const wrap = document.createElement('div');
  wrap.className = 'hm-wrap';
  wrap.append(tablist, ...panels);
  block.replaceChildren(wrap);
  select(tabs[0], false);
  requestAnimationFrame(more);
}
