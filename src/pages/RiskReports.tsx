import { useState } from 'react';
import { FileBarChart, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { riskReports, projects } from '@/data/mockData';

const reportTypeLabels: Record<string, string> = {
  portfolio: 'Portfolio',
  project: 'Project',
  'trend-analysis': 'Trend Analysis',
};

const reportTypeColors: Record<string, string> = {
  portfolio: 'bg-accent/10 text-accent',
  project: 'bg-muted text-muted-foreground',
  'trend-analysis': 'bg-risk-warning/10 risk-warning',
};

export default function RiskReports() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const filtered = riskReports.filter(r => typeFilter === 'all' || r.reportType === typeFilter);
  const detail = selectedReport ? riskReports.find(r => r.id === selectedReport) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Risk Reports</h1>
          <p className="text-sm text-muted-foreground">AI-generated risk analysis and trend reports</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report List */}
        <div className="space-y-3">
          {filtered.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedReport === report.id ? 'border-accent bg-accent/5' : 'bg-card hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge className={`text-[9px] ${reportTypeColors[report.reportType]}`}>
                  {reportTypeLabels[report.reportType]}
                </Badge>
                <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              {report.projectName && (
                <p className="text-[10px] text-accent font-medium mb-1">{report.projectName}</p>
              )}
              <p className="text-xs text-foreground leading-relaxed">{report.summary}</p>
              <p className="text-[9px] text-muted-foreground/60 font-mono mt-2">
                Period: {report.dateRange.start} → {report.dateRange.end}
              </p>
            </button>
          ))}
        </div>

        {/* Report Detail */}
        <Card className={`${detail ? '' : 'flex items-center justify-center'}`}>
          {detail ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileBarChart className="h-4 w-4 text-accent" />
                  <CardTitle className="text-sm font-semibold">Report Detail</CardTitle>
                </div>
                <Badge className={`text-[9px] w-fit ${reportTypeColors[detail.reportType]}`}>
                  {reportTypeLabels[detail.reportType]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {detail.projectName && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Project</p>
                    <p className="text-sm font-semibold">{detail.projectName}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Executive Summary</p>
                  <p className="text-xs leading-relaxed">{detail.summary}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Period</p>
                  <p className="text-xs font-mono">{detail.dateRange.start} — {detail.dateRange.end}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Generated</p>
                  <p className="text-xs font-mono">{new Date(detail.createdAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="text-center py-12">
              <FileBarChart className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Select a report to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
