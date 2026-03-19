import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/types/risk';
import { mockChatResponses } from '@/data/mockData';
import { sendChatMessage, getPortfolioSummary } from '@/lib/api';
import { projects } from '@/data/mockData';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
}

const suggestedQueries = [
  "What's the overall risk status?",
  "Show delayed projects",
  "Top risks this week",
];

// Fallback when backend is unavailable
function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('status') || lower.includes('overview') || lower.includes('portfolio'))
    return mockChatResponses.risk_status;
  if (lower.includes('delay') || lower.includes('resource') || lower.includes('resign'))
    return mockChatResponses.delayed;
  return mockChatResponses.default;
}

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm your AI Risk Advisor. Ask me about project risks, portfolio health, or mitigation strategies.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check backend availability on open
  useEffect(() => {
    if (!open) return;
    fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/health`)
      .then(r => setBackendOnline(r.ok))
      .catch(() => setBackendOnline(false));
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let content: string;

      if (backendOnline) {
        // Build portfolio context string
        const payloads = projects.map(p => ({
          project_id: p.id,
          project_name: p.name,
          client: p.client,
          project_manager: p.projectManager,
          budget: p.budget,
          start_date: p.startDate,
          end_date: p.endDate,
          status: p.status,
          risk_score: p.riskScore,
          risk_trend: p.riskTrend,
          primary_risk_factor: p.primaryRiskFactor,
        }));
        const { summary } = await getPortfolioSummary(payloads);
        const response = await sendChatMessage(text, summary);
        content = response.content;
      } else {
        // Fallback to mock
        await new Promise(r => setTimeout(r, 800));
        content = getMockResponse(text);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(text),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="w-[380px] border-l bg-card flex flex-col h-full shrink-0">
      <div className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold">Risk Advisor AI</h2>
          {backendOnline !== null && (
            <span title={backendOnline ? 'Connected to backend' : 'Using offline mode'}>
              {backendOnline
                ? <Wifi className="h-3 w-3 text-green-500" />
                : <WifiOff className="h-3 w-3 text-muted-foreground" />}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-lg px-3 py-2 text-xs ${
                msg.role === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-xs prose-slate max-w-none [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-xs [&_h3]:font-semibold [&_p]:text-xs [&_li]:text-xs [&_table]:text-xs [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-muted-foreground mb-1.5">Suggested</p>
          <div className="flex flex-wrap gap-1">
            {suggestedQueries.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[10px] px-2 py-1 rounded-full border bg-background text-foreground hover:bg-muted transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border-t shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={backendOnline ? 'Ask the AI Risk Advisor...' : 'Ask about project risks...'}
            className="h-8 text-xs"
            disabled={loading}
          />
          <Button type="submit" size="icon" className="h-8 w-8 shrink-0" disabled={!input.trim() || loading}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
        {backendOnline === false && (
          <p className="text-[9px] text-muted-foreground mt-1.5 text-center">
            Offline mode — start the backend for AI responses
          </p>
        )}
      </div>
    </div>
  );
}
