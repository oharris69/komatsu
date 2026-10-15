/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductParser from './parsers/hero-product.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsTilesParser from './parsers/cards-tiles.js';
import columnsResourcesParser from './parsers/columns-resources.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import tableSpecsParser from './parsers/table-specs.js';
import tabsTechnologyParser from './parsers/tabs-technology.js';
import columnsMediaParser from './parsers/columns-media.js';
import carouselGalleryParser from './parsers/carousel-gallery.js';
import cardsProductParser from './parsers/cards-product.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/komatsu-cleanup.js';
import sectionsTransformer from './transformers/komatsu-sections.js';
import dmImagesTransformer from './transformers/komatsu-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-product': heroProductParser,
  'hero-banner': heroBannerParser,
  'cards-tiles': cardsTilesParser,
  'columns-resources': columnsResourcesParser,
  'cards-feature': cardsFeatureParser,
  'table-specs': tableSpecsParser,
  'tabs-technology': tabsTechnologyParser,
  'columns-media': columnsMediaParser,
  'carousel-gallery': carouselGalleryParser,
  'cards-product': cardsProductParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (equipment-model-detail, Run 7)
// The 360 viewer (div.webrotate360, excluded[]) is removed by komatsu-cleanup (gated on this template name).
const PAGE_TEMPLATE = {
  "name": "equipment-model-detail",
  "description": "Equipment model detail with image gallery and key specs header, quote CTAs, overview with resources rail, features grid, specifications accordion and related products",
  "urls": [
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d37px-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d37ex-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d39ex-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d39exi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d39px-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d39pxi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d51ex-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d51exi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d51px-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d51pxi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d61ex-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d61exi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d61px-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d155axi-8",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d61pxi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65ex-18",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d375a-8",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65ex-18-wh",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d475a-8",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65exi-18",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65px-18",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65px-18-wh",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65pxi-18",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65wx-18",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d65wx-18-wh",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71ex-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71exi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71px-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71pxi-24",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d85ex-18",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d85ex-18-wh",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d85px-18",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d85px-18-wh",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d155ax-8",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d155ax-8-wh",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d155cx-8-k170",
    "https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d155px-8-lgp",
    "https://www.komatsu.com/en-us/products/attachments/hydraulic-breakers/jmhb-h",
    "https://www.komatsu.com/en-us/products/attachments/hydraulic-breakers/jmhb-v",
    "https://www.komatsu.com/en-us/products/equipment/blasthole-drills/rotary-drill/320xpc",
    "https://www.komatsu.com/en-us/products/equipment/blasthole-drills/rotary-drill/zr122",
    "https://www.komatsu.com/en-us/products/equipment/blasthole-drills/rotary-drill/zr77",
    "https://www.komatsu.com/en-us/products/equipment/blasthole-drills/track-drill/zt44",
    "https://www.komatsu.com/en-us/products/equipment/crushing/joy-underground-feeder-breakers/ufb-14",
    "https://www.komatsu.com/en-us/products/equipment/crushing/joy-underground-feeder-breakers/ufb-14s",
    "https://www.komatsu.com/en-us/products/equipment/crushing/joy-underground-feeder-breakers/ufb-33",
    "https://www.komatsu.com/en-us/products/equipment/crushing/reclaim-feeders/rf-27-rf-31-rf-40",
    "https://www.komatsu.com/en-us/products/equipment/crushing/reclaim-feeders/stamler-rf-5",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/drx-1000",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/drx-800",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/hrx-1000",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/hrx-800",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/ixrs-600",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/mvt-ii-600",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/mvt-ii-800",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/xrs-600",
    "https://www.komatsu.com/en-us/products/equipment/crushing/sizers/xrs-800",
    "https://www.komatsu.com/en-us/products/equipment/crushing/surface-feeder-breakers/sfb-29",
    "https://www.komatsu.com/en-us/products/equipment/crushing/surface-feeder-breakers/sfb-31",
    "https://www.komatsu.com/en-us/products/equipment/crushing/surface-feeder-breakers/sfb-38",
    "https://www.komatsu.com/en-us/products/equipment/crushing/surface-feeder-breakers/sfb-40",
    "https://www.komatsu.com/en-us/products/equipment/crushing/surface-feeder-breakers/sfb-43",
    "https://www.komatsu.com/en-us/products/equipment/entry-development/entry-drivers/14ed25",
    "https://www.komatsu.com/en-us/products/equipment/entry-development/miner-bolter/14cm09-16bdx",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc1250lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc1250lc-11-mh",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc1250sp-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc360lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc360lc-11-slf",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc360lc-11-wh",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc360lci-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc365lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc390lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc390lc-11-mh",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc390lc-11-slf",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc390lc-11-wh",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc390lci-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc490lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc490lc-11-mh",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc490lc-11-slf",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc490lci-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc650lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc650lc-11-mh",
    "https://www.komatsu.com/en-us/products/equipment/excavators/large-excavators/pc900lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/PC220LC-12",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc130lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc138uslc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc170lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc220lci-12",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc238uslc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc240lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc240lc-11-slf",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc290lc-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc290lc-11-demolition",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc290lc-11-slf",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc290lci-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc360lc-11-demolition",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc490hrd-11-demolition",
    "https://www.komatsu.com/en-us/products/equipment/excavators/mid-size-excavators/pc490lc-11-demolition",
    "https://www.komatsu.com/en-us/products/equipment/excavators/small-excavators/pc30mr-5-e1",
    "https://www.komatsu.com/en-us/products/equipment/excavators/small-excavators/pc35mr-5-e1",
    "https://www.komatsu.com/en-us/products/equipment/excavators/small-excavators/pc45mr-5",
    "https://www.komatsu.com/en-us/products/equipment/excavators/small-excavators/pc55mr-5",
    "https://www.komatsu.com/en-us/products/equipment/excavators/small-excavators/pc78us-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/small-excavators/pc88mr-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators/pc2000-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators/pc3000-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators/pc4000-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators/pc5500-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators/pc7000-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators/pc8000-11",
    "https://www.komatsu.com/en-us/products/equipment/excavators/surface-mining-excavators/pc9000-12",
    "https://www.komatsu.com/en-us/products/equipment/forestry/forwarders/845-1",
    "https://www.komatsu.com/en-us/products/equipment/forestry/forwarders/855-3",
    "https://www.komatsu.com/en-us/products/equipment/forestry/forwarders/875-1",
    "https://www.komatsu.com/en-us/products/equipment/forestry/forwarders/895-2",
    "https://www.komatsu.com/en-us/products/equipment/forestry/harvester-heads/c124",
    "https://www.komatsu.com/en-us/products/equipment/forestry/harvester-heads/c144",
    "https://www.komatsu.com/en-us/products/equipment/forestry/harvester-heads/c93",
    "https://www.komatsu.com/en-us/products/equipment/forestry/harvester-heads/s132",
    "https://www.komatsu.com/en-us/products/equipment/forestry/harvester-heads/s172",
    "https://www.komatsu.com/en-us/products/equipment/forestry/harvester-heads/s92",
    "https://www.komatsu.com/en-us/products/equipment/forestry/swing-machines/pc230f-11",
    "https://www.komatsu.com/en-us/products/equipment/forestry/swing-machines/pc290ll-11",
    "https://www.komatsu.com/en-us/products/equipment/forestry/swing-machines/tn230d",
    "https://www.komatsu.com/en-us/products/equipment/forestry/swing-machines/tn785d",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tl725d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tl735d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tl745d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tl755d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tl755d-west-coast-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tn725d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tn735d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tn745d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-feller-bunchers/tn755d-feller-buncher",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tl725d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tl735d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tl745d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tl755d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tl755d-west-coast-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tn725d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tn735d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tn745d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/tracked-harvesters/tn755d-harvester",
    "https://www.komatsu.com/en-us/products/equipment/forestry/wheeled-harvesters/901xc-6",
    "https://www.komatsu.com/en-us/products/equipment/forestry/wheeled-harvesters/931-3",
    "https://www.komatsu.com/en-us/products/equipment/forestry/wheeled-harvesters/951-1",
    "https://www.komatsu.com/en-us/products/equipment/forestry/wheeled-harvesters/951xc-1",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/ae50-fb15u-12",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/ae50-fb18u-12",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/ae50-fb20au-12",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/am50-fb15mu-12",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/am50-fb18mu-12",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/am50-fb20mu-12",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/fb20shgu-6",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/fb20shu-6",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/fb25shgu-6",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/fb25shu-6",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/fb30shu-6",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/electric/fb32shu-6",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-cushion/fg20st-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-cushion/fg25sht-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-cushion/fg25st-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-cushion/fg30sht-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-cushion/fg32sht-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg15htu-20",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg18htu-20",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg20t-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg25HT-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg25ht-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg25t-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg30ht-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg32ht-16",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg40tu-10",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg40ztu-10",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg45tu-10",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fg50atu-10",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh100-1",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh120-1",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh135-1",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh160-1",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh35-2",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh40-2",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh45-2",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh50-2",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh70-2",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/ic-pneumatic/fh80-2",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/narrow-aisle/fr15k-3",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/narrow-aisle/fr18k-3",
    "https://www.komatsu.com/en-us/products/equipment/forklifts/narrow-aisle/fr23k-3",
    "https://www.komatsu.com/en-us/products/equipment/industrial-minerals-equipment/scalers/wp08",
    "https://www.komatsu.com/en-us/products/equipment/industrial-minerals-equipment/tethered-electric-lhd/wx14lpe",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/automation-and-transfer-systems/full-line-integration-and-quality-assurance",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/automation-and-transfer-systems/process-integration",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/can-sealing-welding-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/copy-current-collector-plate-bending-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/current-collector-plate-bending-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/current-collector-plate-bending-equipment0",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/electrode-body-high-pressure-press-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/il110",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/lid-caulking-and-welding-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/module-assembly-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/battery-manufacturing-related-equipment/tab-forming-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-and-camshaft-measuring-instruments/dd200",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-and-camshaft-measuring-instruments/dd300",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-and-camshaft-measuring-instruments/gdb080v-2",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-and-camshaft-measuring-instruments/gdb120v-2",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-and-camshaft-measuring-instruments/gdb200v-2",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm1100",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm150",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm1600",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm170",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm190",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm2000",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm240",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpm320",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpr250",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/crankshaft-processing-machines/gpr300",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/friction-stir-welding-(fsw)-machine/2d-fsw",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/friction-stir-welding-(fsw)-machine/stationary-type-swing-fsw",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/grinding-machines/ntg-cks1-90600",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/grinding-machines/ntg-cks2-50320",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/automatic-needle-caulking-machine",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/flat-wire-welding-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/floating-seal-inspection",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/glitter-inspection-machine",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/headlight-focusing-device",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/headlight-focusing-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/knitting-defect-inspection-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/lcd-glass-substrate-inspection-system",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/lead-assembly-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/led-inspection-equipment",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/li-ion-battery-electrode-plate-inspection",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/piston-rod-inspection",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/image-processing-equipment/plain-web-inspection-system",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/machining-centers/kh440",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/wafer-manufacturing-equipment/gcg300",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/wafer-manufacturing-equipment/mwm11411",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/wafer-manufacturing-equipment/mwm15413",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/wafer-manufacturing-equipment/mwm3050nq",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/wafer-manufacturing-equipment/mwm442dm",
    "https://www.komatsu.com/en-us/products/equipment/machine-tools/wafer-manufacturing-equipment/nd660",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-hauler/bh10",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-hauler/bh18",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-hauler/bh20",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-scoops/02esv36",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-scoops/02esv56",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/battery-scoops/02esv60",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/12cm12",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/12cm15",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/12hm-series",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm09cc",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm10",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm15",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm15b",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm15c",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm15cc",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm15d",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm15e",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm27",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/continuous-miners/14cm9a",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/flexible-conveyor-train/4fct",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/shuttle-cars/10sc32-series",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/shuttle-cars/21sc04",
    "https://www.komatsu.com/en-us/products/equipment/room-and-pillar/underground-loader/14bu27",
    "https://www.komatsu.com/en-us/products/equipment/shaft-sinking-equipment/shaft-jumbo/zs02",
    "https://www.komatsu.com/en-us/products/equipment/shaft-sinking-equipment/shaft-mucker/zm01",
    "https://www.komatsu.com/en-us/products/equipment/trucks/articulated-trucks/hm300-5",
    "https://www.komatsu.com/en-us/products/equipment/trucks/articulated-trucks/hm400-5",
    "https://www.komatsu.com/en-us/products/equipment/trucks/articulated-trucks/hm460-6",
    "https://www.komatsu.com/en-us/products/equipment/trucks/electric-drive-mining-trucks/730e-10",
    "https://www.komatsu.com/en-us/products/equipment/trucks/electric-drive-mining-trucks/830e-5",
    "https://www.komatsu.com/en-us/products/equipment/trucks/electric-drive-mining-trucks/860e-1k",
    "https://www.komatsu.com/en-us/products/equipment/trucks/electric-drive-mining-trucks/930e-5",
    "https://www.komatsu.com/en-us/products/equipment/trucks/electric-drive-mining-trucks/930e-5se",
    "https://www.komatsu.com/en-us/products/equipment/trucks/electric-drive-mining-trucks/980e-5",
    "https://www.komatsu.com/en-us/products/equipment/trucks/electric-drive-mining-trucks/980e-5se",
    "https://www.komatsu.com/en-us/products/equipment/trucks/mechanical-trucks/hd1500-8e0",
    "https://www.komatsu.com/en-us/products/equipment/trucks/mechanical-trucks/hd325-8",
    "https://www.komatsu.com/en-us/products/equipment/trucks/mechanical-trucks/hd405-8",
    "https://www.komatsu.com/en-us/products/equipment/trucks/mechanical-trucks/hd465-10",
    "https://www.komatsu.com/en-us/products/equipment/trucks/mechanical-trucks/hd605-10",
    "https://www.komatsu.com/en-us/products/equipment/trucks/mechanical-trucks/hd785-8",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/lhd/wx03",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/lhd/wx04",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/lhd/wx04b",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/lhd/wx07",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/lhd/wx11",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/lhd/wx15",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/underground-mining-trucks/hx07",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/underground-mining-trucks/hx16",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/underground-mining-trucks/hx20",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/underground-mining-trucks/hx30",
    "https://www.komatsu.com/en-us/products/equipment/underground-hard-rock-haulage/underground-mining-trucks/hx45",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa380-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa380-8-wh",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa475-11",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa485-11",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa500-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa500-8-wh",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa500-8-yard-loader",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/large-wheel-loaders/wa600-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/mid-size-wheel-loaders/wa200-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/mid-size-wheel-loaders/wa200-8-wh",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/mid-size-wheel-loaders/wa270-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/mid-size-wheel-loaders/wa270-8-wh",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/mid-size-wheel-loaders/wa320-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/mid-size-wheel-loaders/wa320-8-wh",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/surface-mining-wheel-loaders/wa700-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/surface-mining-wheel-loaders/wa800-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/surface-mining-wheel-loaders/wa900-8",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/surface-mining-wheel-loaders/we1350",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/surface-mining-wheel-loaders/we1850",
    "https://www.komatsu.com/en-us/products/equipment/wheel-loaders/surface-mining-wheel-loaders/we2350"
  ],
  "blocks": [
    {
      "name": "hero-product",
      "instances": [
        ".equipmentdetail .equipment-details"
      ]
    },
    {
      "name": "hero-banner",
      "instances": [
        ".experiencefragment .herocomponent"
      ]
    },
    {
      "name": "cards-tiles",
      "instances": [
        ".anchorlink .anchor-links",
        ".tilescolorblocks.tilesmall .tiles_color_blocks"
      ]
    },
    {
      "name": "columns-resources",
      "instances": [
        ".machineresources .cmp-machineresources"
      ]
    },
    {
      "name": "cards-feature",
      "instances": [
        ".featuresandbenefits .features-and-benefits",
        ".cardscontainer .cards-container"
      ]
    },
    {
      "name": "table-specs",
      "instances": [
        ".machinespecs .cmp-machinespecs"
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
        ".splitcontentcomponent .split_content_module--area"
      ]
    },
    {
      "name": "carousel-gallery",
      "instances": [
        ".carousel.panelcontainer .cmp-carousel"
      ]
    },
    {
      "name": "cards-product",
      "instances": [
        ".relatedproducts"
      ]
    }
  ],
  "sections": [
    {
      "id": "1",
      "name": "Product header (gallery, quick specs, purchase options)",
      "selector": [
        "div.equipmentdetail"
      ],
      "style": "white-container",
      "blocks": [
        "hero-product"
      ],
      "defaultContent": []
    },
    {
      "id": "2",
      "name": "Promo banner (experience fragment)",
      "selector": [
        "div.experiencefragment:has(.herocomponent)"
      ],
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "3",
      "name": "Anchor links",
      "selector": [
        "div.anchorlink"
      ],
      "style": "white-container",
      "blocks": [
        "cards-tiles"
      ],
      "defaultContent": []
    },
    {
      "id": "4",
      "name": "Overview + resources rail",
      "selector": [
        "div.machineresources"
      ],
      "style": "white-container",
      "blocks": [
        "columns-resources"
      ],
      "defaultContent": []
    },
    {
      "id": "5",
      "name": "Features and benefits",
      "selector": [
        "div.featuresandbenefits"
      ],
      "style": "white-container",
      "blocks": [
        "cards-feature"
      ],
      "defaultContent": [
        ".features-and-benefits > h2"
      ]
    },
    {
      "id": "6",
      "name": "Specifications",
      "selector": [
        "div.machinespecs"
      ],
      "style": "white-container",
      "blocks": [
        "table-specs"
      ],
      "defaultContent": [
        ".cmp-machinespecs h3:first-of-type"
      ]
    },
    {
      "id": "7",
      "name": "Support you can count on (outlined cards)",
      "selector": [
        "div.cardscontainer"
      ],
      "style": "white-container",
      "blocks": [
        "cards-feature"
      ],
      "defaultContent": [
        ".cards-container > h2"
      ]
    },
    {
      "id": "8",
      "name": "Technology tabs",
      "selector": [
        "div.tabs.panelcontainer"
      ],
      "style": "white-container",
      "blocks": [
        "tabs-technology"
      ],
      "defaultContent": [
        ".tabs.panelcontainer h3:first-of-type"
      ]
    },
    {
      "id": "9",
      "name": "Infographic",
      "selector": [
        "div.columncontainer:has(> .columncontainer-main > .aem-Grid > .image)"
      ],
      "style": "white-container",
      "blocks": [],
      "defaultContent": [
        ".columncontainer-title",
        ".image .cmp-image"
      ]
    },
    {
      "id": "10",
      "name": "Split promo with video (IMC 2.0)",
      "selector": [
        "div.splitcontentcomponent"
      ],
      "style": "grey",
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "11",
      "name": "Videos carousel",
      "selector": [
        "div.carousel.panelcontainer"
      ],
      "style": "white-container",
      "blocks": [
        "carousel-gallery"
      ],
      "defaultContent": [
        ".carousel-header .carousel-title"
      ]
    },
    {
      "id": "12",
      "name": "Related products",
      "selector": [
        "div.relatedproducts"
      ],
      "style": "white-container",
      "blocks": [
        "cards-product"
      ],
      "defaultContent": [
        ".related-products > h2"
      ]
    },
    {
      "id": "13",
      "name": "Find what works for you (solid tiles)",
      "selector": [
        "div.tilescolorblocks.tilesmall"
      ],
      "style": "grey",
      "blocks": [
        "cards-tiles"
      ],
      "defaultContent": [
        ".tilescolorblocks.tilesmall > p.tile-title"
      ]
    }
  ],
  "excluded": [
    {
      "selector": "div.webrotate360",
      "reason": "360 viewer (1 of 37 dozer pages); dropped with its #360 anchor link"
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
