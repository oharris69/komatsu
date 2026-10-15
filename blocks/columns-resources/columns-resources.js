/*
 * Columns Resources: overview text | "Resources" rail of icon links.
 * One row, 2 cells: [heading + paragraph(s) + list] | [heading + list of links].
 * Link icon (and new-tab behaviour) is derived from the link itself:
 *   .pdf -> download (new tab), other host -> external (new tab), else chevron.
 * An authored :icon-name: token inside the link wins over the derived icon.
 */

/** @returns {{ icon: string, newTab: boolean }} */
export function linkType(a) {
  let url;
  try {
    url = new URL(a.getAttribute('href') || '', window.location.href);
  } catch (e) {
    return { icon: 'chevron', newTab: false };
  }
  if (/\.pdf$/i.test(url.pathname)) return { icon: 'download', newTab: true };
  const own = url.origin === window.location.origin
    || /(^|\.)komatsu\.com$/.test(url.hostname)
    || /\.aem\.(page|live)$/.test(url.hostname);
  if (!own || a.target === '_blank') return { icon: 'external', newTab: true };
  return { icon: 'chevron', newTab: false };
}

function decorateRail(rail) {
  rail.querySelectorAll('a[href]').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary');
    a.classList.add('columns-resources-link');
    const { icon, newTab } = linkType(a);
    if (newTab) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const sr = document.createElement('span');
      sr.className = 'columns-resources-sr';
      sr.textContent = ' (opens in a new tab)';
      a.append(sr);
    }
    if (!a.querySelector('.icon')) {
      const span = document.createElement('span');
      span.className = `columns-resources-icon columns-resources-icon-${icon}`;
      span.setAttribute('aria-hidden', 'true');
      a.prepend(span);
    }
    a.closest('.button-container')?.classList.remove('button-container');
  });
}

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const [main, rail] = [...row.children];
  row.classList.add('columns-resources-row');
  main?.classList.add('columns-resources-main');
  if (rail) {
    rail.classList.add('columns-resources-rail');
    decorateRail(rail);
  } else {
    block.classList.add('columns-resources-single');
  }
}
