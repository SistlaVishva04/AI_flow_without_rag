export type NodeType = 'userQuery' | 'knowledgeBase' | 'llmEngine' | 'output';

// Global optional fields for all nodes
export interface GlobalNodeFields {
  enabled: boolean;
  version: string;
}

export interface UserQueryConfig extends GlobalNodeFields {
  name: string;
  description: string;
  placeholder: string;
  required: boolean;
}

export interface KnowledgeBaseConfig extends GlobalNodeFields {
  name: string;
  description: string;
  fileId: string;
  fileName: string;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  vectorStore: string;
  topK: number;
  enableContext: boolean;
  namespace: string;
}

export interface LLMEngineConfig extends GlobalNodeFields {
  name: string;
  description: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  userPromptTemplate: string;
  useContext: boolean;
  enableWebSearch: boolean;
  webSearchProvider: string;
}

export interface OutputConfig extends GlobalNodeFields {
  name: string;
  description: string;
  format: string;
  showSources: boolean;
  showTokens: boolean;
}

export type NodeConfig = UserQueryConfig | KnowledgeBaseConfig | LLMEngineConfig | OutputConfig;

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    name: string;
    description: string;
    config: NodeConfig;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface DraggableNodeItem {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
}

export const EMBEDDING_MODELS = [
  'openai',
  'gemini',
] as const;

export const VECTOR_STORES = [
  'chroma',
  'pinecone',
  'weaviate',
  'qdrant',
  'milvus',
  'faiss',
] as const;

export const LLM_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
] as const;

export const WEB_SEARCH_PROVIDERS = [
  'serpapi',
  'brave',
] as const;

export const OUTPUT_FORMATS = [
  'text',
  'markdown',
] as const;

export const DEFAULT_CONFIGS: Record<NodeType, NodeConfig> = {
  userQuery: {
    name: 'User Query',
    description: 'Entry point for user questions',
    placeholder: 'Ask your question',
    required: true,
    enabled: true,
    version: '1.0',
  } as UserQueryConfig,
  knowledgeBase: {
    name: 'Knowledge Base',
    description: 'Handle PDF based RAG',
    fileId: '',
    fileName: '',
    chunkSize: 500,
    chunkOverlap: 50,
    embeddingModel: 'openai',
    vectorStore: 'chroma',
    topK: 3,
    enableContext: true,
    namespace: 'default',
    enabled: true,
    version: '1.0',
  } as KnowledgeBaseConfig,
  llmEngine: {
    name: 'LLM Engine',
    description: 'Generate AI response',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 512,
    systemPrompt: '',
    userPromptTemplate: '',
    useContext: true,
    enableWebSearch: false,
    webSearchProvider: 'serpapi',
    enabled: true,
    version: '1.0',
  } as LLMEngineConfig,
  output: {
    name: 'Output',
    description: 'Display chat response',
    format: 'markdown',
    showSources: true,
    showTokens: false,
    enabled: true,
    version: '1.0',
  } as OutputConfig,
};
