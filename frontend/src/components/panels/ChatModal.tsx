import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: any[];
  edges: any[];
  workflowId: string | null;   // 🔥 NEW
}

export function ChatModal({
  isOpen,
  onClose,
  nodes,
  edges,
  workflowId,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔥 Load chat history when modal opens
  useEffect(() => {
  if (!isOpen || !workflowId) return;

  (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`http://127.0.0.1:8000/chat/${workflowId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const history: Message[] = data.flatMap((log: any) => [
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: log.query,
        timestamp: new Date(log.created_at),
      },
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: log.answer,
        timestamp: new Date(log.created_at),
      },
    ]);

    setMessages(history);
  })();
}, [isOpen, workflowId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch("http://127.0.0.1:8000/workflow/execute", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          },
        body: JSON.stringify({
          nodes,
          edges,
          query: userMessage.content,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer || "No response",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 🔥 Save chat to backend
      if (workflowId) {
        await fetch("http://127.0.0.1:8000/chat/save", {
          method: "POST",
          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
},

          body: JSON.stringify({
            workflow_id: workflowId,
            query: userMessage.content,
            answer: assistantMessage.content,
          }),
        });
      }

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "Backend error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Chat with Stack
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-10 h-10 text-primary mb-3" />
              <p className="text-sm text-muted-foreground">
                Start a conversation
              </p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && <Bot className="w-6 h-6 text-primary" />}
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && <User className="w-6 h-6" />}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
