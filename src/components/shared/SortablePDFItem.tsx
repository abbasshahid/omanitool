'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PDFThumbnail from './PDFThumbnail';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortablePDFItemProps {
  id: string;
  file: File;
  index: number;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export default function SortablePDFItem({ id, file, index, onRemove, disabled }: SortablePDFItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative flex items-center p-3 bg-white dark:bg-slate-800 border ${isDragging ? 'border-indigo-500 shadow-xl scale-105' : 'border-gray-200 dark:border-slate-700 shadow-sm'} rounded-xl gap-4 group transition-colors hover:border-indigo-300`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className={`p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-indigo-500 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${disabled ? 'invisible' : ''}`}
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="shrink-0">
        <PDFThumbnail file={file} width={60} className="rounded object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {index + 1}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      </div>

      {!disabled && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(id); }} 
          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Remove file"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
