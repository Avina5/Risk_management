import {
  LayoutDashboard, FolderKanban, FileBarChart, Bot, LogOut,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { agents } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { title: 'Command Center', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Projects', url: '/projects', icon: FolderKanban },
  { title: 'Risk Reports', url: '/reports', icon: FileBarChart },
  { title: 'Agent Monitor', url: '/agents', icon: Bot },
];

const statusColor: Record<string, string> = {
  live: 'bg-risk-stable',
  idle: 'bg-risk-warning',
  error: 'bg-risk-critical',
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Bot className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-sidebar-foreground">RiskPulse AI</h1>
              <p className="text-[10px] text-sidebar-foreground/60">Multi-Agent Risk System</p>
            </div>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center mx-auto">
            <Bot className="h-4 w-4 text-accent-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest">
              Agent Status
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-1 px-2">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-center gap-2 py-1.5 px-2 rounded-md text-xs">
                    <span className={`h-2 w-2 rounded-full ${statusColor[agent.status]} ${agent.status === 'live' ? 'animate-pulse-live' : ''}`} />
                    <span className="text-sidebar-foreground/80 truncate">{agent.name}</span>
                    <span className="ml-auto text-sidebar-foreground/40 font-mono text-[10px]">
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-semibold text-accent-foreground">
              PM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">Project Manager</p>
              <p className="text-[10px] text-sidebar-foreground/50">Leadership</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center justify-center w-full py-1.5 text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
