import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, DollarSign, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { projects, riskEntries, agentActivities, mitigationPlans, getRiskHistory } from '@/data/mockData';
import type { RiskSeverity, RiskType, MitigationStatus } from '@/types/risk';

const severityConfig = {
  critical: { bg: 'bg-risk-critical/10', text: 'risk-critical', border: 'border-risk-critical' },
  warning: { bg: 'bg-risk-warning/10', text: 'risk-warning', border: 'border-risk-warning' },
  stable: { bg: 'bg-risk-stable/10', text: 'risk-stable', border: 'border-risk-stable' },
};

const riskTypeLabels: Record<RiskType, string> = { market: 'Market', resource: 'Resource', schedule: 'Schedule', payment: 'Payment' };
const riskTypeIcons: Record<RiskType, string> = { market: '📊', resource: '👥', schedule: '📅', payment: '💰' };
const mitigationStatusColor: Record<MitigationStatus, string> = { proposed: 'bg-muted text-muted-foreground', 'in-progress': 'bg-accent/10 text-accent', resolved: 'bg-risk-stable/10 risk-stable' };

function getSeverity(score: number): RiskSeverity {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'warning';
  return 'stable';
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  if (!project) return <div className="p-6">Project not found</div>;

  const risks = riskEntries.filter(r => r.projectId === id);
  const activities = agentActivities.filter(a => a.projectId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const mitigations = mitigationPlans.filter(m => m.projectId === id);
  const history = getRiskHistory(id);
  const sev = getSeverity(project.riskScore);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground">
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-3 w-3" />{project.projectManager}</span>
            <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${(project.budget / 1000000).toFixed(1)}M</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.startDate} → {project.endDate}</span>
            <Badge variant="outline" className="text-[10px]">{project.client}</Badge>
          </div>
        </div>
        <div className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${severityConfig[sev].border} ${severityConfig[sev].bg}`}>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Risk Score</p>
            <p className={`text-4xl font-bold font-mono ${severityConfig[sev].text}`}>{project.riskScore}</p>
          </div>
          {project.riskTrend === 'up' && <TrendingUp className="h-5 w-5 risk-critical" />}
          {project.riskTrend === 'down' && <TrendingDown className="h-5 w-5 risk-stable" />}
          {project.riskTrend === 'stable' && <Minus className="h-5 w-5 text-muted-foreground" />}
        </div>
      </div>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {(['market', 'resource', 'schedule', 'payment'] as RiskType[]).map(type => {
          const risk = risks.find(r => r.type === type);
          const score = risk?.score ?? 0;
          const rsev = getSeverity(score);
          return (
            <Card key={type} className={`border-l-[3px] ${risk ? severityConfig[rsev].border : 'border-muted'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{riskTypeIcons[type]}</span>
                  <span className="text-xs font-semibold">{riskTypeLabels[type]}</span>
                </div>
                <p className={`text-2xl font-bold font-mono ${risk ? severityConfig[rsev].text : 'text-muted-foreground'}`}>{score || '—'}</p>
                {risk && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{risk.description}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* History Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Risk Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Overall" />
                <Line type="monotone" dataKey="market" stroke="hsl(var(--risk-warning))" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Market" />
                <Line type="monotone" dataKey="resource" stroke="hsl(var(--risk-critical))" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Resource" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mitigation Plans */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Mitigation Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {mitigations.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No active mitigation plans</p>
            ) : (
              <div className="space-y-3">
                {mitigations.map(m => (
                  <div key={m.id} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold">{m.title}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${mitigationStatusColor[m.status]}`}>{m.status}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{m.description}</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-1 font-mono">Assigned: {m.assignee}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent Reasoning Trace */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Agent Reasoning Trace</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">No agent activity for this project</p>
          ) : (
            <div className="space-y-2">
              {activities.map(activity => (
                <Collapsible key={activity.id}>
                  <CollapsibleTrigger className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{activity.agentName}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{activity.actionType}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{activity.reasoningTrace.slice(0, 100)}...</p>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono shrink-0">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <div className="ml-5 mt-2 p-3 rounded bg-muted/50 text-xs text-muted-foreground leading-relaxed">
                      {activity.reasoningTrace}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {activity.dataSources.map(ds => (
                          <span key={ds} className="text-[9px] px-1.5 py-0.5 rounded bg-background font-mono">{ds}</span>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
