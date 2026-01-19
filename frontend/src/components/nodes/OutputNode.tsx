import { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Send, X } from 'lucide-react';

function OutputNodeComponent({ id, selected }: NodeProps) {
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
        className="!bg-node-output"
      />
      <div className="node-header bg-node-output-bg">
        <div className="node-icon bg-node-output">
          <Send className="w-4 h-4 text-white" />
        </div>
        <span className="node-title text-node-output">Output</span>
      </div>
      <div className="node-body">
        <p>Final response</p>
      </div>
    </div>
  );
}

export const OutputNode = memo(OutputNodeComponent);
