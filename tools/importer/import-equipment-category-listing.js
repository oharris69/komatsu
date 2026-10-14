/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSplitParser from './parsers/hero-split.js';
import cardsTilesParser from './parsers/cards-tiles.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsMediaParser from './parsers/columns-media.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/komatsu-cleanup.js';
import sectionsTransformer from './transformers/komatsu-sections.js';
import dmImagesTransformer from './transformers/komatsu-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-split': heroSplitParser,
  'cards-tiles': cardsTilesParser,
  'hero-banner': heroBannerParser,
  'cards-product': cardsProductParser,
  'columns-media': columnsMediaParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "equipment-category-listing",
  "description": "Equipment category page with split hero, sub-category chips, faceted filter sidebar, product tile grid and industries/find-what-works CTA tiles",
  "urls": [
    "https://www.komatsu.com/en-us/industries/underground-soft-rock-mining",
    "https://www.komatsu.com/en-us/products/equipment/dozers",
    "https://www.komatsu.com/en-us/products/equipment/dozers/large-dozers",
    "https://www.komatsu.com/en-us/products/equipment/dozers/mid-size-dozers",
    "https://www.komatsu.com/en-us/products/equipment/dozers/small-dozers",
    "https://www.komatsu.com/en-us/products/equipment/dozers/surface-mining-dozers",
    "https://www.komatsu.com/en-us/products/equipment/excavators",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators",
    "https://www.komatsu.com/en-us/products/equipment/excavators/small-excavators",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-hauler",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-scoops",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/flexible-conveyor-train",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/shuttle-cars",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/underground-loader",
    "https://www.komatsu.com/en-us/services-and-support/equipment-monitoring-and-analysis/telematics"
  ],
  "blocks": [
    {
      "name": "hero-split",
      "instances": [
        "div.breadcrumb + div.splitcontentcomponent"
      ]
    },
    {
      "name": "cards-tiles",
      "instances": [
        "div.columncontainer.column-horizontal-center .buttongroup .cmp-container",
        ".tilescolorblocks.tilesmall .tiles_color_blocks"
      ]
    },
    {
      "name": "hero-banner",
      "instances": [
        "div.herocomponent.dark_gradient_overlay"
      ]
    },
    {
      "name": "cards-product",
      "instances": [
        ".equipmentlisting .cmp-equipmentlisting"
      ]
    },
    {
      "name": "columns-media",
      "instances": [
        ".columncontainer-main > .aem-Grid > .splitcontentcomponent"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Split hero (eyebrow, H1, intro | photo)",
      "selector": [
        "div.breadcrumb + div.splitcontentcomponent"
      ],
      "style": null,
      "blocks": [
        "hero-split"
      ],
      "defaultContent": []
    },
    {
      "id": "2",
      "name": "Category chips",
      "selector": [
        "div.columncontainer.column-horizontal-center"
      ],
      "style": null,
      "blocks": [
        "cards-tiles"
      ],
      "defaultContent": []
    },
    {
      "id": "3",
      "name": "Photo banner (future of excavation)",
      "selector": [
        "div.herocomponent.dark_gradient_overlay"
      ],
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "4",
      "name": "Product listing (filters + grid)",
      "selector": [
        "div.columncontainer:has(.equipmentlisting)"
      ],
      "style": null,
      "blocks": [
        "cards-product"
      ],
      "defaultContent": []
    },
    {
      "id": "5",
      "name": "Industries we support",
      "selector": [
        "div.columncontainer:has(> .columncontainer-main > .aem-Grid > .splitcontentcomponent)"
      ],
      "style": "grey",
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "6",
      "name": "Find what works for you (link tiles)",
      "selector": [
        "div.columncontainer.margin-bottom--large"
      ],
      "style": "grey",
      "blocks": [
        "cards-tiles"
      ],
      "defaultContent": [
        ".tilescolorblocks.tilesmall > p.tile-title"
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
