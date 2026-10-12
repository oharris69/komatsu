/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import carouselEquipmentParser from './parsers/carousel-equipment.js';
import cardsTilesParser from './parsers/cards-tiles.js';
import tabsTechnologyParser from './parsers/tabs-technology.js';
import columnsPromoParser from './parsers/columns-promo.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/komatsu-cleanup.js';
import sectionsTransformer from './transformers/komatsu-sections.js';
import dmImagesTransformer from './transformers/komatsu-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'carousel-equipment': carouselEquipmentParser,
  'cards-tiles': cardsTilesParser,
  'tabs-technology': tabsTechnologyParser,
  'columns-promo': columnsPromoParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "homepage",
  "description": "Home landing with category icon carousel, image tile grid, tabbed technology feature, promo banner, latest-news card grid and get-in-touch tiles",
  "urls": [
    "https://www.komatsu.com/en-us",
    "https://www.komatsu.com/en-us/events/conexpo-2026/new-releases"
  ],
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "div.herocomponent.large_hero"
      ]
    },
    {
      "name": "carousel-equipment",
      "instances": [
        ".tilesmall.horizontal_scroll"
      ]
    },
    {
      "name": "cards-tiles",
      "instances": [
        ".tiles.tilesmall .tile-list"
      ]
    },
    {
      "name": "tabs-technology",
      "instances": [
        ".tabs.panelcontainer .cmp-tabs"
      ]
    },
    {
      "name": "columns-promo",
      "instances": [
        ".cmp-experiencefragment--parts-promo .promoblock"
      ]
    },
    {
      "name": "cards-news",
      "instances": [
        ".relatedarticle .grid.masonry"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Hero - Here's to progress",
      "selector": [
        "div.herocomponent.large_hero"
      ],
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "2",
      "name": "Equipment category scroller + product area tiles",
      "selector": [
        "div.columncontainer.pdding-top--medium"
      ],
      "style": "white-container",
      "blocks": [
        "carousel-equipment",
        "cards-tiles"
      ],
      "defaultContent": []
    },
    {
      "id": "3",
      "name": "Technology tabs",
      "selector": [
        "div.columncontainer.margin-bottom--medium"
      ],
      "style": "white-container",
      "blocks": [
        "tabs-technology"
      ],
      "defaultContent": [
        ".cmp-tabs > div:first-child > h3"
      ]
    },
    {
      "id": "4",
      "name": "Parts promo banner",
      "selector": [
        "div.experiencefragment:has(.cmp-experiencefragment--parts-promo)",
        ".cmp-experiencefragment--parts-promo"
      ],
      "style": null,
      "blocks": [
        "columns-promo"
      ],
      "defaultContent": []
    },
    {
      "id": "5",
      "name": "Dig into the latest (news)",
      "selector": [
        "div.columncontainer:has(.relatedarticle)",
        ".relatedarticle"
      ],
      "style": "white-container",
      "blocks": [
        "cards-news"
      ],
      "defaultContent": [
        ".relatedarticle .limit > h2",
        ".relatedarticle .related_button"
      ]
    },
    {
      "id": "6",
      "name": "Get in touch",
      "selector": [
        "div.columncontainer:has(> .columncontainer-main > .aem-Grid > .tiles.tilesmall:not(.masonry_layout))",
        ".tiles.tilesmall:not(.masonry_layout)"
      ],
      "style": null,
      "blocks": [
        "cards-tiles"
      ],
      "defaultContent": [
        ".tiles.tilesmall > p.tile-title"
      ]
    }
  ]
};

// TRANSFORMER REGISTRY
// Order: cleanup, then section breaks/metadata (needs 2+ sections), then DM/Scene7 images (afterTransform only)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  dmImagesTransformer,
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Initial cleanup + section breaks
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks using the embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Final cleanup, section metadata, DM/Scene7 image carriers
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root URL maps to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
