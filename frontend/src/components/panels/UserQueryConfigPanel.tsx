import { UserQueryConfig } from '@/types/workflow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MessageSquare } from 'lucide-react';

interface UserQueryConfigPanelProps {
  config: UserQueryConfig;
  onChange: (config: UserQueryConfig) => void;
}

export function UserQueryConfigPanel({ config, onChange }: UserQueryConfigPanelProps) {
  const updateConfig = (key: keyof UserQueryConfig, value: unknown) => {
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
        <Label className="config-label">Placeholder Text</Label>
        <Input
          value={config.placeholder}
          onChange={(e) => updateConfig('placeholder', e.target.value)}
          placeholder="Ask your question"
          className="config-input"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label className="text-sm font-medium text-foreground">
              Required
            </Label>
            <p className="text-xs text-muted-foreground">
              User must provide input
            </p>
          </div>
        </div>
        <Switch
          checked={config.required}
          onCheckedChange={(checked) => updateConfig('required', checked)}
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
