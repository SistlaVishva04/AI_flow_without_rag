import { Node } from '@xyflow/react';
import { Settings2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserQueryConfigPanel } from '@/components/panels/UserQueryConfigPanel';
import { KnowledgeBaseConfigPanel } from '@/components/panels/KnowledgeBaseConfigPanel';
import { LLMEngineConfigPanel } from '@/components/panels/LLMEngineConfigPanel';
import { OutputConfigPanel } from '@/components/panels/OutputConfigPanel';
import { NodeConfig, UserQueryConfig, KnowledgeBaseConfig, LLMEngineConfig, OutputConfig } from '@/types/workflow';

interface RightSidebarProps {
  selectedNode: Node | null;
  onUpdateConfig: (nodeId: string, config: NodeConfig) => void;
  onClose: () => void;
}

export function RightSidebar({ selectedNode, onUpdateConfig, onClose }: RightSidebarProps) {
  if (!selectedNode) {
    return (
      <aside className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-sm font-semibold text-sidebar-foreground flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Configuration
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Settings2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a node to configure
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const renderConfigPanel = () => {
    const config = selectedNode.data.config as NodeConfig;
    
    switch (selectedNode.type) {
      case 'userQuery':
        return (
          <UserQueryConfigPanel
            config={config as UserQueryConfig}
            onChange={(newConfig) => onUpdateConfig(selectedNode.id, newConfig)}
          />
        );
      case 'knowledgeBase':
        return (
          <KnowledgeBaseConfigPanel
            config={config as KnowledgeBaseConfig}
            onChange={(newConfig) => onUpdateConfig(selectedNode.id, newConfig)}
          />
        );
      case 'llmEngine':
        return (
          <LLMEngineConfigPanel
            config={config as LLMEngineConfig}
            onChange={(newConfig) => onUpdateConfig(selectedNode.id, newConfig)}
          />
        );
      case 'output':
        return (
          <OutputConfigPanel
            config={config as OutputConfig}
            onChange={(newConfig) => onUpdateConfig(selectedNode.id, newConfig)}
          />
        );
      default:
        return null;
    }
  };

  const getNodeTitle = () => {
    switch (selectedNode.type) {
      case 'userQuery':
        return 'User Query';
      case 'knowledgeBase':
        return 'Knowledge Base';
      case 'llmEngine':
        return 'LLM Engine';
      case 'output':
        return 'Output';
      default:
        return 'Node';
    }
  };

  return (
    <aside className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col shrink-0 animate-slide-in-right">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-sidebar-foreground">
            {getNodeTitle()}
          </h2>
          <p className="text-xs text-muted-foreground">
            Node Configuration
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderConfigPanel()}
      </div>
    </aside>
  );
}
