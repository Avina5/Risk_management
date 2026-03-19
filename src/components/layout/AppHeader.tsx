import { useState, useRef, useEffect } from 'react';
import { Bell, Search, MessageSquare, User, X, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { alerts, projects } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { ProfilePanel } from '@/components/layout/ProfilePanel';

interface AppHeaderProps {
  onToggleChat: () => void;
  chatOpen: boolean;
}

export function AppHeader({ onToggleChat, chatOpen }: AppHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifList, setNotifList] = useState(alerts);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unacknowledgedCount = notifList.filter(a => !a.acknowledged).length;

  const searchResults = searchQuery.trim().length > 1
    ? projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectManager.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const acknowledge = (id: string) => {
    setNotifList(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const acknowledgeAll = () => {
    setNotifList(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  return (
    <>
      <header className="h-14 border-b bg-card flex items-center gap-3 px-4 shrink-0 relative z-30">
        <SidebarTrigger className="text-muted-foreground" />

        {/* Search */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search projects, risks, reports..."
              className="h-8 pl-8 text-xs bg-muted/50 border-0"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
            />
            {searchQuery && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => { setSearchQuery(''); setSearchOpen(false); }}>
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-card border rounded-lg shadow-lg overflow-hidden">
              {searchResults.map(p => (
                <button
                  key={p.id}
                  className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center justify-between"
                  onClick={() => { navigate(`/project/${p.id}`); setSearchQuery(''); setSearchOpen(false); }}
                >
                  <div>
                    <p className="text-xs font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.client} · PM: {p.projectManager}</p>
                  </div>
                  <span className={`text-xs font-bold font-mono ${p.riskScore >= 75 ? 'text-red-500' : p.riskScore >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {p.riskScore}
                  </span>
                </button>
              ))}
            </div>
          )}
          {searchOpen && searchQuery.trim().length > 1 && searchResults.length === 0 && (
            <div className="absolute top-full mt-1 w-full bg-card border rounded-lg shadow-lg px-3 py-3 text-xs text-muted-foreground">
              No results for "{searchQuery}"
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8"
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unacknowledgedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-risk-critical text-[9px] font-bold text-white flex items-center justify-center">
                  {unacknowledgedCount}
                </span>
              )}
            </Button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-card border rounded-lg shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <span className="text-xs font-semibold">Notifications</span>
                  {unacknowledgedCount > 0 && (
                    <button className="text-[10px] text-accent hover:underline" onClick={acknowledgeAll}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifList.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No notifications</p>
                  )}
                  {notifList.map(alert => (
                    <div
                      key={alert.id}
                      className={`px-3 py-2.5 border-b last:border-0 flex gap-2 ${alert.acknowledged ? 'opacity-50' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {alert.severity === 'critical'
                          ? <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                          : <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium truncate">{alert.projectName}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{alert.message}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!alert.acknowledged && (
                        <button onClick={() => acknowledge(alert.id)} className="shrink-0 mt-0.5">
                          <Check className="h-3.5 w-3.5 text-muted-foreground hover:text-green-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat */}
          <Button
            variant={chatOpen ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={onToggleChat}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
          >
            <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-accent-foreground" />
            </div>
          </Button>
        </div>
      </header>

      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
