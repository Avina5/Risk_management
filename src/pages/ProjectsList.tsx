import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { projects as initialProjects } from '@/data/mockData';
import type { Project, RiskSeverity, ProjectStatus } from '@/types/risk';

const severityConfig = {
  critical: { bg: 'bg-risk-critical/10', text: 'risk-critical', border: 'border-risk-critical', label: 'Critical' },
  warning: { bg: 'bg-risk-warning/10', text: 'risk-warning', border: 'border-risk-warning', label: 'Warning' },
  stable: { bg: 'bg-risk-stable/10', text: 'risk-stable', border: 'border-risk-stable', label: 'Stable' },
};

function getSeverity(score: number): RiskSeverity {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'warning';
  return 'stable';
}

const emptyForm = {
  name: '',
  client: '',
  projectManager: '',
  startDate: '',
  endDate: '',
  budget: '',
  status: 'active' as ProjectStatus,
  primaryRiskFactor: 'None significant',
};

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sorted = [...projects].sort((a, b) => b.riskScore - a.riskScore);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.client.trim()) e.client = 'Required';
    if (!form.projectManager.trim()) e.projectManager = 'Required';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.endDate) e.endDate = 'Required';
    if (!form.budget || isNaN(Number(form.budget))) e.budget = 'Enter a valid number';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: form.name,
      client: form.client,
      projectManager: form.projectManager,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget),
      status: form.status,
      riskScore: 0,
      riskTrend: 'stable',
      primaryRiskFactor: form.primaryRiskFactor,
    };
    setProjects(prev => [newProject, ...prev]);
    setDialogOpen(false);
    setForm(emptyForm);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">All {projects.length} monitored projects</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setDialogOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(project => {
          const sev = getSeverity(project.riskScore);
          const sc = severityConfig[sev];
          return (
            <Card
              key={project.id}
              className={`cursor-pointer border-l-4 ${sc.border} hover:shadow-md transition-shadow`}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold truncate">{project.name}</p>
                  <Badge className={`text-[9px] ${sc.bg} ${sc.text} border-0`}>{sc.label}</Badge>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground">{project.client}</p>
                    <p className="text-[10px] text-muted-foreground">PM: {project.projectManager}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{project.primaryRiskFactor}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-2xl font-bold font-mono ${sc.text}`}>{project.riskScore}</span>
                    {project.riskTrend === 'up' && <TrendingUp className="h-4 w-4 risk-critical" />}
                    {project.riskTrend === 'down' && <TrendingDown className="h-4 w-4 risk-stable" />}
                    {project.riskTrend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Project Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Add New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { key: 'name', label: 'Project Name', type: 'text' },
              { key: 'client', label: 'Client', type: 'text' },
              { key: 'projectManager', label: 'Project Manager', type: 'text' },
              { key: 'budget', label: 'Budget ($)', type: 'number' },
              { key: 'startDate', label: 'Start Date', type: 'date' },
              { key: 'endDate', label: 'End Date', type: 'date' },
            ].map(({ key, label, type }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  type={type}
                  className="h-8 text-xs"
                  value={(form as any)[key]}
                  onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
                />
                {errors[key] && <p className="text-[10px] text-red-500">{errors[key]}</p>}
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ProjectStatus }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => { setDialogOpen(false); setErrors({}); }}>
              Cancel
            </Button>
            <Button size="sm" className="text-xs h-8" onClick={handleAdd}>
              Add Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
