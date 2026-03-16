export type ToolCategory = 'document' | 'image' | 'ai' | 'utilities' | 'pdf';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  subCategory?: string;
  icon: any; // Type 'any' for Lucide icons for simplicity in definition mapped object
  path: string;
  color: string;
  isNew?: boolean;
  isUnderDevelopment?: boolean;
}

import { 
  LayoutTemplate, Image as ImageIcon, FileText, FileAudio, Eraser, MoveDiagonal, Scissors, TextSelect, Wand2, TerminalSquare, FileSearch,
  SplitSquareHorizontal, Delete, FileDigit, Grip, Camera, FileArchive, Wrench, ScanText, 
  FileImage, FileType2, Presentation, TableProperties, FileCode2,
  LockOpen, Lock, PenTool, Eraser as EraserIcon, GitCompare, Languages,
  RotateCw, Hash, Droplets, Crop, Edit3, ShieldAlert
} from 'lucide-react';

export const TOOLS: ToolDefinition[] = [
  // --- Image Tools ---
  {
    id: 'bg-remover',
    name: 'Background Remover',
    description: 'Instantly remove the background from images with AI precision. Free and high quality.',
    category: 'image',
    icon: Eraser,
    path: '/tools/background-remover',
    color: 'from-pink-500 to-rose-400',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images in seconds with exact pixel dimensions or percentage scaling.',
    category: 'image',
    icon: MoveDiagonal,
    path: '/tools/image-resizer',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress PNG, JPG, or WEBP files with the best quality/size ratio.',
    category: 'image',
    icon: Scissors,
    path: '/tools/image-compressor',
    color: 'from-emerald-500 to-teal-400',
  },

  // --- Document & Format Tools ---
  {
    id: 'format-converter',
    name: 'Format Converter',
    description: 'Convert files between hundreds of different formats quickly and securely.',
    category: 'pdf',
    subCategory: 'Convert from PDF',
    icon: FileAudio,
    path: '/tools/format-converter',
    color: 'from-orange-500 to-amber-400',
  },

  // --- AI Tools Hub ---
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Transform text prompts into stunning visual masterpieces in seconds.',
    category: 'ai',
    icon: ImageIcon,
    path: '/tools/ai-image-generator',
    color: 'from-fuchsia-500 to-purple-400',
    isNew: true,
    isUnderDevelopment: true,
  },
  {
    id: 'ai-text-enhancer',
    name: 'AI Text Enhancer',
    description: 'Polish your copy, fix grammar, and adjust tone automatically.',
    category: 'ai',
    icon: TextSelect,
    path: '/tools/ai-text-enhancer',
    color: 'from-violet-500 to-fuchsia-400',
    isUnderDevelopment: true,
  },
  {
    id: 'ai-summarizer',
    name: 'AI Text Summarizer',
    description: 'Extract key points and concise summaries from long-form content.',
    category: 'ai',
    icon: FileSearch,
    path: '/tools/ai-summarizer',
    color: 'from-sky-500 to-indigo-400',
    isUnderDevelopment: true,
  },
  {
    id: 'ai-code-assistant',
    name: 'Code Assistant',
    description: 'Write cleaner code faster. Debug snippets and refactor functions.',
    category: 'ai',
    icon: TerminalSquare,
    path: '/tools/ai-code-assistant',
    color: 'from-slate-600 to-gray-400',
    isUnderDevelopment: true,
  },

  // --- Massive PDF Expansion: Organize ---
  { id: 'pdf-merger', name: 'Merge PDF', description: 'Combine multiple PDFs into a single unified document effortlessly.', category: 'pdf', subCategory: 'Organize PDF', icon: LayoutTemplate, path: '/tools/pdf-merger', color: 'from-indigo-500 to-blue-400' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', category: 'pdf', subCategory: 'Organize PDF', icon: SplitSquareHorizontal, path: '/tools/split-pdf', color: 'from-indigo-400 to-blue-300' },
  { id: 'remove-pages', name: 'Remove Pages', description: 'Remove pages from a PDF document online in seconds.', category: 'pdf', subCategory: 'Organize PDF', icon: Delete, path: '/tools/remove-pages', color: 'from-red-400 to-rose-300' },
  { id: 'extract-pages', name: 'Extract Pages', description: 'Get a new document containing only the desired pages from your PDF.', category: 'pdf', subCategory: 'Organize PDF', icon: FileDigit, path: '/tools/extract-pages', color: 'from-emerald-400 to-teal-300' },
  { id: 'organize-pdf', name: 'Organize PDF', description: 'Sort, add and delete PDF pages. Drag and drop the page thumbnails.', category: 'pdf', subCategory: 'Organize PDF', icon: Grip, path: '/tools/organize-pdf', color: 'from-orange-400 to-amber-300' },
  { id: 'scan-to-pdf', name: 'Scan to PDF', description: 'Capture document scans from your mobile device or webcam instantly.', category: 'pdf', subCategory: 'Organize PDF', icon: Camera, path: '/tools/scan-to-pdf', color: 'from-slate-500 to-gray-400' },

  // --- Massive PDF Expansion: Optimize ---
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', category: 'pdf', subCategory: 'Optimize PDF', icon: FileArchive, path: '/tools/compress-pdf', color: 'from-green-500 to-emerald-400' },
  { id: 'repair-pdf', name: 'Repair PDF', description: 'Repair a damaged PDF and recover data from corrupt PDF.', category: 'pdf', subCategory: 'Optimize PDF', icon: Wrench, path: '/tools/repair-pdf', color: 'from-amber-500 to-yellow-400' },
  { id: 'ocr-pdf', name: 'OCR PDF', description: 'Convert non-selectable PDF text into searchable and selectable documents.', category: 'pdf', subCategory: 'Optimize PDF', icon: ScanText, path: '/tools/ocr-pdf', color: 'from-cyan-500 to-blue-400' },

  // --- Massive PDF Expansion: Convert TO PDF ---
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', category: 'pdf', subCategory: 'Convert to PDF', icon: FileImage, path: '/tools/jpg-to-pdf', color: 'from-yellow-500 to-amber-400', isNew: true },
  { id: 'word-to-pdf', name: 'WORD to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', category: 'pdf', subCategory: 'Convert to PDF', icon: FileType2, path: '/tools/word-to-pdf', color: 'from-blue-600 to-indigo-500' },
  { id: 'powerpoint-to-pdf', name: 'POWERPOINT to PDF', description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', category: 'pdf', subCategory: 'Convert to PDF', icon: Presentation, path: '/tools/powerpoint-to-pdf', color: 'from-orange-600 to-red-500' },
  { id: 'excel-to-pdf', name: 'EXCEL to PDF', description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', category: 'pdf', subCategory: 'Convert to PDF', icon: TableProperties, path: '/tools/excel-to-pdf', color: 'from-emerald-600 to-green-500' },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page you want.', category: 'pdf', subCategory: 'Convert to PDF', icon: FileCode2, path: '/tools/html-to-pdf', color: 'from-indigo-600 to-purple-500' },

  // --- Massive PDF Expansion: Convert FROM PDF ---
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Extract pages from PDF documents and save them as high-quality JPG images.', category: 'pdf', subCategory: 'Convert from PDF', icon: FileText, path: '/tools/pdf-to-jpg', color: 'from-red-500 to-rose-400' },
  { id: 'pdf-to-word', name: 'PDF to WORD', description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', category: 'pdf', subCategory: 'Convert from PDF', icon: FileType2, path: '/tools/pdf-to-word', color: 'from-blue-500 to-cyan-400' },
  { id: 'pdf-to-powerpoint', name: 'PDF to POWERPOINT', description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', category: 'pdf', subCategory: 'Convert from PDF', icon: Presentation, path: '/tools/pdf-to-powerpoint', color: 'from-orange-500 to-amber-400' },
  { id: 'pdf-to-excel', name: 'PDF to EXCEL', description: 'Pull data straight from PDFs into EXCEL spreadsheets in a few short seconds.', category: 'pdf', subCategory: 'Convert from PDF', icon: TableProperties, path: '/tools/pdf-to-excel', color: 'from-emerald-500 to-teal-400' },
  { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', description: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for archiving.', category: 'pdf', subCategory: 'Convert from PDF', icon: ShieldAlert, path: '/tools/pdf-to-pdfa', color: 'from-slate-500 to-gray-400' },

  // --- Massive PDF Expansion: Edit PDF ---
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', category: 'pdf', subCategory: 'Edit PDF', icon: RotateCw, path: '/tools/rotate-pdf', color: 'from-sky-500 to-blue-400' },
  { id: 'add-page-numbers', name: 'Add Page Numbers', description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.', category: 'pdf', subCategory: 'Edit PDF', icon: Hash, path: '/tools/add-page-numbers', color: 'from-fuchsia-500 to-pink-400' },
  { id: 'add-watermark', name: 'Add Watermark', description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.', category: 'pdf', subCategory: 'Edit PDF', icon: Droplets, path: '/tools/add-watermark', color: 'from-cyan-500 to-teal-400' },
  { id: 'crop-pdf', name: 'Crop PDF', description: 'Crop PDF online to a selected area, adjust margin size swiftly.', category: 'pdf', subCategory: 'Edit PDF', icon: Crop, path: '/tools/crop-pdf', color: 'from-violet-500 to-purple-400' },
  { id: 'edit-pdf', name: 'Edit PDF', description: 'Add text, shapes, images and freehand annotations to your PDF document.', category: 'pdf', subCategory: 'Edit PDF', icon: Edit3, path: '/tools/edit-pdf', color: 'from-rose-500 to-pink-400' },

  // --- Massive PDF Expansion: Security & Intelligence ---
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', category: 'pdf', subCategory: 'PDF Security', icon: LockOpen, path: '/tools/unlock-pdf', color: 'from-green-400 to-emerald-300' },
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Encrypt your PDF with a password to prevent unauthorized access to the file content.', category: 'pdf', subCategory: 'PDF Security', icon: Lock, path: '/tools/protect-pdf', color: 'from-red-500 to-rose-400' },
  { id: 'sign-pdf', name: 'Sign PDF', description: 'Sign yourself or request electronic signatures from others.', category: 'pdf', subCategory: 'PDF Security', icon: PenTool, path: '/tools/sign-pdf', color: 'from-indigo-500 to-blue-400' },
  { id: 'redact-pdf', name: 'Redact PDF', description: 'Permanently remove visible text and graphics from a document.', category: 'pdf', subCategory: 'PDF Security', icon: EraserIcon, path: '/tools/redact-pdf', color: 'from-gray-700 to-slate-600' },
  { id: 'compare-pdf', name: 'Compare PDF', description: 'Compare two PDF documents to quickly spot changes.', category: 'pdf', subCategory: 'PDF Security', icon: GitCompare, path: '/tools/compare-pdf', color: 'from-purple-500 to-fuchsia-400' },
  { id: 'translate-pdf', name: 'Translate PDF', description: 'Translate PDF documents into over 100 languages instantly.', category: 'pdf', subCategory: 'PDF Security', icon: Languages, path: '/tools/translate-pdf', color: 'from-sky-500 to-blue-400' }
];

export const getToolsByCategory = (category: ToolCategory) => 
  TOOLS.filter(tool => tool.category === category);

export const getToolById = (id: string) => 
  TOOLS.find(tool => tool.id === id);
