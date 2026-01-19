import { Node, Edge } from '@xyflow/react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  workflow?: {
    nodes: Node[];
    edges: Edge[];
  };
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: string[] = [];

  // Check for exactly one UserQuery node
  const userQueryNodes = nodes.filter(n => n.type === 'userQuery');
  if (userQueryNodes.length === 0) {
    errors.push('Workflow must have exactly one User Query node');
  } else if (userQueryNodes.length > 1) {
    errors.push('Workflow can only have one User Query node');
  }

  // Check for exactly one Output node
  const outputNodes = nodes.filter(n => n.type === 'output');
  if (outputNodes.length === 0) {
    errors.push('Workflow must have exactly one Output node');
  } else if (outputNodes.length > 1) {
    errors.push('Workflow can only have one Output node');
  }

  // Check for at least one LLM node
  const llmNodes = nodes.filter(n => n.type === 'llmEngine');
  if (llmNodes.length === 0) {
    errors.push('Workflow must have at least one LLM Engine node');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const userQueryNode = userQueryNodes[0];
  const outputNode = outputNodes[0];

  // Check for valid path from UserQuery to Output
  const hasPath = findPath(userQueryNode.id, outputNode.id, nodes, edges);
  if (!hasPath) {
    errors.push('No valid path exists from User Query to Output');
  }

  // Check for cycles
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push('Workflow contains a cycle, which is not allowed');
  }

  // Check that Output is the last node (no outgoing edges)
  const outputOutgoingEdges = edges.filter(e => e.source === outputNode.id);
  if (outputOutgoingEdges.length > 0) {
    errors.push('Output node must be the last node in the workflow (no outgoing connections)');
  }

  // Check that KnowledgeBase nodes appear before LLM nodes in the path
  const knowledgeBaseNodes = nodes.filter(n => n.type === 'knowledgeBase');
  for (const kbNode of knowledgeBaseNodes) {
    for (const llmNode of llmNodes) {
      // Check if there's a path from LLM to KB (which would be wrong)
      const wrongOrder = findPath(llmNode.id, kbNode.id, nodes, edges);
      if (wrongOrder) {
        errors.push('Knowledge Base nodes must appear before LLM Engine nodes in the workflow');
        break;
      }
    }
    if (errors.some(e => e.includes('Knowledge Base'))) break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    workflow: errors.length === 0 ? { nodes, edges } : undefined,
  };
}

function findPath(startId: string, endId: string, nodes: Node[], edges: Edge[]): boolean {
  const visited = new Set<string>();
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current === endId) {
      return true;
    }

    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    // Find all edges where current node is the source
    const outgoingEdges = edges.filter(e => e.source === current);
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return false;
}

function detectCycle(nodes: Node[], edges: Edge[]): boolean {
  const WHITE = 0; // Not visited
  const GRAY = 1;  // Being processed
  const BLACK = 2; // Finished processing

  const color = new Map<string, number>();
  nodes.forEach(node => color.set(node.id, WHITE));

  function dfs(nodeId: string): boolean {
    color.set(nodeId, GRAY);

    const outgoingEdges = edges.filter(e => e.source === nodeId);
    for (const edge of outgoingEdges) {
      const targetColor = color.get(edge.target);
      if (targetColor === GRAY) {
        return true; // Cycle detected
      }
      if (targetColor === WHITE && dfs(edge.target)) {
        return true;
      }
    }

    color.set(nodeId, BLACK);
    return false;
  }

  for (const node of nodes) {
    if (color.get(node.id) === WHITE) {
      if (dfs(node.id)) {
        return true;
      }
    }
  }

  return false;
}

export function generateWorkflowJSON(nodes: Node[], edges: Edge[]): string {
  const workflow = {
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        name: (node.data.config as any)?.name || '',
        description: (node.data.config as any)?.description || '',
        config: node.data.config,
      },
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };

  return JSON.stringify(workflow, null, 2);
}
