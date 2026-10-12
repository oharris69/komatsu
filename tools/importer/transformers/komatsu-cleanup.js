/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Komatsu site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html (https://www.komatsu.com/en-us).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / third-party widgets that can interfere with block matching.
    // Found in cleaned.html:
    //   <div id="onetrust-consent-sdk">  (OneTrust cookie banner + preference center)
    //   <div id="toast-container">        (toast notification host)
    //   <div id="ZN_7VtV2ILpaHNasQF">     (Qualtrics site-intercept container)
    //   <iframe id="destination_publishing_iframe_komatsu_0"> (Adobe Audience Manager)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#toast-container',
      '#ZN_7VtV2ILpaHNasQF',
      '#destination_publishing_iframe_komatsu_0',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global chrome (auto-populated header/footer in EDS). Found in cleaned.html:
    //   <header class="experiencefragment header-xf home-page-header-xf ...">
    //   <footer class="experiencefragment footer-xf ...">
    // AEM authoring artifacts: <div class="cq-placeholder"> and empty
    // <div class="hero-background-video"> inside div.herocomponent.
    WebImporter.DOMUtils.remove(element, [
      'header.header-xf',
      'footer.footer-xf',
      '.cq-placeholder',
      '.hero-background-video',
      'iframe',
      'link',
      'noscript',
    ]);

    // Strip AEM Core Components data-layer attributes (found: data-cmp-data-layer).
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
