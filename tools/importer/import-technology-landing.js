/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSplitParser from './parsers/hero-split.js';
import tabsTechnologyParser from './parsers/tabs-technology.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsTilesParser from './parsers/cards-tiles.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/komatsu-cleanup.js';
import sectionsTransformer from './transformers/komatsu-sections.js';
import dmImagesTransformer from './transformers/komatsu-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-split': heroSplitParser,
  'tabs-technology': tabsTechnologyParser,
  'columns-media': columnsMediaParser,
  'cards-feature': cardsFeatureParser,
  'cards-tiles': cardsTilesParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "technology-landing",
  "description": "Technology landing with split hero, tabbed solutions, alternating media-text rows, support cards, solution tile grid and CTA banner",
  "urls": [
    "https://www.komatsu.com/en-us/technology/smart-construction",
    "https://www.komatsu.com/en-us/technology/smart-quarry"
  ],
  "blocks": [
    {
      "name": "hero-split",
      "instances": [
        "div.breadcrumb + div.splitcontentcomponent"
      ]
    },
    {
      "name": "tabs-technology",
      "instances": [
        ".tabs.panelcontainer .cmp-tabs"
      ]
    },
    {
      "name": "columns-media",
      "instances": [
        ".columncontainer-main > .aem-Grid > .splitcontentcomponent"
      ]
    },
    {
      "name": "cards-feature",
      "instances": [
        ".cardscontainer .cards-container .cards-row"
      ]
    },
    {
      "name": "cards-tiles",
      "instances": [
        ".tilescolorblocks.tilesmall .tiles_color_blocks"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Split hero (H1 + intro | video)",
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
      "name": "Solutions tabs",
      "selector": [
        ".columncontainer .tabs.panelcontainer"
      ],
      "style": "grey",
      "blocks": [
        "tabs-technology"
      ],
      "defaultContent": [
        ".cmp-tabs > div:first-child > h3"
      ]
    },
    {
      "id": "3",
      "name": "Alternating media/text rows",
      "selector": [
        ".columncontainer-main > .aem-Grid > .splitcontentcomponent"
      ],
      "style": "grey",
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "4",
      "name": "Customer support cards",
      "selector": [
        ".columncontainer .cardscontainer"
      ],
      "style": "grey",
      "blocks": [
        "cards-feature"
      ],
      "defaultContent": [
        ".cardscontainer .cards-container > h2"
      ]
    },
    {
      "id": "5",
      "name": "Solution link tiles (resources fragment)",
      "selector": [
        "div.columncontainer.pdding-top--large"
      ],
      "style": "grey",
      "blocks": [
        "cards-tiles"
      ],
      "defaultContent": [
        ".tilescolorblocks.tilesmall > p.tile-title"
      ]
    },
    {
      "id": "6",
      "name": "CTA banner",
      "selector": [
        "div.herocomponent.blue_bg"
      ],
      "style": "brand-blue",
      "blocks": [],
      "defaultContent": [
        "div.herocomponent.blue_bg .hero-field > h2",
        "div.herocomponent.blue_bg .hero-field a.cmp-button"
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
