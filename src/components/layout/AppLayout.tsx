import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { ChatPanel } from './ChatPanel';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader onToggleChat={() => setChatOpen(!chatOpen)} chatOpen={chatOpen} />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
            <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
