import Link from 'next/link';
import { ToolDefinition } from '@/lib/toolsConfig';

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon;
  
  return (
    <Link href={tool.path} className="group block">
      <div className="card-container h-full p-6 transition-all duration-300 hover:shadow-md hover:border-gray-600">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${tool.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {tool.isNew && !tool.isUnderDevelopment && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200">
              New
            </span>
          )}
          {tool.isUnderDevelopment && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-900/80 text-orange-200 whitespace-nowrap">
              Requires API / Dev
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-2 group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] line-clamp-3">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
