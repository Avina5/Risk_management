import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { projects, alerts } from '@/data/mockData';
import type { RiskSeverity } from '@/types/risk';

function getSeverityFromScore(score: number): RiskSeverity {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'warning';
  return 'stable';
}

const severityConfig = {
  critical: { label: 'Critical', bg: 'bg-risk-critical/10', text: 'risk-critical', border: 'border-risk-critical' },
  warning: { label: 'Warning', bg: 'bg-risk-warning/10', text: 'risk-warning', border: 'border-risk-warning' },
  stable: { label: 'Stable', bg: 'bg-risk-stable/10', text: 'risk-stable', border: 'border-risk-stable' },
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 risk-critical" />;
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 risk-stable" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const criticalCount = projects.filter(p => p.riskScore >= 75).length;
  const warningCount = projects.filter(p => p.riskScore >= 50 && p.riskScore < 75).length;
  const stableCount = projects.filter(p => p.riskScore < 50).length;
  const avgScore = Math.round(projects.reduce((s, p) => s + p.riskScore, 0) / projects.length);
  const topRisk = [...projects].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  const recentAlerts = [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="text-sm text-muted-foreground">Real-time portfolio risk monitoring across {projects.length} projects</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Portfolio Risk Score</p>
                <p className="text-3xl font-bold font-mono mt-1">{avgScore}</p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${severityConfig[getSeverityFromScore(avgScore)].bg}`}>
                <Activity className={`h-5 w-5 ${severityConfig[getSeverityFromScore(avgScore)].text}`} />
              </div>
            </div>
          </CardContent>
        </Card>
        {[
          { label: 'Critical', count: criticalCount, severity: 'critical' as const, icon: AlertTriangle },
          { label: 'Warning', count: warningCount, severity: 'warning' as const, icon: AlertTriangle },
          { label: 'Stable', count: stableCount, severity: 'stable' as const, icon: Shield },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{item.label} Projects</p>
                  <p className="text-3xl font-bold font-mono mt-1">{item.count}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${severityConfig[item.severity].bg}`}>
                  <item.icon className={`h-5 w-5 ${severityConfig[item.severity].text}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Project Risk Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {projects.map(project => {
                const sev = getSeverityFromScore(project.riskScore);
                return (
                  <button
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className={`p-3 rounded-lg border-l-[3px] ${severityConfig[sev].border} ${severityConfig[sev].bg} text-left hover:opacity-80 transition-opacity`}
                  >
                    <p className="text-[10px] font-medium truncate text-foreground">{project.name}</p>
                    <p className={`text-lg font-bold font-mono ${severityConfig[sev].text}`}>{project.riskScore}</p>
                    <TrendIcon trend={project.riskTrend} />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 risk-critical" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              <div className="px-4 pb-4 space-y-2">
                {recentAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      alert.severity === 'critical' ? 'bg-risk-critical/10 border-risk-critical/30' : 'bg-risk-warning/10 border-risk-warning/30'
                    } ${alert.acknowledged ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{alert.projectName}</span>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${alert.severity === 'critical' ? 'risk-critical border-risk-critical' : 'risk-warning border-risk-warning'}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{alert.message}</p>
                    <p className="text-muted-foreground/60 font-mono text-[9px]">
                      {new Date(alert.createdAt).toLocaleDateString()} {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Top At-Risk Projects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Top At-Risk Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {topRisk.map((project, i) => {
              const sev = getSeverityFromScore(project.riskScore);
              return (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                    <TrendIcon trend={project.riskTrend} />
                  </div>
                  <p className="text-sm font-semibold truncate">{project.name}</p>
                  <p className={`text-2xl font-bold font-mono ${severityConfig[sev].text}`}>{project.riskScore}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{project.primaryRiskFactor}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
