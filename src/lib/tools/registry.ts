import {
  AlignLeft,
  AppWindow,
  ArrowLeftRight,
  ArrowRightLeft,
  Archive,
  Barcode,
  Binary,
  Braces,
  Camera,
  CaseSensitive,
  Clock,
  Code2,
  Columns2,
  Combine,
  Crop,
  Download,
  Droplets,
  Eraser,
  FileCode,
  FileImage,
  FileMinus,
  FileOutput,
  FileText,
  FileType,
  Fingerprint,
  GitCompare,
  Hash,
  Images,
  Info,
  Key,
  KeyRound,
  Link2,
  LayoutGrid,
  Lock,
  LockOpen,
  Maximize2,
  Minimize2,
  Palette,
  PenLine,
  PenTool,
  QrCode,
  Regex,
  RotateCw,
  ScanText,
  Sheet,
  Shuffle,
  SplitSquareHorizontal,
  Table,
  Type,
  Video,
  Volume2,
  WrapText,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type ToolCategory = 'pdf' | 'image' | 'text' | 'developer' | 'generator';

export interface Tool {
  /** Slug; the page lives at `/tools/{id}`. */
  id: string;
  name: string;
  /** One line for the card and the tool page subtitle. */
  tagline: string;
  /** Fuller sentence used for meta descriptions and the page intro. */
  description: string;
  category: ToolCategory;
  group: string;
  icon: LucideIcon;
  /** Extra search terms beyond the name — what people actually type. */
  keywords: string[];
  isNew?: boolean;
  isPopular?: boolean;
  /** True when the tool needs a server round trip. Everything else is local. */
  usesNetwork?: boolean;
  /**
   * 'planned' means the entry is specified but `src/app/tools/{id}` does not
   * exist yet. Planned tools are kept out of every listing so the site never
   * links to a 404 — see the guard in registry.test.ts. Drop this field as each
   * page lands.
   */
  status?: 'live' | 'planned';
}

export const CATEGORIES: {
  id: ToolCategory;
  label: string;
  blurb: string;
  groups: string[];
}[] = [
  {
    id: 'pdf',
    label: 'PDF',
    blurb: 'Merge, split, convert, sign and secure PDF files without uploading them.',
    groups: ['Organize', 'Optimize', 'Convert to PDF', 'Convert from PDF', 'Edit', 'Security'],
  },
  {
    id: 'image',
    label: 'Image',
    blurb: 'Convert, resize, crop and inspect images straight from your browser.',
    groups: ['Convert', 'Adjust', 'Inspect'],
  },
  {
    id: 'text',
    label: 'Text',
    blurb: 'Count, clean, convert and format text and tabular data.',
    groups: ['Write', 'Transform'],
  },
  {
    id: 'developer',
    label: 'Developer',
    blurb: 'Encoders, decoders, hashes and inspectors that keep payloads local.',
    groups: ['Encode', 'Inspect', 'Compare'],
  },
  {
    id: 'generator',
    label: 'Generate',
    blurb: 'Make codes, passwords, recordings and speech on demand.',
    groups: ['Codes', 'Capture', 'Web'],
  },
];

const CATALOGUE: Tool[] = [
  // ---------------------------------------------------------------- PDF · Organize
  {
    id: 'pdf-merger',
    name: 'Merge PDF',
    tagline: 'Combine several PDFs into one file.',
    description:
      'Combine any number of PDF files into a single document. Drag the files into the order you want, then download the result.',
    category: 'pdf',
    group: 'Organize',
    icon: Combine,
    keywords: ['merge', 'combine', 'join', 'append', 'concatenate'],
    isPopular: true,
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    tagline: 'Break one PDF into separate files.',
    description:
      'Split a PDF at chosen page breaks or into fixed-size chunks. Each piece downloads as its own file, or all of them together as a ZIP.',
    category: 'pdf',
    group: 'Organize',
    icon: SplitSquareHorizontal,
    keywords: ['split', 'divide', 'separate', 'cut', 'chunk'],
    isPopular: true,
  },
  {
    id: 'remove-pages',
    name: 'Remove Pages',
    tagline: 'Delete pages you do not need.',
    description:
      'Pick the pages to drop and download the PDF without them. Everything else stays exactly as it was.',
    category: 'pdf',
    group: 'Organize',
    icon: FileMinus,
    keywords: ['remove', 'delete', 'drop', 'pages'],
  },
  {
    id: 'extract-pages',
    name: 'Extract Pages',
    tagline: 'Keep only the pages you choose.',
    description:
      'Build a new PDF from a selection of pages, given as a range such as 1-3, 7, 10-12.',
    category: 'pdf',
    group: 'Organize',
    icon: FileOutput,
    keywords: ['extract', 'select', 'keep', 'range', 'pages'],
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    tagline: 'Reorder and delete pages visually.',
    description:
      'See every page as a thumbnail, drag them into a new order, rotate or delete individual pages, then save.',
    category: 'pdf',
    group: 'Organize',
    icon: LayoutGrid,
    keywords: ['organize', 'organise', 'reorder', 'sort', 'arrange', 'rearrange'],
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    tagline: 'Turn pages the right way up.',
    description:
      'Rotate every page or just the ones you select, in 90 degree steps, and save the corrected file.',
    category: 'pdf',
    group: 'Organize',
    icon: RotateCw,
    keywords: ['rotate', 'turn', 'landscape', 'portrait', 'orientation'],
  },

  // ---------------------------------------------------------------- PDF · Optimize
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    tagline: 'Make a PDF smaller.',
    description:
      'Reduce PDF file size by re-encoding images and stripping redundant data. Choose how far to push it and compare before downloading.',
    category: 'pdf',
    group: 'Optimize',
    icon: Archive,
    keywords: ['compress', 'shrink', 'reduce', 'smaller', 'size', 'optimize'],
    isPopular: true,
  },
  {
    id: 'repair-pdf',
    name: 'Repair PDF',
    tagline: 'Recover what is readable from a damaged PDF.',
    description:
      'Rebuild a corrupt PDF page by page, salvaging every page that still parses and reporting the ones that do not.',
    category: 'pdf',
    group: 'Optimize',
    icon: Wrench,
    keywords: ['repair', 'fix', 'recover', 'corrupt', 'damaged', 'broken'],
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    tagline: 'Make scanned text selectable.',
    description:
      'Read the text in a scanned PDF with optical character recognition and get it back as selectable, searchable text.',
    category: 'pdf',
    group: 'Optimize',
    icon: ScanText,
    keywords: ['ocr', 'scan', 'recognize', 'text', 'searchable', 'tesseract'],
  },
  {
    id: 'compare-pdf',
    name: 'Compare PDF',
    tagline: 'See what changed between two PDFs.',
    description:
      'Extract the text from two PDFs and show a word-by-word comparison, so revisions are easy to spot.',
    category: 'pdf',
    group: 'Optimize',
    icon: GitCompare,
    keywords: ['compare', 'diff', 'difference', 'changes', 'versions'],
  },

  // ---------------------------------------------------------- PDF · Convert to PDF
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    tagline: 'Turn images into a PDF.',
    description:
      'Combine JPG, PNG or WebP images into a single PDF. Set page size, orientation and margins before you save.',
    category: 'pdf',
    group: 'Convert to PDF',
    icon: Images,
    keywords: ['jpg', 'jpeg', 'png', 'image', 'photo', 'to pdf'],
    isPopular: true,
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    tagline: 'Convert a .docx file to PDF.',
    description:
      'Read a Word document in your browser and lay it out as a PDF, keeping headings, lists, tables and basic formatting.',
    category: 'pdf',
    group: 'Convert to PDF',
    icon: FileType,
    keywords: ['word', 'docx', 'doc', 'document', 'to pdf'],
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    tagline: 'Convert a spreadsheet to PDF.',
    description:
      'Turn an .xlsx or .csv file into a PDF table, one section per worksheet, with headers repeated across pages.',
    category: 'pdf',
    group: 'Convert to PDF',
    icon: Sheet,
    keywords: ['excel', 'xlsx', 'csv', 'spreadsheet', 'table', 'to pdf'],
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    tagline: 'Turn markup into a PDF page.',
    description:
      'Paste HTML or open a .html file and render it to a PDF. Runs entirely in your browser, so local files work too.',
    category: 'pdf',
    group: 'Convert to PDF',
    icon: Code2,
    keywords: ['html', 'web', 'markup', 'page', 'to pdf'],
  },
  {
    id: 'scan-to-pdf',
    name: 'Scan to PDF',
    tagline: 'Photograph documents into a PDF.',
    description:
      'Use your camera to capture pages one at a time and assemble them into a PDF without installing a scanner app.',
    category: 'pdf',
    group: 'Convert to PDF',
    icon: Camera,
    keywords: ['scan', 'scanner', 'camera', 'photo', 'capture', 'document'],
  },

  // -------------------------------------------------------- PDF · Convert from PDF
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    tagline: 'Save PDF pages as images.',
    description:
      'Render each page of a PDF to a JPG or PNG at the resolution you choose, and download them individually or as a ZIP.',
    category: 'pdf',
    group: 'Convert from PDF',
    icon: FileImage,
    keywords: ['pdf to jpg', 'pdf to png', 'image', 'export', 'render'],
    isPopular: true,
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    tagline: 'Get an editable .docx of the text.',
    description:
      'Pull the text out of a PDF and write it into a real Word document you can edit. Layout is simplified to paragraphs.',
    category: 'pdf',
    group: 'Convert from PDF',
    icon: FileText,
    keywords: ['pdf to word', 'docx', 'editable', 'export', 'convert'],
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    tagline: 'Pull tables into a spreadsheet.',
    description:
      'Detect rows and columns in a PDF using text positions and export them to an .xlsx workbook, one sheet per page.',
    category: 'pdf',
    group: 'Convert from PDF',
    icon: Table,
    keywords: ['pdf to excel', 'xlsx', 'table', 'spreadsheet', 'data'],
  },

  // -------------------------------------------------------------------- PDF · Edit
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    tagline: 'Trim the margins off every page.',
    description:
      'Drag a crop box over a page preview and apply it to the whole document, or type exact margins in millimetres.',
    category: 'pdf',
    group: 'Edit',
    icon: Crop,
    keywords: ['crop', 'trim', 'margin', 'cut', 'resize'],
  },
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    tagline: 'Number the pages of a PDF.',
    description:
      'Stamp page numbers onto a PDF. Choose the position, starting number, format and font size.',
    category: 'pdf',
    group: 'Edit',
    icon: Hash,
    keywords: ['page numbers', 'numbering', 'pagination', 'footer'],
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    tagline: 'Stamp text across every page.',
    description:
      'Overlay text on a PDF at the angle, size, colour and opacity you pick — useful for drafts and confidential copies.',
    category: 'pdf',
    group: 'Edit',
    icon: Droplets,
    keywords: ['watermark', 'stamp', 'draft', 'confidential', 'overlay'],
  },
  {
    id: 'edit-pdf',
    name: 'Annotate PDF',
    tagline: 'Add text and boxes onto a page.',
    description:
      'Place text notes, highlights and rectangles anywhere on a PDF page, then flatten them into the saved file.',
    category: 'pdf',
    group: 'Edit',
    icon: PenLine,
    keywords: ['edit', 'annotate', 'markup', 'note', 'highlight', 'comment'],
  },

  // ---------------------------------------------------------------- PDF · Security
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    tagline: 'Lock a PDF with a password.',
    description:
      'Encrypt a PDF with AES-256 so it cannot be opened without the password, and optionally restrict printing and copying.',
    category: 'pdf',
    group: 'Security',
    icon: Lock,
    keywords: ['protect', 'password', 'encrypt', 'lock', 'secure'],
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    tagline: 'Remove a password you know.',
    description:
      'Open a password-protected PDF you have the password for and save an unencrypted copy.',
    category: 'pdf',
    group: 'Security',
    icon: LockOpen,
    keywords: ['unlock', 'decrypt', 'remove password', 'open'],
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    tagline: 'Draw a signature onto a document.',
    description:
      'Draw or type a signature, place it on the page, and save the signed PDF. Nothing is sent anywhere.',
    category: 'pdf',
    group: 'Security',
    icon: PenTool,
    keywords: ['sign', 'signature', 'esign', 'initial', 'autograph'],
  },

  // ------------------------------------------------------------------------ Image
  {
    id: 'image-converter',
    status: 'planned',
    name: 'Image Converter',
    tagline: 'Convert between PNG, JPG, WebP and AVIF.',
    description:
      'Change image formats in bulk, set quality, and download everything as a ZIP. Supports PNG, JPG, WebP and AVIF.',
    category: 'image',
    group: 'Convert',
    icon: ArrowLeftRight,
    keywords: ['convert', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'format'],
    isNew: true,
    isPopular: true,
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    tagline: 'Resize by pixels or percentage.',
    description:
      'Set exact dimensions or scale by percentage, with the option to keep the aspect ratio. Handles many images at once.',
    category: 'image',
    group: 'Adjust',
    icon: Maximize2,
    keywords: ['resize', 'scale', 'dimensions', 'width', 'height', 'shrink'],
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    tagline: 'Shrink images without visible loss.',
    description:
      'Compress JPG, PNG and WebP images to a target size or quality, and see exactly how much each file saved.',
    category: 'image',
    group: 'Adjust',
    icon: Minimize2,
    keywords: ['compress', 'optimize', 'smaller', 'quality', 'reduce'],
  },
  {
    id: 'image-cropper',
    status: 'planned',
    name: 'Image Cropper',
    tagline: 'Crop to a shape or a fixed ratio.',
    description:
      'Drag a crop region over your image, lock it to a common aspect ratio, and export the cropped result.',
    category: 'image',
    group: 'Adjust',
    icon: Crop,
    keywords: ['crop', 'trim', 'cut', 'aspect ratio', 'square'],
    isNew: true,
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    tagline: 'Cut the background out of a photo.',
    description:
      'Separate the subject from the background using a model that runs in your browser, and save a transparent PNG.',
    category: 'image',
    group: 'Adjust',
    icon: Eraser,
    keywords: ['background', 'remove', 'transparent', 'cutout', 'subject'],
    isPopular: true,
  },
  {
    id: 'exif-viewer',
    status: 'planned',
    name: 'EXIF Viewer & Stripper',
    tagline: 'See hidden photo metadata, then remove it.',
    description:
      'Photos carry camera settings, timestamps and often GPS coordinates. Read all of it, then download a copy with the metadata stripped.',
    category: 'image',
    group: 'Inspect',
    icon: Info,
    keywords: ['exif', 'metadata', 'gps', 'location', 'privacy', 'strip'],
    isNew: true,
  },
  {
    id: 'favicon-generator',
    status: 'planned',
    name: 'Favicon Generator',
    tagline: 'Make every icon size a site needs.',
    description:
      'Turn one image into the full set of favicon and app icon sizes, packaged as a ZIP with the HTML tags to paste.',
    category: 'image',
    group: 'Convert',
    icon: AppWindow,
    keywords: ['favicon', 'ico', 'icon', 'apple touch', 'site icon'],
    isNew: true,
  },
  {
    id: 'color-palette',
    status: 'planned',
    name: 'Color Palette Extractor',
    tagline: 'Pull the dominant colors from an image.',
    description:
      'Find the colors an image is actually built from and copy them as HEX, RGB or HSL.',
    category: 'image',
    group: 'Inspect',
    icon: Palette,
    keywords: ['color', 'colour', 'palette', 'hex', 'rgb', 'dominant', 'picker'],
    isNew: true,
  },
  {
    id: 'image-to-base64',
    status: 'planned',
    name: 'Image to Base64',
    tagline: 'Encode an image as a data URI.',
    description:
      'Convert an image into a Base64 data URI ready to paste into CSS, HTML or JSON, and decode data URIs back to files.',
    category: 'image',
    group: 'Convert',
    icon: Binary,
    keywords: ['base64', 'data uri', 'encode', 'inline', 'embed'],
    isNew: true,
  },

  // ------------------------------------------------------------------------- Text
  {
    id: 'word-counter',
    status: 'planned',
    name: 'Word Counter',
    tagline: 'Count words, characters and reading time.',
    description:
      'Live counts for words, characters with and without spaces, sentences, paragraphs and estimated reading time.',
    category: 'text',
    group: 'Write',
    icon: AlignLeft,
    keywords: ['word count', 'character count', 'letters', 'reading time'],
    isNew: true,
  },
  {
    id: 'case-converter',
    status: 'planned',
    name: 'Case Converter',
    tagline: 'Switch between naming conventions.',
    description:
      'Convert text to sentence case, title case, UPPER, lower, camelCase, PascalCase, snake_case and kebab-case.',
    category: 'text',
    group: 'Transform',
    icon: CaseSensitive,
    keywords: ['case', 'uppercase', 'lowercase', 'camel', 'snake', 'kebab', 'title'],
    isNew: true,
  },
  {
    id: 'markdown-editor',
    status: 'planned',
    name: 'Markdown Editor',
    tagline: 'Write Markdown, preview it, export a PDF.',
    description:
      'A split-pane Markdown editor with live preview, which exports to HTML or PDF when you are done.',
    category: 'text',
    group: 'Write',
    icon: FileCode,
    keywords: ['markdown', 'md', 'preview', 'editor', 'readme'],
    isNew: true,
  },
  {
    id: 'lorem-ipsum',
    status: 'planned',
    name: 'Lorem Ipsum Generator',
    tagline: 'Generate placeholder text.',
    description:
      'Produce paragraphs, sentences, words or list items of filler text, in classic Lorem Ipsum or plain English.',
    category: 'text',
    group: 'Write',
    icon: Type,
    keywords: ['lorem', 'ipsum', 'placeholder', 'dummy text', 'filler'],
    isNew: true,
  },
  {
    id: 'csv-json',
    status: 'planned',
    name: 'CSV to JSON',
    tagline: 'Convert tabular data both ways.',
    description:
      'Turn CSV into JSON or JSON back into CSV, with control over the delimiter and whether the first row is a header.',
    category: 'text',
    group: 'Transform',
    icon: ArrowRightLeft,
    keywords: ['csv', 'json', 'convert', 'tsv', 'table', 'data'],
    isNew: true,
  },
  {
    id: 'text-cleaner',
    status: 'planned',
    name: 'Text Cleaner',
    tagline: 'Tidy up messy pasted text.',
    description:
      'Strip extra spaces, blank lines, line breaks, HTML tags, smart quotes and invisible characters in one pass.',
    category: 'text',
    group: 'Transform',
    icon: WrapText,
    keywords: ['clean', 'whitespace', 'trim', 'strip', 'format', 'tidy'],
    isNew: true,
  },

  // -------------------------------------------------------------------- Developer
  {
    id: 'json-formatter',
    status: 'planned',
    name: 'JSON Formatter',
    tagline: 'Format, validate and minify JSON.',
    description:
      'Pretty-print JSON with the indent you want, minify it again, sort keys, and get the exact line and column of any syntax error.',
    category: 'developer',
    group: 'Encode',
    icon: Braces,
    keywords: ['json', 'format', 'beautify', 'validate', 'minify', 'pretty'],
    isNew: true,
    isPopular: true,
  },
  {
    id: 'base64',
    status: 'planned',
    name: 'Base64 Encoder',
    tagline: 'Encode and decode Base64.',
    description:
      'Convert text or files to Base64 and back, with optional URL-safe output. Handles Unicode correctly.',
    category: 'developer',
    group: 'Encode',
    icon: Binary,
    keywords: ['base64', 'encode', 'decode', 'btoa', 'atob'],
    isNew: true,
  },
  {
    id: 'jwt-decoder',
    status: 'planned',
    name: 'JWT Decoder',
    tagline: 'Read the claims inside a token.',
    description:
      'Decode the header and payload of a JSON Web Token and see expiry and issued-at times as readable dates. Decoding only — the token is never sent anywhere.',
    category: 'developer',
    group: 'Inspect',
    icon: KeyRound,
    keywords: ['jwt', 'token', 'decode', 'claims', 'bearer', 'auth'],
    isNew: true,
  },
  {
    id: 'hash-generator',
    status: 'planned',
    name: 'Hash Generator',
    tagline: 'SHA-1, SHA-256, SHA-384 and SHA-512.',
    description:
      'Hash text or a file with the Web Crypto API and compare the result against an expected checksum.',
    category: 'developer',
    group: 'Encode',
    icon: Fingerprint,
    keywords: ['hash', 'sha256', 'sha1', 'checksum', 'digest', 'verify'],
    isNew: true,
  },
  {
    id: 'uuid-generator',
    status: 'planned',
    name: 'UUID Generator',
    tagline: 'Generate random identifiers in bulk.',
    description:
      'Produce cryptographically random UUID v4 values, or NanoID-style short IDs, as many at a time as you need.',
    category: 'developer',
    group: 'Encode',
    icon: Shuffle,
    keywords: ['uuid', 'guid', 'nanoid', 'random', 'id', 'v4'],
    isNew: true,
  },
  {
    id: 'url-encoder',
    status: 'planned',
    name: 'URL Encoder',
    tagline: 'Percent-encode URLs and query strings.',
    description:
      'Encode and decode URLs or individual components, and break a URL apart into its query parameters.',
    category: 'developer',
    group: 'Encode',
    icon: Link2,
    keywords: ['url', 'encode', 'decode', 'percent', 'query', 'escape'],
    isNew: true,
  },
  {
    id: 'regex-tester',
    status: 'planned',
    name: 'Regex Tester',
    tagline: 'Test a pattern against real text.',
    description:
      'Write a regular expression, see every match highlighted as you type, and inspect capture groups match by match.',
    category: 'developer',
    group: 'Inspect',
    icon: Regex,
    keywords: ['regex', 'regexp', 'pattern', 'match', 'test', 'expression'],
    isNew: true,
  },
  {
    id: 'timestamp-converter',
    status: 'planned',
    name: 'Timestamp Converter',
    tagline: 'Unix time to dates and back.',
    description:
      'Convert Unix timestamps in seconds or milliseconds to readable dates in UTC and your local zone, and back again.',
    category: 'developer',
    group: 'Inspect',
    icon: Clock,
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'iso'],
    isNew: true,
  },
  {
    id: 'text-diff',
    status: 'planned',
    name: 'Text Diff',
    tagline: 'Compare two blocks of text.',
    description:
      'See what was added and removed between two versions of a text, line by line or word by word.',
    category: 'developer',
    group: 'Compare',
    icon: Columns2,
    keywords: ['diff', 'compare', 'difference', 'changes', 'merge'],
    isNew: true,
  },

  // -------------------------------------------------------------------- Generate
  {
    id: 'qr-code',
    status: 'planned',
    name: 'QR Code Generator',
    tagline: 'Make a QR code for anything.',
    description:
      'Generate QR codes for links, text, Wi-Fi networks, contact cards and email, with your own colors and size.',
    category: 'generator',
    group: 'Codes',
    icon: QrCode,
    keywords: ['qr', 'qr code', 'barcode', 'wifi', 'vcard', 'link'],
    isNew: true,
    isPopular: true,
  },
  {
    id: 'barcode',
    status: 'planned',
    name: 'Barcode Generator',
    tagline: 'EAN, UPC, Code 128 and more.',
    description:
      'Create barcodes in the common retail and logistics formats and download them as PNG or SVG.',
    category: 'generator',
    group: 'Codes',
    icon: Barcode,
    keywords: ['barcode', 'ean', 'upc', 'code128', 'code39', 'itf'],
    isNew: true,
  },
  {
    id: 'password-generator',
    status: 'planned',
    name: 'Password Generator',
    tagline: 'Strong passwords and passphrases.',
    description:
      'Generate random passwords or word-based passphrases using the browser crypto API, with a live strength estimate.',
    category: 'generator',
    group: 'Codes',
    icon: Key,
    keywords: ['password', 'passphrase', 'random', 'secure', 'strong', 'generate'],
    isNew: true,
  },
  {
    id: 'screen-recorder',
    status: 'planned',
    name: 'Screen Recorder',
    tagline: 'Record your screen or webcam.',
    description:
      'Capture a screen, window, tab or webcam with optional microphone audio and save the video. The recording never leaves your machine.',
    category: 'generator',
    group: 'Capture',
    icon: Video,
    keywords: ['record', 'screen', 'webcam', 'capture', 'video', 'screencast'],
    isNew: true,
  },
  {
    id: 'text-to-speech',
    status: 'planned',
    name: 'Text to Speech',
    tagline: 'Read text aloud in any installed voice.',
    description:
      'Have text spoken using the voices already on your device, with control over speed and pitch.',
    category: 'generator',
    group: 'Capture',
    icon: Volume2,
    keywords: ['speech', 'tts', 'voice', 'read aloud', 'speak', 'audio'],
    isNew: true,
  },
  {
    id: 'media-downloader',
    name: 'Page Media Extractor',
    tagline: 'List the images and video on a public page.',
    description:
      'Fetch a public web page and list the images and video files it references, so you can save the ones you need. Pages that require a login are not supported.',
    category: 'generator',
    group: 'Web',
    icon: Download,
    keywords: ['download', 'media', 'images', 'video', 'extract', 'scrape', 'url'],
    usesNetwork: true,
  },
];

