'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, Trash2 } from 'lucide-react';

interface SortablePDFPageItemProps {
  id: string; // usually `page-${pageNum}`
  imageUrl: string;
  currentIndex: number;
  originalPageNumber: number;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export default function SortablePDFPageItem({ 
  id, 
  imageUrl, 
  currentIndex, 
  originalPageNumber, 
  onRemove, 
  disabled 
}: SortablePDFPageItemProps) {
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
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative flex flex-col items-center p-3 bg-white dark:bg-slate-800 border ${isDragging ? 'border-amber-500 shadow-xl scale-105' : 'border-gray-200 dark:border-slate-700 shadow-sm'} rounded-xl group transition-colors hover:border-amber-300`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className={`w-full flex justify-center p-1 mb-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700 rounded transition-colors ${disabled ? 'invisible' : ''}`}
      >
        <GripHorizontal className="w-5 h-5" />
      </div>

      <div className="shrink-0 w-full flex justify-center mb-3 pointer-events-none">
        <img src={imageUrl} alt={`Page ${originalPageNumber}`} className="w-[120px] rounded object-cover shadow-sm border border-gray-100" />
      </div>

      <div className="flex items-center justify-center w-full mt-auto">
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          Page {currentIndex + 1}
        </span>
      </div>

      {!disabled && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(id); }} 
          className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Delete Page"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
