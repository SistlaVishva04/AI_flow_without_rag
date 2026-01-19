import { CheckCircle, XCircle, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isValid: boolean;
  errors: string[];
  workflowJson?: string;
}

export function ValidationModal({
  isOpen,
  onClose,
  isValid,
  errors,
  workflowJson,
}: ValidationModalProps) {
  const handleCopyJson = () => {
    if (workflowJson) {
      navigator.clipboard.writeText(workflowJson);
      toast.success('Workflow JSON copied to clipboard!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isValid ? (
              <>
                <CheckCircle className="w-5 h-5 text-node-user-query" />
                <span>Workflow Validated Successfully</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-destructive" />
                <span>Validation Failed</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isValid ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your workflow is valid and ready for execution. Here's the workflow configuration:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64 font-mono">
                  {workflowJson}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyJson}
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Please fix the following issues:
              </p>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm bg-destructive/10 text-destructive p-3 rounded-lg"
                  >
                    <X className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>
            {isValid ? 'Done' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
