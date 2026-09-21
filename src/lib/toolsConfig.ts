/**
 * Legacy adapter.
 *
 * The tool catalogue now lives in `src/lib/tools/registry.ts`. The tool clients
 * written before that move still read `getToolById(...)` and expect a `color`
 * and `path`, so this module keeps them compiling until each one is migrated to
 * `ToolShell`. Nothing new should import from here.
 *
 * @deprecated Import from `@/lib/tools/registry` instead.
 */
import {
  TOOLS as REGISTRY_TOOLS,
  getTool,
  getToolsByCategory as registryToolsByCategory,
  type Tool,
  type ToolCategory,
} from './tools/registry';

export type { ToolCategory };

export interface ToolDefinition extends Tool {
  path: string;
  /** Legacy gradient classes; the current design does not colour-code tools. */
  color: string;
  subCategory?: string;
}

function adapt(tool: Tool): ToolDefinition {
  return {
    ...tool,
    path: `/tools/${tool.id}`,
    color: 'from-slate-500 to-slate-400',
    subCategory: tool.group,
  };
}

export const TOOLS: ToolDefinition[] = REGISTRY_TOOLS.map(adapt);

export const getToolById = (id: string): ToolDefinition | undefined => {
  const tool = getTool(id);
  return tool ? adapt(tool) : undefined;
};

export const getToolsByCategory = (category: ToolCategory): ToolDefinition[] =>
  registryToolsByCategory(category).map(adapt);
