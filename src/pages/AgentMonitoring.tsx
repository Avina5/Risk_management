import { useState } from 'react';
import { Bot, Clock, Activity, Database, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { agents, agentActivities } from '@/data/mockData';
import type { AgentName } from '@/types/risk';

const statusConfig = {
  live: { bg: 'bg-risk-stable', label: 'Live', ring: 'ring-risk-stable/30' },
  idle: { bg: 'bg-risk-warning', label: 'Idle', ring: 'ring-risk-warning/30' },
  error: { bg: 'bg-risk-critical', label: 'Error', ring: 'ring-risk-critical/30' },
};

export default function AgentMonitoring() {
  const [agentFilter, setAgentFilter] = useState<string>('all');

  const filteredActivities = agentActivities
    .filter(a => agentFilter === 'all' || a.agentName === agentFilter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Monitor</h1>
        <p className="text-sm text-muted-foreground">Real-time status and activity of all AI agents</p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map(agent => {
          const sc = statusConfig[agent.status];
          return (
            <Card key={agent.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${sc.bg} ring-4 ${sc.ring} ${agent.status === 'live' ? 'animate-pulse-live' : ''}`} />
                    <span className="text-[10px] font-medium uppercase text-muted-foreground">{sc.label}</span>
                  </div>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold mb-1">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">{agent.description}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(agent.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    {agent.activityCount24h} actions/24h
                  </span>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="w-full mt-3 flex items-center justify-center gap-1 text-[10px] text-accent hover:underline">
                    <Database className="h-3 w-3" /> Data Sources <ChevronDown className="h-3 w-3" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {agent.dataSources.map(ds => (
                        <span key={ds} className="text-[9px] px-1.5 py-0.5 rounded bg-muted font-mono text-muted-foreground">{ds}</span>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Activity Log</CardTitle>
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map(a => (
                  <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px]">Agent</TableHead>
                  <TableHead className="text-[10px]">Action</TableHead>
                  <TableHead className="text-[10px]">Project</TableHead>
                  <TableHead className="text-[10px]">Reasoning</TableHead>
                  <TableHead className="text-[10px]">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map(activity => (
                  <Collapsible key={activity.id} asChild>
                    <>
                      <CollapsibleTrigger asChild>
                        <TableRow className="cursor-pointer">
                          <TableCell className="text-xs font-medium">{activity.agentName}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[9px] font-mono">{activity.actionType}</Badge></TableCell>
                          <TableCell className="text-xs text-accent">{activity.projectName ?? '—'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">{activity.reasoningTrace.slice(0, 80)}...</TableCell>
                          <TableCell className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                            {new Date(activity.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30">
                            <div className="p-3 text-xs text-muted-foreground leading-relaxed">
                              {activity.reasoningTrace}
                              <div className="mt-2 flex flex-wrap gap-1">
                                {activity.dataSources.map(ds => (
                                  <span key={ds} className="text-[9px] px-1.5 py-0.5 rounded bg-background font-mono">{ds}</span>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
