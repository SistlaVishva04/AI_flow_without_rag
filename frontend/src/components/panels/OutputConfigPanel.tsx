import { OUTPUT_FORMATS, OutputConfig } from '@/types/workflow';
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
import { FileText, Hash } from 'lucide-react';

interface OutputConfigPanelProps {
  config: OutputConfig;
  onChange: (config: OutputConfig) => void;
}

export function OutputConfigPanel({ config, onChange }: OutputConfigPanelProps) {
  const updateConfig = (key: keyof OutputConfig, value: unknown) => {
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
        <Label className="config-label">Output Format</Label>
        <Select
          value={config.format}
          onValueChange={(value) => updateConfig('format', value)}
        >
          <SelectTrigger className="config-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OUTPUT_FORMATS.map((format) => (
              <SelectItem key={format} value={format}>
                {format}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label className="text-sm font-medium text-foreground">
              Show Sources
            </Label>
            <p className="text-xs text-muted-foreground">
              Display citation sources
            </p>
          </div>
        </div>
        <Switch
          checked={config.showSources}
          onCheckedChange={(checked) => updateConfig('showSources', checked)}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label className="text-sm font-medium text-foreground">
              Show Tokens
            </Label>
            <p className="text-xs text-muted-foreground">
              Display token usage
            </p>
          </div>
        </div>
        <Switch
          checked={config.showTokens}
          onCheckedChange={(checked) => updateConfig('showTokens', checked)}
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
