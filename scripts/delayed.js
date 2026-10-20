// add delayed functionality here
import { getMetadata, loadScript } from './aem.js';

// Adobe Target: not loaded on the demo site. scripts/at-lsig.js (at.js) stays in the repo —
// to re-enable, set window.targetGlobalSettings and load
// `${window.hlx.codeBasePath}/scripts/at-lsig.js` with Komatsu's own Target property.

/**
 * Loads the scripts listed in the page's `js-files` metadata (comma-separated URLs).
 */
function embedCustomLibraries() {
  const externalLibs = getMetadata('js-files');
  if (!externalLibs) return;
  externalLibs.split(',').map((url) => url.trim()).filter(Boolean)
    .forEach((url) => loadScript(url));
}

if (!window.location.hostname.includes('localhost')) {
  embedCustomLibraries();
}
