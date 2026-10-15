/*
 * Shared page-level unit preference (Metric | Imperial (US)).
 * Every unit-bearing block (hero-product, table-specs, cards-product) reads getUnit() on decorate,
 * calls setUnit() from its own switch and re-renders on the 'komatsu:units' document event,
 * so switching on any block updates all of them.
 */

export const UNITS = ['imperial', 'metric'];
export const UNIT_EVENT = 'komatsu:units';
const STORAGE_KEY = 'komatsu-units';

/** @returns {string|null} the normalized unit, or null if not a known unit */
export function toUnit(value) {
  const unit = String(value || '').trim().toLowerCase();
  return UNITS.includes(unit) ? unit : null;
}

let current = null;

/**
 * Current unit: in-page choice, else stored preference, else the given (authored) fallback.
 * @param {string} [fallback]
 */
export function getUnit(fallback = 'imperial') {
  if (current) return current;
  try {
    const stored = toUnit(window.localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch (e) {
    // storage unavailable (privacy mode): fall through to the authored default
  }
  return toUnit(fallback) || 'imperial';
}

/** Store the unit and notify every listening block. */
export function setUnit(unit) {
  const next = toUnit(unit);
  if (!next) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch (e) {
    // ignore: the in-page preference still applies
  }
  document.dispatchEvent(new CustomEvent(UNIT_EVENT, { detail: { unit: next } }));
}

/**
 * @param {(unit: string) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onUnitChange(callback) {
  const handler = (e) => {
    const unit = toUnit(e.detail?.unit);
    if (unit) callback(unit);
  };
  document.addEventListener(UNIT_EVENT, handler);
  return () => document.removeEventListener(UNIT_EVENT, handler);
}

/**
 * Metric | Imperial (US) switch (track drawn in CSS from data-unit). Clicking a label or the track
 * calls setUnit(); the switch follows the shared preference on its own.
 * @param {object} [opts]
 * @param {string} [opts.unit] initial unit
 * @param {{ metric?: string, imperial?: string }} [opts.labels]
 * @param {string} [opts.className] group class (default: global 'units-switch' styles)
 * @param {string} [opts.buttonClassName] option button class (default 'units-switch-option')
 * @returns {HTMLElement}
 */
export function createUnitSwitch({
  unit = getUnit(), labels = {}, className = 'units-switch', buttonClassName = 'units-switch-option',
} = {}) {
  const text = { metric: 'Metric', imperial: 'Imperial (US)', ...labels };
  const group = document.createElement('div');
  group.className = className;
  group.setAttribute('role', 'group');
  // DOM order metric, imperial: CSS draws the track between them
  const buttons = ['metric', 'imperial'].map((u) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = buttonClassName;
    btn.dataset.unit = u;
    btn.textContent = text[u];
    return btn;
  });
  group.append(...buttons);

  const sync = (u) => {
    group.dataset.unit = u;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.unit === u)));
  };
  sync(toUnit(unit) || 'imperial');

  group.addEventListener('click', (e) => {
    // a click on the track (outside both labels) flips to the other unit
    const btn = e.target.closest('button[data-unit]')
      || buttons.find((b) => b.dataset.unit !== group.dataset.unit);
    if (!btn || btn.dataset.unit === group.dataset.unit) return;
    setUnit(btn.dataset.unit);
  });
  onUnitChange(sync);
  return group;
}
