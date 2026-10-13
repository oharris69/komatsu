/**
 * Header: logo, click-to-open drill-down drawer per top-level section,
 * expandable search, utility links and a URL-based breadcrumb.
 *
 * Content comes from the nav fragment (four sections):
 *   1. brand   — logo link
 *   2. sections — nested list: top-level items open the drawer, nested lists are drill levels
 *   3. tools   — search link (href = results URL + query param), utility links with icons
 *   4. labels  — UI strings: See all, Back, Close menu, Close search, Home
 */

const DESKTOP = window.matchMedia('(width >= 900px)');

async function fetchNav() {
  // metadata-independent: /content first (local preview), then root (DA/EDS)
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const doc = document.createElement('div');
  doc.innerHTML = await resp.text();
  // relative image paths are relative to the fragment, not to the current page
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return doc;
}

/**
 * Converts a nested <ul> into a tree of { title, href, children }.
 * @param {HTMLUListElement} ul
 * @returns {Array<Object>}
 */
function parseTree(ul) {
  if (!ul) return [];
  return [...ul.children].filter((li) => li.tagName === 'LI').map((li) => {
    const a = li.querySelector(':scope > a');
    return {
      title: (a || li).textContent.trim(),
      href: a ? a.getAttribute('href') : '',
      children: parseTree(li.querySelector(':scope > ul')),
    };
  });
}

/**
 * Reads the labels section into a lookup (first word lowercased → text).
 * @param {Element} section
 */
function readLabels(section) {
  const items = section ? [...section.querySelectorAll('li, p')].map((e) => e.textContent.trim()) : [];
  const find = (re, fallback) => items.find((t) => re.test(t)) || fallback;
  return {
    seeAll: find(/^see all/i, 'See all'),
    back: find(/^back/i, 'Back'),
    closeMenu: find(/^close menu/i, 'Close menu'),
    closeSearch: find(/^close search/i, 'Close search'),
    home: find(/^home/i, 'Home'),
    menu: find(/^menu$/i, 'Menu'),
    openMenu: find(/^open navigation/i, 'Open navigation menu'),
    newTab: find(/new tab/i, 'opens in a new tab'),
  };
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  children.flat().forEach((c) => c && node.append(c));
  return node;
}

function isExternal(href) {
  try {
    return new URL(href, window.location.href).origin !== window.location.origin;
  } catch (e) {
    return false;
  }
}

/**
 * Builds the drill-down drawer. Opened from a desktop trigger it starts at that
 * section; opened from the mobile menu, Back at the first level returns to the menu.
 * @param {Element} logoLink logo shown in the drawer bar (desktop)
 * @param {Object} labels UI strings
 * @param {Element} [footer] extra content shown below each level (mobile utility links)
 */
function buildDrawer(logoLink, labels, footer) {
  const closeBtn = el('button', { type: 'button', class: 'nav-drawer-close', 'aria-label': labels.closeMenu });
  const bar = el('div', { class: 'nav-drawer-bar' }, logoLink, closeBtn);
  const backBtn = el('button', { type: 'button', class: 'nav-drawer-back', hidden: '' }, labels.back);
  const panel = el('div', { class: 'nav-drawer-panel' });
  const drawer = el('div', {
    class: 'nav-drawer', id: 'nav-drawer', role: 'dialog', 'aria-modal': 'true', 'aria-hidden': 'true',
  }, bar, backBtn, panel);
  if (footer) drawer.append(footer);

  const stack = [];
  let lastTrigger = null;
  let fromMenu = null;

  function render() {
    const node = stack[stack.length - 1];
    panel.textContent = '';
    backBtn.hidden = stack.length < 2 && !fromMenu;
    const head = el('div', { class: 'nav-drawer-head' }, el('h3', {}, node.title));
    if (node.href && node.href !== '#') head.append(el('a', { href: node.href, class: 'nav-drawer-seeall' }, labels.seeAll));
    const list = el('ul', { class: 'nav-drawer-list' });
    node.children.forEach((child) => {
      const text = el('span', { class: 'nav-drawer-text' }, child.title);
      let item;
      if (child.children.length) {
        item = el('a', { href: child.href || '#', class: 'nav-drawer-link has-children', role: 'button' }, text, el('span', { class: 'nav-drawer-chevron', 'aria-hidden': 'true' }));
        item.addEventListener('click', (e) => {
          e.preventDefault();
          stack.push(child);
          render();
          drawer.scrollTop = 0;
          panel.querySelector('a, button')?.focus();
        });
      } else {
        item = el('a', { href: child.href, class: 'nav-drawer-link' }, text);
        if (isExternal(child.href)) item.target = '_blank';
      }
      list.append(el('li', {}, item));
    });
    panel.append(head, list);
  }

  function close({ restoreFocus = true } = {}) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (lastTrigger) {
      lastTrigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) lastTrigger.focus();
    }
  }

  /**
   * @param {Object} node section to show
   * @param {Element} trigger element that opened the drawer
   * @param {Function} [onBack] called when Back is used at the first level (mobile menu)
   */
  function open(node, trigger, onBack) {
    if (lastTrigger && lastTrigger !== trigger) lastTrigger.setAttribute('aria-expanded', 'false');
    lastTrigger = trigger;
    fromMenu = onBack || null;
    stack.length = 0;
    stack.push(node);
    render();
    drawer.scrollTop = 0;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  backBtn.addEventListener('click', () => {
    if (stack.length < 2 && fromMenu) {
      close({ restoreFocus: false });
      fromMenu();
      return;
    }
    stack.pop();
    render();
    drawer.scrollTop = 0;
  });

  return {
    drawer, closeBtn, open, close, isOpen: () => drawer.classList.contains('is-open'),
  };
}