/** Every entry, including ones not built yet. Use it for planning, not for UI. */
export const CATALOGUE_ALL = CATALOGUE;

/**
 * The tools the site actually lists and links to. Anything still marked
 * 'planned' has no page, so showing it would produce a dead link.
 */
export const TOOLS: Tool[] = CATALOGUE.filter((tool) => tool.status !== 'planned');

export const toolPath = (tool: Tool) => `/tools/${tool.id}`;

export const getTool = (id: string) => TOOLS.find((tool) => tool.id === id);

export const getToolsByCategory = (category: ToolCategory) =>
  TOOLS.filter((tool) => tool.category === category);

export const getCategory = (id: ToolCategory) =>
  CATEGORIES.find((category) => category.id === id)!;

/** Groups within a category, in the order the category declares them. */
export function getGroupedTools(category: ToolCategory) {
  const { groups } = getCategory(category);
  const tools = getToolsByCategory(category);
  return groups
    .map((group) => ({ group, tools: tools.filter((tool) => tool.group === group) }))
    .filter((entry) => entry.tools.length > 0);
}

export const POPULAR_TOOLS = TOOLS.filter((tool) => tool.isPopular);

/**
 * Related tools for the bottom of a tool page: same group first, then the rest
 * of the category, so the suggestions stay close to what the visitor came for.
 */
