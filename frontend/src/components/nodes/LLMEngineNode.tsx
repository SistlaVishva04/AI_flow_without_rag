import { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Brain, Globe, X } from 'lucide-react';
import { LLMEngineConfig } from '@/types/workflow';

function LLMEngineNodeComponent({ id, data, selected }: NodeProps) {
  const config = data.config as LLMEngineConfig;
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };
  
  return (
    <div className={`workflow-node ${selected ? 'selected' : ''}`}>
      {selected && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 z-10 w-5 h-5 bg-destructive hover:bg-destructive/90 rounded-full flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-3 h-3 text-destructive-foreground" />
        </button>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-llm-engine"
      />
      <div className="node-header bg-node-llm-engine-bg">
        <div className="node-icon bg-node-llm-engine">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span className="node-title text-node-llm-engine">LLM Engine</span>
        {config?.enableWebSearch && (
          <Globe className="w-3.5 h-3.5 text-node-llm-engine ml-auto" />
        )}
      </div>
      <div className="node-body space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Model:</span>
          <span className="font-medium text-foreground text-xs">
            {config?.model || 'Not set'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Temp:</span>
          <span className="font-medium text-foreground text-xs">
            {config?.temperature?.toFixed(1) || '0.7'}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-llm-engine"
      />
    </div>
  );
}

export const LLMEngineNode = memo(LLMEngineNodeComponent);