/**
 * Mobile menu: hamburger + panel with a title bar, the top-level sections and
 * the utility links (with visible labels).
 */
function buildMobileMenu(tree, labels, utility, onSection) {
  const hamburger = el('button', {
    type: 'button', class: 'nav-hamburger', 'aria-label': labels.openMenu, 'aria-expanded': 'false', 'aria-controls': 'nav-menu',
  });
  const closeBtn = el('button', { type: 'button', class: 'nav-menu-close', 'aria-label': labels.closeMenu });
  const title = el('div', { class: 'nav-menu-title' }, el('span', {}, labels.menu), closeBtn);
  const list = el('ul', { class: 'nav-menu-sections' });
  tree.forEach((node) => {
    const row = el('a', {
      href: node.href || '#', class: 'nav-menu-section', role: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false',
    }, el('span', {}, node.title), el('span', { class: 'nav-menu-chevron', 'aria-hidden': 'true' }));
    row.addEventListener('click', (e) => {
      e.preventDefault();
      onSection(node, row);
    });
    list.append(el('li', {}, row));
  });
  const menu = el('div', {
    class: 'nav-menu', id: 'nav-menu', role: 'dialog', 'aria-modal': 'true', 'aria-hidden': 'true',
  }, title, list, utility);

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', String(open));
  };
  return {
    hamburger, menu, closeBtn, setOpen, isOpen: () => menu.classList.contains('is-open'),
  };
}

/**
 * Utility links with visible labels (used in the mobile menu and under drill levels).
 */
function buildUtilityList(toolLinks) {
  const ul = el('ul', { class: 'nav-utility' });
  toolLinks.forEach((link) => {
    const a = link.cloneNode(true);
    a.className = 'nav-utility-link';
    a.querySelectorAll('.nav-tool-code').forEach((c) => c.remove());
    a.querySelectorAll('.nav-tool-label').forEach((l, i) => { l.className = i === 0 ? 'nav-utility-label' : 'nav-tool-label'; });
    ul.append(el('li', {}, a));
  });
  return ul;
}

/**
 * Expandable search: icon button that reveals an input; Enter submits to the
 * search link's href with the query appended.
 */
function buildSearch(link, labels) {
  const label = link.textContent.trim();
  const icon = link.querySelector('img');
  const action = link.getAttribute('href');
  const toggle = el('button', {
    type: 'button', class: 'nav-search-toggle', 'aria-label': label, 'aria-expanded': 'false',
  }, icon);
  const input = el('input', {
    type: 'search', class: 'nav-search-input', placeholder: label, 'aria-label': label,
  });
  const closeBtn = el('button', { type: 'button', class: 'nav-search-close', 'aria-label': labels.closeSearch });
  const form = el('form', { class: 'nav-search-form', role: 'search', hidden: '' }, input, closeBtn);
  const wrap = el('div', { class: 'nav-search' }, toggle, form);

  const setOpen = (open) => {
    wrap.classList.toggle('is-open', open);
    form.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  };
  toggle.addEventListener('click', () => setOpen(true));
  closeBtn.addEventListener('click', () => {
    input.value = '';
    setOpen(false);
    toggle.focus();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `${action}${encodeURIComponent(q)}`;
  });
  return { wrap, close: () => setOpen(false) };
}

function buildTools(section, labels) {
  const tools = el('div', { class: 'nav-tools' });
  let search = null;
  [...section.querySelectorAll('li')].forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    if (/[?&][^=]+=$/.test(a.getAttribute('href') || '')) {
      search = buildSearch(a, labels);
      tools.append(search.wrap);
      return;
    }
    const img = a.querySelector('img');
    const strong = a.querySelector('strong');
    const labelText = [...a.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent).join(' ').trim();
    const link = el('a', { href: a.getAttribute('href'), class: 'nav-tool' });
    if (img) link.append(img);
    link.append(el('span', { class: 'nav-tool-label' }, labelText));
    if (strong) link.append(' ', el('span', { class: 'nav-tool-code' }, strong.textContent));
    if (isExternal(link.href)) {
      link.target = '_blank';
      link.append(el('span', { class: 'nav-tool-label' }, ` ${labels.newTab}`));
    }
    tools.append(link);
  });
  return { tools, search };
}

