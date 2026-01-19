import { MessageSquare, Workflow, Zap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  onBuildStack: () => void;
  onChatWithStack: () => void;
  onLoadWorkflow: (data: any) => void;
  onWorkflowSelect: (id: string) => void;
}

export function TopBar({
  onBuildStack,
  onChatWithStack,
  onLoadWorkflow,
  onWorkflowSelect
}: TopBarProps) {

  const [workflows, setWorkflows] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch("http://127.0.0.1:8000/workflow/list", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      const data = await res.json();
      setWorkflows(Array.isArray(data) ? data : []);
    };

    load();
  }, []);

  const loadWorkflow = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch(`http://127.0.0.1:8000/workflow/${id}`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    });

    const wf = await res.json();
    const data = JSON.parse(wf.data);

    onWorkflowSelect(id);
    onLoadWorkflow(data);
  };

  // 🔥 LOGOUT FUNCTION
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Workflow className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground leading-tight">
              AI Workflow Builder
            </h1>
            <p className="text-xs text-muted-foreground">
              Visual AI Pipeline Orchestration
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">

        <Select onValueChange={loadWorkflow}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="History" />
          </SelectTrigger>
          <SelectContent>
            {workflows.map(wf => (
              <SelectItem key={wf.id} value={wf.id}>
                {wf.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={onBuildStack}
          variant="outline"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
        >
          <Zap className="w-4 h-4" />
          Build Stack
        </Button>

        <Button
          onClick={onChatWithStack}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="w-4 h-4" />
          Chat with Stack
        </Button>

        {/* 🔥 LOGOUT BUTTON */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="gap-2 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>

      </div>
    </header>
  );
}
