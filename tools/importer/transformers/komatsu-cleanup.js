/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Komatsu site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html for each template:
 *   homepage (https://www.komatsu.com/en-us), article (Newberry newsroom article),
 *   technology-landing (https://www.komatsu.com/en-us/technology/smart-construction),
 *   equipment-category-listing (https://www.komatsu.com/en-us/products/equipment/excavators).
 * Template-specific rules are gated on payload.template.name, so they are
 * no-ops for the other templates.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };
// Temporary marker on section headings lifted out of model-page blocks (removed in afterTransform).
const LIFTED_HEADING_ATTR = 'data-km-lifted-heading';

export default function transform(hookName, element, payload) {
  const templateName = payload && payload.template && payload.template.name;
  const isTechLanding = templateName === 'technology-landing';
  const isEquipmentListing = templateName === 'equipment-category-listing';
  // Dozer model pages (Run 7). Gated on the template name AND the model-page-only
  // product header component (div.equipmentdetail), so every rule below is a no-op
  // on homepage / article / technology-landing / equipment-category-listing.
  const isModelDetail = templateName === 'equipment-model-detail'
    && !!element.querySelector('div.equipmentdetail');
  // Templates whose hero-split / section 1 selector is `div.breadcrumb + div.splitcontentcomponent`.
  const keepBreadcrumbForParsing = isTechLanding || isEquipmentListing;
  const doc = element.ownerDocument || document;

  // Replace a heading element with a plain heading of another level (text only).
  const retag = (el, tag) => {
    const h = doc.createElement(tag);
    h.textContent = el.textContent.trim();
    el.replaceWith(h);
  };

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

    // Article pages (migration-work/cleaned.html, Newberry newsroom article):
    //   <div class="breadcrumb"><nav class="cmp-breadcrumb"> - not authored; rebuilt
    //     from the URL by the header. Removed before parsing so no parser sees it.
    //   <div class="relatedarticle"> ... <div class="tile d-none"> - hidden
    //     "load more" related-article tiles; removed so cards-news only gets the
    //     visible tiles.
    // Neither exists on the homepage, so these are no-ops there.
    // technology-landing / equipment-category-listing exception: their hero-split
    // block instance and section 1 selector are `div.breadcrumb + div.splitcontentcomponent`,
    // so the breadcrumb must survive block parsing; it is removed in afterTransform.
    WebImporter.DOMUtils.remove(element, [
      ...(keepBreadcrumbForParsing ? [] : ['div.breadcrumb', '.cmp-breadcrumb']),
      '.relatedarticle .tile.d-none',
    ]);

    // Tabs widget chrome (homepage + technology-landing), found in cleaned.html:
    //   <div class="tabs panelcontainer"><div class="cmp-tabs ...">
    //     <h4 class="tab-title">Select continent</h4>
    //     <select class="dropdown"> (mobile tab switcher, populated by JS)
    // The tabs-technology parser already ignores both (it reads only tab labels,
    // tab panels and the `:scope > div > h3` heading), so homepage output is unchanged.
    WebImporter.DOMUtils.remove(element, [
      '.tabs.panelcontainer .cmp-tabs > h4.tab-title',
      '.tabs.panelcontainer .cmp-tabs > select.dropdown',
    ]);

    if (isTechLanding || isEquipmentListing || isModelDetail) {
      // Tiles heading is a styled paragraph (cleaned.html):
      //   technology-landing section 5: <p class="tile-title">Learn more about ...</p>
      //   equipment-category-listing section 6: <p class="tile-title">Find what works for you</p>
      //   equipment-model-detail section 13: <p class="tile-title">Find what works for you</p>
      //   (all inside <div class="tilescolorblocks tilesmall">)
      // Promote to a real h2 (default content). The cards-tiles instance is
      // `.tilescolorblocks.tilesmall .tiles_color_blocks`, so the parser never sees it.
      element.querySelectorAll('.tilescolorblocks.tilesmall > p.tile-title').forEach((p) => {
        const h2 = doc.createElement('h2');
        h2.textContent = p.textContent.trim();
        p.replaceWith(h2);
      });
    }

    if (templateName === 'homepage') {
      // "Get in touch" is a styled paragraph (<div class="tiles tilesmall"><p class="tile-title">);
      // promote it to a real section heading like the other templates.
      element.querySelectorAll('.tiles.tilesmall > p.tile-title').forEach((p) => {
        const h2 = doc.createElement('h2');
        h2.textContent = p.textContent.trim();
        p.replaceWith(h2);
      });
      // "Read more news" is a filled (btn-primary) button on the source: emphasise the link so
      // EDS decorates it as a primary button.
      element.querySelectorAll('.relatedarticle .related_button a').forEach((a) => {
        if (a.closest('strong')) return;
        const strong = doc.createElement('strong');
        a.replaceWith(strong);
        strong.append(a);
      });
    }

    if (isEquipmentListing) {
      // Single page H1 = hero-split title (<h1 class="split-content-title">Excavators</h1>).
      // Demote the other source H1s before parsing; both parsers keep the source tag:
      //   section 3 photo banner (hero-banner parser picks `.hero-field h1, .hero-field h2, ...`):
      //     <div class="herocomponent ... dark_gradient_overlay ..."><div class="hero-field">
      //       <h1 class="cmp-title__text title_header">The future of excavation is now</h1>
      //   section 5 columns-media (parser copies heading.tagName):
      //     <div class="columncontainer ..."><div class="columncontainer-main"><div class="aem-Grid">
      //       <div class="splitcontentcomponent"> ... <h1 class="split-content-title">Industries we support</h1>
      //   The hero-split's own h1 sits under #container-bea4b9443f > .aem-Grid (no
      //   .columncontainer-main), so it is not matched.
      element.querySelectorAll(
        'div.herocomponent.dark_gradient_overlay .hero-field h1, '
        + '.columncontainer-main > .aem-Grid > .splitcontentcomponent h1.split-content-title',
      ).forEach((h1) => retag(h1, 'h2'));

      // Product listing (section 4). Live DOM: div.equipmentlisting has exactly two
      // children - div.cmp-equipmentlisting (replaced by the cards-product parser with
      // its config block) and <template id="equipmentListingOverlayTemplate">
      // ("Archived Product" overlay chip, JS-only). Remove the template so nothing
      // outside the parsed block leaks into the page.
      WebImporter.DOMUtils.remove(element, [
        '#equipmentListingOverlayTemplate',
        'div.equipmentlisting > template',
      ]);
    }

    if (isModelDetail) {
      // Non-authorable widgets (cleaned.html, d71exi-24):
      //   <div class="metricimperialconverter ..."> page-level Metric | Imperial switch next
      //     to the breadcrumb (replaced by the blocks' shared units switch, scripts/units.js)
      //   <div class="columncontainer ..."><div id="webthreesixty" class="columncontainer-main none">
      //     <div class="aem-Grid"><div class="webrotate360 ..."> - 360 viewer, excluded by decision
      //   <div class="anchor-links"> ... <li><a href="#threesixty"> 360° </a></li> - its jump link
      //   <span class="cmp-link__screen-reader-only">opens in a new tab</span> - SR-only suffix
      //     inside links (request-a-quote, resources rail, tiles); the blocks decide new-tab
      //     behaviour from host/extension, so the suffix must not leak into link text.
      //   <div class="machinespecs"> ... <br> - stray break before div.cmp-machinespecs
      // Hidden-but-real content (collapsed spec groups .cmp-accordion__panel--hidden, inactive
      // tab panels, gallery/carousel slides, equipment lists) is deliberately NOT touched.
      WebImporter.DOMUtils.remove(element, [
        '.metricimperialconverter',
        'div.columncontainer:has(> .columncontainer-main > .aem-Grid > .webrotate360)',
        'div.webrotate360',
        'span.cmp-link__screen-reader-only',
        'div.machinespecs > br',
      ]);
      element.querySelectorAll('.anchor-links li').forEach((li) => {
        if (li.querySelector('a[href="#threesixty"]')) li.remove();
      });

      // Single page H1 = hero-product model name (h1.equipment-details__sku). Demote other
      // source H1s that parsers copy by tag (none on d71exi-24; the components' default
      // heading level is h1 when no headingType is set, per the split component comment):
      //   promo XF hero (hero-banner parser picks `.hero-field h1, .hero-field h2, ...`)
      //   split promo h1.split-content-title (columns-media parser copies heading.tagName)
      // (The carousel's h1.carousel-title "Videos" is emitted as h2 by the carousel-gallery parser.)
      element.querySelectorAll(
        'div.experiencefragment div.herocomponent .hero-field h1, '
        + 'div.splitcontentcomponent h1.split-content-title',
      ).forEach((h1) => retag(h1, 'h2'));

      // Section headings -> H2 default content at the top of each section, outside the block
      // element the parser replaces (cleaned.html):
      //   s5  div.featuresandbenefits > div.features-and-benefits#features > h2 "Features and benefits"
      //   s6  div.machinespecs > div.cmp-machinespecs > div#specifications.cmp-tabs > h3 "Specifications"
      //   s7  div.cardscontainer > div.cards-container#serviceandsupport > h2 "Support you can count on"
      //   s8  div.tabs.panelcontainer > div#technology.cmp-tabs > div > h3 "Technology"
      //   s12 div.relatedproducts > div > div.related-products > h2 "Related products"
      //       (block instance is div.relatedproducts itself, so the heading goes before it;
      //       komatsu-sections.js then puts the section <hr> between the two, so the heading
      //       is moved back below that <hr> in afterTransform - see LIFTED_HEADING_ATTR)
      const lift = (heading, target) => {
        if (!heading || !target || !heading.textContent.trim()) return;
        const h2 = doc.createElement('h2');
        h2.setAttribute(LIFTED_HEADING_ATTR, '');
        h2.textContent = heading.textContent.trim();
        target.before(h2);
        heading.remove();
      };
      element.querySelectorAll('div.featuresandbenefits > .features-and-benefits').forEach((block) => {
        lift(block.querySelector(':scope > h2'), block);
      });
      element.querySelectorAll('div.machinespecs > .cmp-machinespecs').forEach((block) => {
        lift(block.querySelector(':scope > .cmp-tabs > h3'), block);
      });
      element.querySelectorAll('div.cardscontainer > .cards-container').forEach((block) => {
        lift(block.querySelector(':scope > h2'), block);
      });
      element.querySelectorAll('div.tabs.panelcontainer > .cmp-tabs').forEach((block) => {
        const h3 = block.querySelector(':scope > div:first-child > h3');
        if (!h3) return;
        const wrapper = h3.parentElement;
        lift(h3, block);
        if (!wrapper.textContent.trim() && !wrapper.querySelector('img, picture')) wrapper.remove();
      });
      element.querySelectorAll('div.relatedproducts').forEach((block) => {
        lift(block.querySelector('.related-products > h2'), block);
      });

      // s9 infographic (default content, no block):
      //   div.columncontainer > div#infographic.columncontainer-main > div.columncontainer-title > h2
      //   + div.aem-Grid > div.image > div.cmp-image > picture (kept as-is)
      element.querySelectorAll('.columncontainer-main > .columncontainer-title').forEach((title) => {
        const text = title.textContent.trim();
        if (!text) { title.remove(); return; }
        const h2 = doc.createElement('h2');
        h2.textContent = text;
        title.replaceWith(h2);
      });
    }
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

    if (keepBreadcrumbForParsing) {
      // Breadcrumb deferred from beforeTransform (needed by the hero-split selector).
      WebImporter.DOMUtils.remove(element, ['div.breadcrumb', '.cmp-breadcrumb']);
    }

    if (isModelDetail) {
      // Section headings lifted in beforeTransform must open their own section. Where the
      // block element is also the section element (div.relatedproducts), komatsu-sections.js
      // inserted the section <hr> between heading and block: move the heading below it.
      element.querySelectorAll(`[${LIFTED_HEADING_ATTR}]`).forEach((h2) => {
        const next = h2.nextElementSibling;
        if (next && next.tagName === 'HR') next.after(h2);
        h2.removeAttribute(LIFTED_HEADING_ATTR);
      });
    }

    if (isEquipmentListing) {
      // Safety net: the cards-product parser replaces div.cmp-equipmentlisting with
      // a config block (data comes from products.json), so after parsing none of the
      // JS-rendered listing parts (cleaned.html) should remain. If any survive (parser
      // missing/failed), drop them rather than leak filters, 12 sample tiles,
      // "Items per page"/"Load more results" and counters as default content:
      //   div.cmp-equipmentlisting__menu--background, aside.cmp-equipmentlisting__menu,
      //   div.cmp-equipmentlisting__content, div.isNotFirstLoad
      WebImporter.DOMUtils.remove(element, ['div.cmp-equipmentlisting']);
    }

    if (isTechLanding) {

      // Section 2 heading: <div class="cmp-tabs"><div><h3>Smart Construction solutions</h3>
      // The tabs-technology parser matches the h3 and lifts it out in front of the
      // block (inside div.tabs.panelcontainer), so the h3 -> h2 swap must run
      // after parsing. Second selector covers the un-parsed DOM.
      element.querySelectorAll(
        '.tabs.panelcontainer > h3, .tabs.panelcontainer .cmp-tabs > div:first-child > h3',
      ).forEach((h3) => {
        const h2 = doc.createElement('h2');
        h2.textContent = h3.textContent.trim();
        h3.replaceWith(h2);
      });

      // CTA banner (section 6, default content), found in cleaned.html:
      //   <div class="herocomponent title blue_bg ...">
      //     <div class="hero-background bgcolor"></div> <div class="hero-background-video"></div>
      //     <div class="hero-field"><h2 class="cmp-title__text title_header">Ready for Smart Construction?</h2>
      //       <div class="button button_div"><a class="cmp-button btn-secondary" href="/en-us/komatsu-locator">
      // Replace the wrapper with a plain heading + linked paragraph. The section 6
      // Section Metadata is anchored on the marker <hr> komatsu-sections.js
      // inserts in beforeTransform, so replacing the wrapper here is safe.
      element.querySelectorAll('div.herocomponent.blue_bg').forEach((hero) => {
        const out = [];
        const heading = hero.querySelector('.hero-field > h2');
        if (heading && heading.textContent.trim()) {
          const h2 = doc.createElement('h2');
          h2.textContent = heading.textContent.trim();
          out.push(h2);
        }
        hero.querySelectorAll('.hero-field a.cmp-button[href]').forEach((a) => {
          const label = a.querySelector('.cmp-button__buttontext') || a;
          const text = label.textContent.trim();
          if (!text) return;
          const p = doc.createElement('p');
          const link = doc.createElement('a');
          link.setAttribute('href', a.getAttribute('href'));
          link.textContent = text;
          p.append(link);
          out.push(p);
        });
        if (out.length) hero.replaceWith(...out);
      });
    }

    // Strip AEM Core Components data-layer attributes (found: data-cmp-data-layer).
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