/**
 * Breadcrumb from the URL: home, then every ancestor path present in the nav
 * tree, then the current page title. Not shown on the home page.
 */
function buildBreadcrumb(homeHref, tree, labels) {
  const normalize = (p) => p.replace(/\.html$/, '').replace(/\/$/, '');
  const prefix = window.location.pathname.startsWith('/content/') ? '/content' : '';
  const path = normalize(window.location.pathname.slice(prefix.length));
  const home = normalize(homeHref);
  if (!path || path === home) return null;

  const titles = new Map();
  const index = (nodes) => nodes.forEach((n) => {
    if (n.href && n.href !== '#') titles.set(normalize(n.href), n.title);
    index(n.children);
  });
  index(tree);

  const crumbs = [{ title: labels.home, href: home }];
  const segments = path.split('/').filter(Boolean);
  for (let i = 1; i < segments.length; i += 1) {
    const p = `/${segments.slice(0, i).join('/')}`;
    if (p !== home && titles.has(p)) crumbs.push({ title: titles.get(p), href: p });
  }
  const h1 = document.querySelector('main h1');
  const current = (h1 && h1.textContent.trim()) || titles.get(path) || document.title;

  const ol = el('ol', {});
  crumbs.forEach((c) => ol.append(el('li', {}, el('a', { href: `${prefix}${c.href}` }, c.title))));
  ol.append(el('li', { 'aria-current': 'page' }, current));
  return el('nav', { class: 'breadcrumb', 'aria-label': 'Breadcrumb' }, ol);
}

/**
 * The header overlays the page only when the page opens with a full-bleed hero.
 */
function startsWithHero() {
  const first = document.querySelector('main > .section, main > div');
  return !!(first && first.querySelector('.hero-banner'));
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const [brandSec, sectionsSec, toolsSec, labelsSec] = [...fragment.children];
  const labels = readLabels(labelsSec);
  const tree = parseTree(sectionsSec && sectionsSec.querySelector('ul'));

  const brandLink = brandSec && brandSec.querySelector('a');
  const homeHref = brandLink ? brandLink.getAttribute('href') : '/';
  const makeLogo = () => {
    const a = el('a', { href: homeHref, class: 'nav-logo', 'aria-label': brandLink?.querySelector('img')?.alt || 'Home' });
    const img = brandLink?.querySelector('img');
    if (img) a.append(img.cloneNode(true));
    return a;
  };

  const { tools, search } = buildTools(toolsSec || el('div'), labels);
  const toolLinks = [...tools.querySelectorAll(':scope > .nav-tool')];
  const overlay = el('div', { class: 'nav-overlay', hidden: '' });
  const drawer = buildDrawer(makeLogo(), labels, buildUtilityList(toolLinks));

  let mobile = null;
  const closeAll = () => {
    if (drawer.isOpen()) drawer.close({ restoreFocus: !mobile.isOpen() });
    if (mobile.isOpen()) {
      mobile.setOpen(false);
      mobile.hamburger.focus();
    }
    overlay.hidden = true;
  };
  mobile = buildMobileMenu(tree, labels, buildUtilityList(toolLinks), (node, row) => {
    overlay.hidden = false;
    drawer.open(node, row, () => mobile.menu.querySelector('.nav-menu-section')?.focus());
  });
  mobile.hamburger.addEventListener('click', () => {
    overlay.hidden = false;
    mobile.setOpen(true);
    mobile.closeBtn.focus();
  });
  mobile.closeBtn.addEventListener('click', closeAll);
  drawer.closeBtn.addEventListener('click', closeAll);
  overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (drawer.isOpen() || mobile.isOpen())) closeAll();
  });

  const sections = el('ul', { class: 'nav-sections' });
  tree.forEach((node) => {
    const trigger = el('a', {
      href: node.href || '#',
      class: 'nav-section-trigger',
      role: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
      'aria-controls': 'nav-drawer',
    }, node.title);
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.hidden = false;
      drawer.open(node, trigger);
    });
    sections.append(el('li', {}, trigger));
  });

  const nav = el('nav', { id: 'nav', class: 'nav', 'aria-label': 'Main' }, mobile.hamburger, makeLogo(), el('div', { class: 'nav-sections-wrapper' }, sections), tools);
  const wrapper = el('div', { class: 'nav-wrapper' }, nav);
  block.append(wrapper, overlay, mobile.menu, drawer.drawer);

  const header = block.closest('header');
  if (header && startsWithHero()) header.classList.add('header-overlay');

  // the breadcrumb belongs to the page, directly below the header bar
  const breadcrumb = buildBreadcrumb(homeHref, tree, labels);
  if (breadcrumb && header) {
    header.parentElement.querySelector(':scope > nav.breadcrumb')?.remove();
    header.after(breadcrumb);
  }

  // crossing the desktop breakpoint resets any open panel state
  DESKTOP.addEventListener('change', () => {
    closeAll();
    if (search) search.close();
  });
}
