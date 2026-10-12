/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsArticleRailParser from './parsers/columns-article-rail.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/komatsu-cleanup.js';
import sectionsTransformer from './transformers/komatsu-sections.js';
import dmImagesTransformer from './transformers/komatsu-dm-images.js';
import articleMetadataTransformer from './transformers/komatsu-article-metadata.js';

// PARSER REGISTRY
const parsers = {
  'columns-article-rail': columnsArticleRailParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  "name": "article",
  "description": "Article layout with left meta/share rail, headline, lead image, rich-text body and related-articles card row; also absorbs some category and landing pages",
  "urls": [
    "https://www.komatsu.com/en-us/newsroom/2026/komatsu-newberry-facility-celebrates-25-years"
  ],
  "blocks": [
    {
      "name": "columns-article-rail",
      "instances": [
        "#articleLeft .articledetail_contents"
      ]
    },
    {
      "name": "cards-news",
      "instances": [
        "div.relatedarticle div.limit > div.grid"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Breadcrumb (not authored)",
      "selector": [
        "div.breadcrumb"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    },
    {
      "id": "2",
      "name": "Article",
      "selector": [
        ".article__details-container"
      ],
      "style": "article",
      "blocks": [
        "columns-article-rail"
      ],
      "defaultContent": [
        "#articleRight > div.articleheader",
        "#articleRight > div.textcontent.text > div.cmp-text"
      ]
    },
    {
      "id": "3",
      "name": "Related articles",
      "selector": [
        "div.container:has(> .cmp-container div.relatedarticle):not(:has(.article__details-container))",
        "div.relatedarticle"
      ],
      "style": "grey",
      "blocks": [
        "cards-news"
      ],
      "defaultContent": [
        "div.relatedarticle div.limit > h2"
      ]
    }
  ]
};

// TRANSFORMER REGISTRY
// Order: cleanup, article page metadata (beforeTransform), then section breaks/metadata (needs 2+ sections), then DM/Scene7 images (afterTransform only)
const transformers = [
  cleanupTransformer,
  articleMetadataTransformer,
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
    // Metadata block incl. article fields (publication-date, tags, read-time, template)
    articleMetadataTransformer.createMetadataWithArticleFields(main, document);
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
