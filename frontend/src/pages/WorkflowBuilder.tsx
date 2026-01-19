import { useCallback, useState, useRef, useMemo,useEffect} from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TopBar } from '@/components/layout/TopBar';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { ValidationModal } from '@/components/panels/ValidationModal';
import { ChatModal } from '@/components/panels/ChatModal';
import { supabase } from "@/lib/supabase";
import Auth from "./Auth";
import {
  UserQueryNode,
  KnowledgeBaseNode,
  LLMEngineNode,
  OutputNode,
} from '@/components/nodes';
import { NodeType, NodeConfig, DEFAULT_CONFIGS } from '@/types/workflow';
import { validateWorkflow, generateWorkflowJSON } from '@/utils/validation';

const nodeTypes: NodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llmEngine: LLMEngineNode,
  output: OutputNode,
};

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

export default function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Modal states
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    workflowJson?: string;
  }>({ isValid: false, errors: [] });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: { config: { ...DEFAULT_CONFIGS[type] } },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onUpdateConfig = useCallback(
    (nodeId: string, config: NodeConfig) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, config },
            };
          }
          return node;
        })
      );
      // Update selected node state as well
      setSelectedNode((prev) =>
        prev?.id === nodeId ? { ...prev, data: { ...prev.data, config } } : prev
      );
    },
    [setNodes]
  );

  const handleBuildStack = () => {
    const result = validateWorkflow(nodes, edges);
    if (result.isValid && result.workflow) {
      const json = generateWorkflowJSON(nodes, edges);
      console.log('Workflow JSON:', json);
      setValidationResult({
        isValid: true,
        errors: [],
        workflowJson: json,
      });
    } else {
      setValidationResult({
        isValid: false,
        errors: result.errors,
      });
    }
    setIsValidationModalOpen(true);
  };

  const handleChatWithStack = () => {
    setIsChatModalOpen(true);
  };

  const minimapNodeColor = useCallback((node: Node) => {
    switch (node.type) {
      case 'userQuery':
        return 'hsl(142, 76%, 36%)';
      case 'knowledgeBase':
        return 'hsl(262, 83%, 58%)';
      case 'llmEngine':
        return 'hsl(217, 91%, 60%)';
      case 'output':
        return 'hsl(25, 95%, 53%)';
      default:
        return 'hsl(215, 16%, 47%)';
    }
  }, []);
  const [session, setSession] = useState<any>(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
  });

  supabase.auth.onAuthStateChange((_e, s) => setSession(s));
}, []);

  if (!session) return <Auth />;


  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <TopBar
      onBuildStack={handleBuildStack}
      onChatWithStack={handleChatWithStack}
      onWorkflowSelect={(id) => setCurrentWorkflowId(id)}
      onLoadWorkflow={(data) => {
  const fixedNodes = (data.nodes || []).map((n, i) => ({
    ...n,
    position: n.position || { x: 100 + i * 80, y: 100 }
  }));

  const fixedEdges = (data.edges || []).map((e, i) => ({
    ...e,
    id: e.id || `e-${e.source}-${e.target}-${i}`
  }));

  setNodes(fixedNodes);
  setEdges(fixedEdges);
}}




      />

      
      <div className="flex flex-1 min-h-0 w-full">
        <LeftSidebar onDragStart={onDragStart} />
        
        <main className="flex-1 min-w-0" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            className="bg-canvas"
          >
            <Controls className="!bottom-4 !left-4" />
            <MiniMap 
              nodeColor={minimapNodeColor}
              nodeStrokeWidth={3}
              className="!bottom-4 !right-4"
            />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          </ReactFlow>
        </main>
        
        <RightSidebar
          selectedNode={selectedNode}
          onUpdateConfig={onUpdateConfig}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        isValid={validationResult.isValid}
        errors={validationResult.errors}
        workflowJson={validationResult.workflowJson}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        nodes={nodes}
        edges={edges}
        workflowId={currentWorkflowId}
      />
    </div>
  );
}
