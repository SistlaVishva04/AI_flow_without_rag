import { EMBEDDING_MODELS, VECTOR_STORES, KnowledgeBaseConfig } from '@/types/workflow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FileText, Database } from 'lucide-react';
import {useState} from 'react';
interface KnowledgeBaseConfigPanelProps {
  config: KnowledgeBaseConfig;
  onChange: (config: KnowledgeBaseConfig) => void;
}

export function KnowledgeBaseConfigPanel({ config, onChange }: KnowledgeBaseConfigPanelProps) {
  const updateConfig = (key: keyof KnowledgeBaseConfig, value: unknown) => {
    onChange({ ...config, [key]: value });
  };
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
  try {
    setUploading(true);
    setUploadError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) throw new Error("Not authenticated");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/workflow/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    onChange({
      ...config,
      fileId: data.fileId,
      fileName: data.fileName,
    });
  } catch (err) {
    console.error(err);
    setUploadError("Upload failed");
  } finally {
    setUploading(false);
  }
};



  return (
    <div className="p-4 space-y-5">
      <div className="space-y-1.5">
        <Label className="config-label">Name</Label>
        <Input
          value={config.name}
          onChange={(e) => updateConfig('name', e.target.value)}
          placeholder="Enter knowledge base name"
          className="config-input"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">Description</Label>
        <Textarea
          value={config.description}
          onChange={(e) => updateConfig('description', e.target.value)}
          placeholder="Describe this knowledge base..."
          className="config-input min-h-[80px] resize-none"
        />
      </div>

      <div className="space-y-2">
    <Label className="config-label">Upload PDF</Label>

    <Input
    type="file"
    accept="application/pdf"
    onChange={(e) => {
      if (e.target.files?.[0]) {
        handleFileUpload(e.target.files[0]);
      }
    }}
    className="config-input"
  />

  {uploading && (
    <p className="text-xs text-muted-foreground">Uploading...</p>
  )}

  {uploadError && (
    <p className="text-xs text-red-500">{uploadError}</p>
  )}

  {config.fileId && (
    <div className="p-2 rounded bg-muted/50 text-xs">
      <p><b>File:</b> {config.fileName}</p>
      <p><b>ID:</b> {config.fileId}</p>
    </div>
  )}
</div>


      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="config-label mb-0">Chunk Size</Label>
          <span className="text-xs text-muted-foreground font-medium">
            {config.chunkSize} tokens
          </span>
        </div>
        <Slider
          value={[config.chunkSize]}
          onValueChange={([value]) => updateConfig('chunkSize', value)}
          min={100}
          max={2000}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100</span>
          <span>2000</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="config-label mb-0">Chunk Overlap</Label>
          <span className="text-xs text-muted-foreground font-medium">
            {config.chunkOverlap} tokens
          </span>
        </div>
        <Slider
          value={[config.chunkOverlap]}
          onValueChange={([value]) => updateConfig('chunkOverlap', value)}
          min={0}
          max={200}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>200</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">Embedding Model</Label>
        <Select
          value={config.embeddingModel}
          onValueChange={(value) => updateConfig('embeddingModel', value)}
        >
          <SelectTrigger className="config-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EMBEDDING_MODELS.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">Vector Store</Label>
        <Select
          value={config.vectorStore}
          onValueChange={(value) => updateConfig('vectorStore', value)}
        >
          <SelectTrigger className="config-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VECTOR_STORES.map((store) => (
              <SelectItem key={store} value={store}>
                {store}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="config-label mb-0">Top K Results</Label>
          <span className="text-xs text-muted-foreground font-medium">
            {config.topK}
          </span>
        </div>
        <Slider
          value={[config.topK]}
          onValueChange={([value]) => updateConfig('topK', value)}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label className="text-sm font-medium text-foreground">
              Enable Context
            </Label>
            <p className="text-xs text-muted-foreground">
              Pass context to LLM
            </p>
          </div>
        </div>
        <Switch
          checked={config.enableContext}
          onCheckedChange={(checked) => updateConfig('enableContext', checked)}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">Namespace</Label>
        <Input
          value={config.namespace}
          onChange={(e) => updateConfig('namespace', e.target.value)}
          placeholder="default"
          className="config-input"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <Label className="text-sm font-medium text-foreground">
            Enabled
          </Label>
          <p className="text-xs text-muted-foreground">
            Enable this node
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => updateConfig('enabled', checked)}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">Version</Label>
        <Input
          value={config.version}
          onChange={(e) => updateConfig('version', e.target.value)}
          placeholder="1.0"
          className="config-input"
        />
      </div>
    </div>
  );
}
