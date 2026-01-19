import { LLM_MODELS, WEB_SEARCH_PROVIDERS, LLMEngineConfig } from '@/types/workflow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Globe, Brain } from 'lucide-react';

interface LLMEngineConfigPanelProps {
  config: LLMEngineConfig;
  onChange: (config: LLMEngineConfig) => void;
}

export function LLMEngineConfigPanel({ config, onChange }: LLMEngineConfigPanelProps) {
  const updateConfig = (key: keyof LLMEngineConfig, value: unknown) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="p-4 space-y-5">
      <div className="space-y-1.5">
        <Label className="config-label">Name</Label>
        <Input
          value={config.name}
          onChange={(e) => updateConfig('name', e.target.value)}
          placeholder="Enter node name"
          className="config-input"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">Description</Label>
        <Textarea
          value={config.description}
          onChange={(e) => updateConfig('description', e.target.value)}
          placeholder="Describe this node..."
          className="config-input min-h-[80px] resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">Model</Label>
        <Select
          value={config.model}
          onValueChange={(value) => updateConfig('model', value)}
        >
          <SelectTrigger className="config-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LLM_MODELS.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="config-label mb-0">Temperature</Label>
          <span className="text-xs text-muted-foreground font-medium">
            {config.temperature.toFixed(1)}
          </span>
        </div>
        <Slider
          value={[config.temperature]}
          onValueChange={([value]) => updateConfig('temperature', value)}
          min={0}
          max={2}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="config-label mb-0">Max Tokens</Label>
          <span className="text-xs text-muted-foreground font-medium">
            {config.maxTokens.toLocaleString()}
          </span>
        </div>
        <Slider
          value={[config.maxTokens]}
          onValueChange={([value]) => updateConfig('maxTokens', value)}
          min={128}
          max={4096}
          step={128}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>128</span>
          <span>4096</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">System Prompt</Label>
        <Textarea
          value={config.systemPrompt}
          onChange={(e) => updateConfig('systemPrompt', e.target.value)}
          placeholder="Define the AI's behavior and context..."
          className="config-input min-h-[100px] resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="config-label">User Prompt Template</Label>
        <Textarea
          value={config.userPromptTemplate}
          onChange={(e) => updateConfig('userPromptTemplate', e.target.value)}
          placeholder="Template for user prompts..."
          className="config-input min-h-[80px] resize-none"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label className="text-sm font-medium text-foreground">
              Use Context
            </Label>
            <p className="text-xs text-muted-foreground">
              Use knowledge base context
            </p>
          </div>
        </div>
        <Switch
          checked={config.useContext}
          onCheckedChange={(checked) => updateConfig('useContext', checked)}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label className="text-sm font-medium text-foreground">
              Web Search
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable real-time web access
            </p>
          </div>
        </div>
        <Switch
          checked={config.enableWebSearch}
          onCheckedChange={(checked) => updateConfig('enableWebSearch', checked)}
        />
      </div>

      {config.enableWebSearch && (
        <div className="space-y-1.5">
          <Label className="config-label">Web Search Provider</Label>
          <Select
            value={config.webSearchProvider}
            onValueChange={(value) => updateConfig('webSearchProvider', value)}
          >
            <SelectTrigger className="config-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEB_SEARCH_PROVIDERS.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