export function getRelatedTools(tool: Tool, limit = 4) {
  const sameGroup = TOOLS.filter(
    (candidate) =>
      candidate.id !== tool.id &&
      candidate.category === tool.category &&
      candidate.group === tool.group,
  );
  const sameCategory = TOOLS.filter(
    (candidate) =>
      candidate.id !== tool.id &&
      candidate.category === tool.category &&
      candidate.group !== tool.group,
  );
  return [...sameGroup, ...sameCategory].slice(0, limit);
}

/**
 * Ranked search over name, tagline and keywords. Prefix matches on the name beat
 * keyword hits, so typing "com" surfaces "Compress PDF" before "Compare PDF".
 */
export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);

  const scored = TOOLS.map((tool) => {
    const name = tool.name.toLowerCase();
    const haystack = `${name} ${tool.tagline.toLowerCase()} ${tool.keywords.join(' ')}`;

    let score = 0;
    for (const term of terms) {
      if (name === term) score += 100;
      else if (name.startsWith(term)) score += 50;
      else if (name.includes(term)) score += 30;
      else if (tool.keywords.some((keyword) => keyword.startsWith(term))) score += 20;
      else if (haystack.includes(term)) score += 8;
      else return { tool, score: -1 };
    }
    if (tool.isPopular) score += 3;
    return { tool, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.tool);
}
