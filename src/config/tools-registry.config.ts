import type { ToolHubEntry } from '../types';

/**
 * The Tool Hub registry — one list, one search, no duplicates.
 *
 * `built`    → real page in this app (`route`).
 * `external` → a genuinely ad-free tool elsewhere (`url`), `source` says where:
 *              'delphi' = tools.rmv.fyi (indie, ad-free), 'oss' = a real open-source
 *              project's own hosted instance (Stirling-PDF) or an unavoidable
 *              proprietary exception (Pantone — no open alternative exists).
 * `backlog`  → not built anywhere yet. `effort` (1=trivial..5=very hard) ranks it.
 *
 * When a `built` tool has an equivalent on Delphi, that's `altUrl` on the SAME
 * entry — not a second entry. One tool, one card, no duplicate search results.
 */

const DELPHI = 'https://tools.rmv.fyi';
const STIRLING = 'https://stirlingpdf.io';

export const toolsRegistry: ToolHubEntry[] = [
  // ── Built here (11) ──────────────────────────────────────────────────
  {
    id: 'compress',
    name: 'Image Compressor',
    description: 'Shrink and convert JPG/PNG/WebP/AVIF file size with a quality slider.',
    category: 'Image',
    status: 'built',
    route: '/tools/compress',
    altUrl: `${DELPHI}/tools/image-converter`,
    altLabel: 'Also on Delphi',
    keywords: ['compress image', 'convert image', 'shrink photo', 'webp', 'reduce file size'],
  },
  {
    id: 'batch-resize',
    name: 'Batch Image Resizer',
    description: 'Resize and compress multiple images to a fixed dimension in one pass.',
    category: 'Image',
    status: 'built',
    route: '/tools/batch-resize',
    keywords: ['resize images', 'bulk resize', 'batch'],
  },
  {
    id: 'vectorize',
    name: 'Raster to Printable SVG',
    description: 'Trace a logo or line art from raster into clean vector SVG.',
    category: 'SVG & Vector',
    status: 'built',
    route: '/tools/vectorize',
    altUrl: `${DELPHI}/tools/image-tracer`,
    altLabel: 'Also on Delphi',
    keywords: ['vectorize', 'trace logo', 'raster to svg'],
  },
  {
    id: 'palette',
    name: 'Palette Extractor',
    description: 'Pull brand swatches from a moodboard or photo.',
    category: 'Colour',
    status: 'built',
    route: '/tools/palette',
    altUrl: `${DELPHI}/tools/palette-extractor`,
    altLabel: 'Also on Delphi',
    keywords: ['colour palette', 'extract colours', 'swatches'],
  },
  {
    id: 'contrast',
    name: 'Contrast/WCAG Checker',
    description: 'Check a text/background colour pair against WCAG AA/AAA.',
    category: 'Colour',
    status: 'built',
    route: '/tools/contrast',
    altUrl: `${DELPHI}/tools/contrast-checker`,
    altLabel: 'Also on Delphi',
    keywords: ['accessibility', 'contrast ratio', 'wcag'],
  },
  {
    id: 'cmyk',
    name: 'CMYK ↔ RGB Converter',
    description: 'Convert colour values between CMYK and RGB for print vs. screen.',
    category: 'Colour',
    status: 'built',
    route: '/tools/cmyk',
    altUrl: `${DELPHI}/tools/colour-converter`,
    altLabel: 'Also on Delphi',
    keywords: ['cmyk to rgb', 'print colour', 'colour conversion'],
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate a QR code from any text or URL.',
    category: 'Barcode & QR',
    status: 'built',
    route: '/tools/codes',
    altUrl: `${DELPHI}/tools/qr-genny`,
    altLabel: 'Also on Delphi',
    keywords: ['qr code', 'make qr', 'generate qr'],
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    description: 'Generate EAN-13, UPC-A or Code 128 retail barcodes.',
    category: 'Barcode & QR',
    status: 'built',
    route: '/tools/codes',
    altUrl: `${DELPHI}/tools/code-genny`,
    altLabel: 'Also on Delphi',
    keywords: ['make barcode', 'generate barcode', 'ean', 'upc'],
  },
  {
    id: 'gs1-validator',
    name: 'GS1/EAN Validator',
    description: 'Validate a GS1/EAN barcode digit string and its check digit.',
    category: 'Barcode & QR',
    status: 'built',
    route: '/tools/gs1',
    keywords: ['gs1', 'ean validator', 'check digit', 'barcode validator'],
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'lower, UPPER, Title, camelCase, snake_case & more.',
    category: 'Typography & Text',
    status: 'built',
    route: '/tools/case',
    keywords: ['text case', 'camelcase', 'snake_case', 'title case'],
  },
  {
    id: 'bleed-calculator',
    name: 'Dieline/Bleed Calculator',
    description: 'Trim, bleed and safe-area size for a packaging dieline, plus mm→px at 150/300/600 DPI.',
    category: 'Packaging',
    status: 'built',
    route: '/tools/bleed',
    keywords: ['bleed calculator', 'calculate 3mm bleed', 'dieline', 'trim size', 'mm to px', 'dpi'],
  },

  // ── External · Delphi (tools.rmv.fyi, ad-free) ───────────────────────
  { id: 'd-palette-genny', name: 'Palette Generator', description: 'Generate a fresh colour palette from scratch.', category: 'Colour', status: 'external', source: 'delphi', url: `${DELPHI}/tools/palette-genny` },
  { id: 'd-background-remover', name: 'Background Remover', description: 'Cut a subject out of a photo onto a transparent background.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/background-remover`, keywords: ['remove background', 'transparent png', 'cutout'] },
  { id: 'd-matte-generator', name: 'Matte Generator', description: 'Add a coloured matte/border around social images.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/matte-generator` },
  { id: 'd-scroll-generator', name: 'Seamless Scroll Generator', description: 'Build a seamless scrolling image loop for social.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/scroll-generator` },
  { id: 'd-social-cropper', name: 'Social Media Cropper', description: 'Crop images to Instagram/LinkedIn/Amazon aspect ratios.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/social-cropper`, keywords: ['crop 1:1', 'crop 4:5', 'aspect ratio'] },
  { id: 'd-watermarker', name: 'Watermarker', description: 'Stamp a watermark logo/text across an image.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/watermarker` },
  { id: 'd-colorblind-sim', name: 'Colour Blindness Simulator', description: 'Preview a design under common colour-vision deficiencies.', category: 'Colour', status: 'external', source: 'delphi', url: `${DELPHI}/tools/colorblind-sim` },
  { id: 'd-gradient-genny', name: 'Gradient Generator', description: 'Build CSS/brand gradients between colour stops.', category: 'Colour', status: 'external', source: 'delphi', url: `${DELPHI}/tools/gradient-genny` },
  { id: 'd-harmony-genny', name: 'Harmony Generator', description: 'Generate complementary/triadic/analogous colour harmonies.', category: 'Colour', status: 'external', source: 'delphi', url: `${DELPHI}/tools/harmony-genny` },
  { id: 'd-palette-collection', name: 'Palette Collection', description: 'Browse a library of curated colour palettes.', category: 'Colour', status: 'external', source: 'delphi', url: `${DELPHI}/tools/palette-collection` },
  { id: 'd-pixel-picker', name: 'Pixel Picker', description: 'Pick the exact colour of any pixel in an image.', category: 'Colour', status: 'external', source: 'delphi', url: `${DELPHI}/tools/pixel-picker`, keywords: ['eyedropper', 'colour picker'] },
  { id: 'd-tailwind-shades', name: 'Tailwind Shade Generator', description: 'Generate a full Tailwind-style 50–950 shade ramp from one colour.', category: 'Colour', status: 'external', source: 'delphi', url: `${DELPHI}/tools/tailwind-shades`, keywords: ['tints', 'shades', 'colour scale'] },
  { id: 'd-artwork-enhancer', name: 'Artwork Enhancer', description: 'Sharpen/enhance artwork before export.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/artwork-enhancer` },
  { id: 'd-favicon-genny', name: 'Favicon Generator', description: 'Generate a favicon set from a source logo.', category: 'SVG & Vector', status: 'external', source: 'delphi', url: `${DELPHI}/tools/favicon-genny`, keywords: ['favicon', 'app icon'] },
  { id: 'd-image-clipper', name: 'Image Clipper', description: 'Clip an image to a custom shape or mask.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/image-clipper` },
  { id: 'd-image-converter', name: 'Image Converter', description: 'Convert between image formats.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/image-converter` },
  { id: 'd-image-splitter', name: 'Image Splitter', description: 'Split one image into a grid of tiles (e.g. Instagram carousels).', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/image-splitter` },
  { id: 'd-paste-image', name: 'Paste Image', description: 'Paste an image straight from the clipboard for quick edits.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/paste-image` },
  { id: 'd-placeholder-genny', name: 'Placeholder Generator', description: 'Generate placeholder images at any size for mockups.', category: 'Image', status: 'external', source: 'delphi', url: `${DELPHI}/tools/placeholder-genny` },
  { id: 'd-svg-optimiser', name: 'SVG Optimiser', description: 'Strip metadata and shrink SVG file size for web/print.', category: 'SVG & Vector', status: 'external', source: 'delphi', url: `${DELPHI}/tools/svg-optimiser`, keywords: ['optimize svg', 'minify svg', 'svgo'] },
  { id: 'd-base64-image', name: 'Base64 Image Encoder', description: 'Encode/decode an image as a base64 data URI.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/base64-image-encoder` },
  { id: 'd-doc-converter', name: 'Document Converter', description: 'Convert between common document formats.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/doc-converter` },
  { id: 'd-text-editor', name: 'Text Editor', description: 'A quick plain-text scratch editor in the browser.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/text-editor` },
  { id: 'd-font-explorer', name: 'Font File Explorer', description: 'Inspect a font file — glyphs, metrics, embedded metadata.', category: 'Typography & Text', status: 'external', source: 'delphi', url: `${DELPHI}/tools/font-explorer` },
  { id: 'd-glyph-browser', name: 'Glyph Browser', description: 'Browse all glyphs available in a font.', category: 'Typography & Text', status: 'external', source: 'delphi', url: `${DELPHI}/tools/glyph-browser` },
  { id: 'd-line-height-calc', name: 'Line Height Calculator', description: 'Calculate a comfortable line-height for a given font size.', category: 'Typography & Text', status: 'external', source: 'delphi', url: `${DELPHI}/tools/line-height-calc` },
  { id: 'd-paper-sizes', name: 'Paper Sizes', description: 'Reference for A-series, US and print sheet paper sizes.', category: 'Typography & Text', status: 'external', source: 'delphi', url: `${DELPHI}/tools/paper-sizes` },
  { id: 'd-px-to-rem', name: 'PX to REM', description: 'Convert pixel values to rem (and back) for responsive CSS.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/px-to-rem` },
  { id: 'd-text-diff', name: 'Text Diff', description: 'Compare two blocks of text and highlight the differences.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/text-diff` },
  { id: 'd-typo-calc', name: 'Typography Calculator', description: 'Calculate a fluid/modular type scale for a design system.', category: 'Typography & Text', status: 'external', source: 'delphi', url: `${DELPHI}/tools/typo-calc`, keywords: ['type scale', 'fluid type', 'modular scale'] },
  { id: 'd-word-counter', name: 'Word Counter', description: 'Count words, characters and reading time in a block of text.', category: 'Typography & Text', status: 'external', source: 'delphi', url: `${DELPHI}/tools/word-counter`, keywords: ['character count', 'word count'] },
  { id: 'd-pdf-preflight', name: 'PDF Preflight', description: 'Check a PDF for print-readiness before sending to press.', category: 'PDF & Print', status: 'external', source: 'delphi', url: `${DELPHI}/tools/pdf-preflight`, keywords: ['preflight', 'print ready pdf'] },
  { id: 'd-imposer', name: 'Print Imposer', description: 'Arrange pages into a print-ready imposition layout.', category: 'PDF & Print', status: 'external', source: 'delphi', url: `${DELPHI}/tools/imposer` },
  { id: 'd-zine-imposer', name: 'Zine Imposer', description: 'Lay out pages for a fold-and-cut zine booklet.', category: 'PDF & Print', status: 'external', source: 'delphi', url: `${DELPHI}/tools/zine-imposer` },
  { id: 'd-decoder', name: 'Cipher Decoder', description: 'Decode common text ciphers.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/decoder` },
  { id: 'd-meta-tag-genny', name: 'Meta Tag Generator', description: 'Generate SEO/OG/Twitter meta tags for a web page.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/meta-tag-genny` },
  { id: 'd-regex-tester', name: 'Regex Tester', description: 'Test a regular expression against sample text live.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/regex-tester`, keywords: ['regex', 'regular expression'] },
  { id: 'd-tailwind-cheatsheet', name: 'Tailwind Cheat Sheet', description: 'Quick reference for Tailwind CSS utility classes.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/tailwind-cheatsheet` },
  { id: 'd-markdown-writer', name: 'Text Scratchpad', description: 'A quick markdown scratchpad for notes.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/markdown-writer` },
  { id: 'd-algebra-calc', name: 'Algebra Calculator', description: 'Solve algebraic expressions and equations.', category: 'Calculators', status: 'external', source: 'delphi', url: `${DELPHI}/tools/algebra-calc` },
  { id: 'd-base-converter', name: 'Base Converter', description: 'Convert numbers between binary, octal, decimal and hex.', category: 'Calculators', status: 'external', source: 'delphi', url: `${DELPHI}/tools/base-converter` },
  { id: 'd-encoder', name: 'Encoding Tools', description: 'Encode/decode Base64, URL, hex and more.', category: 'Calculators', status: 'external', source: 'delphi', url: `${DELPHI}/tools/encoder` },
  { id: 'd-graph-calc', name: 'Graph Calculator', description: 'Plot and explore mathematical functions.', category: 'Calculators', status: 'external', source: 'delphi', url: `${DELPHI}/tools/graph-calc` },
  { id: 'd-sci-calc', name: 'Scientific Calculator', description: 'Full scientific calculator in the browser.', category: 'Calculators', status: 'external', source: 'delphi', url: `${DELPHI}/tools/sci-calc` },
  { id: 'd-time-calc', name: 'Time Calculator', description: 'Add, subtract and convert durations and time zones.', category: 'Calculators', status: 'external', source: 'delphi', url: `${DELPHI}/tools/time-calc` },
  { id: 'd-unit-converter', name: 'Unit Converter', description: 'Convert length, weight, volume and other common units.', category: 'Calculators', status: 'external', source: 'delphi', url: `${DELPHI}/tools/unit-converter`, keywords: ['mm to inch', 'unit conversion'] },
  { id: 'd-shavian', name: 'Shavian Transliterator', description: 'Transliterate English text into the Shavian alphabet.', category: 'Web & Dev', status: 'external', source: 'delphi', url: `${DELPHI}/tools/shavian-transliterator` },

  // ── External · open source / unavoidable exception ───────────────────
  { id: 'oss-pdf-compress', name: 'PDF Compressor', description: 'Shrink a PDF file size for email or upload limits.', category: 'PDF & Print', status: 'external', source: 'oss', url: STIRLING, keywords: ['compress pdf', 'shrink pdf'] },
  { id: 'oss-pdf-merge-split', name: 'PDF Merge/Split', description: 'Combine multiple PDFs or split one into separate pages.', category: 'PDF & Print', status: 'external', source: 'oss', url: STIRLING, keywords: ['merge pdf', 'split pdf'] },
  { id: 'oss-pdf-to-image', name: 'PDF → Image Exporter', description: 'Export PDF pages as PNG/JPG for previews or thumbnails.', category: 'PDF & Print', status: 'external', source: 'oss', url: STIRLING, keywords: ['pdf to image', 'pdf to png'] },
  { id: 'oss-pantone', name: 'Pantone Lookup', description: "Find a colour's nearest Pantone spot match (proprietary — no open alternative exists).", category: 'Colour', status: 'external', source: 'oss', url: 'https://www.pantone.com/connect/color-finder', keywords: ['pantone', 'spot colour'] },

  // ── Backlog — ranked by build effort (1=trivial .. 5=very hard) ──────
  { id: 'bl-icon-sprite', name: 'Icon Font/Sprite Builder', description: 'Bundle a set of SVG icons into a sprite or icon font.', category: 'SVG & Vector', status: 'backlog', effort: 3, keywords: ['icon sprite', 'icon font'] },
  { id: 'bl-bulk-qr', name: 'Bulk QR Batch Export', description: 'Generate a batch of QR codes from a CSV in one export.', category: 'Barcode & QR', status: 'backlog', effort: 2, keywords: ['bulk qr', 'batch qr', 'csv qr'] },
  { id: 'bl-barcode-placement', name: 'Barcode Placement Checker', description: 'Check a retail barcode meets minimum size/quiet-zone rules for packaging.', category: 'Packaging', status: 'backlog', effort: 2, keywords: ['barcode placement', 'quiet zone'] },
  { id: 'bl-exif', name: 'EXIF/Metadata Stripper', description: 'Remove camera/location metadata before sending client photos — note: re-saving through Image Compressor already strips EXIF as a side effect of canvas re-encoding.', category: 'Image', status: 'backlog', effort: 1, keywords: ['strip exif', 'remove metadata', 'privacy'] },
  { id: 'bl-proofing-guide', name: 'Print Colour Proofing Guide', description: 'Reference guide for soft-proofing and matching print colour to screen.', category: 'PDF & Print', status: 'backlog', effort: 1, keywords: ['colour proofing', 'soft proof'] },
  { id: 'bl-packaging-mockup', name: 'Packaging Mockup Generator', description: 'Wrap flat artwork onto a 3D box/pouch mockup for client presentation.', category: 'Packaging', status: 'backlog', effort: 5, keywords: ['packaging mockup', 'box mockup', '3d mockup'] },
];

/** Unified category order for grouped rendering. */
export const TOOL_CATEGORIES = [
  'Image',
  'Colour',
  'SVG & Vector',
  'Barcode & QR',
  'PDF & Print',
  'Packaging',
  'Typography & Text',
  'Web & Dev',
  'Calculators',
] as const;
