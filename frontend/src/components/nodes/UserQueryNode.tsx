import { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { MessageCircle, X } from 'lucide-react';

function UserQueryNodeComponent({ id, selected }: NodeProps) {
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
      <div className="node-header bg-node-user-query-bg">
        <div className="node-icon bg-node-user-query">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <span className="node-title text-node-user-query">User Query</span>
      </div>
      <div className="node-body">
        <p>Input from the user</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-user-query"
      />
    </div>
  );
}

export const UserQueryNode = memo(UserQueryNodeComponent);
