import { GripVertical, MessageCircle, Database, Brain, Send } from 'lucide-react';
import { DraggableNodeItem, NodeType } from '@/types/workflow';

const DRAGGABLE_ITEMS: DraggableNodeItem[] = [
  {
    type: 'userQuery',
    label: 'User Query',
    description: 'Input from the user',
    icon: 'MessageCircle',
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    description: 'Document retrieval',
    icon: 'Database',
  },
  {
    type: 'llmEngine',
    label: 'LLM Engine',
    description: 'AI language model',
    icon: 'Brain',
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Final response',
    icon: 'Send',
  },
];

const IconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Database,
  Brain,
  Send,
};

const nodeColorClasses: Record<NodeType, { bg: string; text: string }> = {
  userQuery: { bg: 'bg-node-user-query-bg', text: 'text-node-user-query' },
  knowledgeBase: { bg: 'bg-node-knowledge-base-bg', text: 'text-node-knowledge-base' },
  llmEngine: { bg: 'bg-node-llm-engine-bg', text: 'text-node-llm-engine' },
  output: { bg: 'bg-node-output-bg', text: 'text-node-output' },
};

interface LeftSidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

export function LeftSidebar({ onDragStart }: LeftSidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground">
          Component Library
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Drag components to canvas
        </p>
      </div>

      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          {DRAGGABLE_ITEMS.map((item) => {
            const Icon = IconMap[item.icon];
            const colors = nodeColorClasses[item.type];

            return (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => onDragStart(e, item.type)}
                className="sidebar-item group"
              >
                <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
                <GripVertical className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-accent rounded-lg">
          <p className="text-xs text-accent-foreground font-medium">
            💡 Quick Tip
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Start with a User Query node and end with an Output node to create a valid workflow.
          </p>
        </div>
      </div>
    </aside>
  );
}
