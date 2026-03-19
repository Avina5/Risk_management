export type RiskSeverity = 'critical' | 'warning' | 'stable';
export type RiskType = 'market' | 'resource' | 'schedule' | 'payment';
export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'at-risk';
export type AgentName = 'Market Analysis' | 'Risk Scoring' | 'Project Tracking' | 'Reporting';
export type AgentStatus = 'live' | 'idle' | 'error';
export type MitigationStatus = 'proposed' | 'in-progress' | 'resolved';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  client: string;
  projectManager: string;
  riskScore: number;
  riskTrend: 'up' | 'down' | 'stable';
  primaryRiskFactor: string;
}

export interface RiskEntry {
  id: string;
  projectId: string;
  type: RiskType;
  severity: RiskSeverity;
  score: number;
  description: string;
  mitigationStrategy: string;
  sourceAgent: AgentName;
  createdAt: string;
  updatedAt: string;
}

export interface AgentActivityLog {
  id: string;
  agentName: AgentName;
  actionType: string;
  reasoningTrace: string;
  projectId: string | null;
  projectName?: string;
  timestamp: string;
  dataSources: string[];
}

export interface Alert {
  id: string;
  projectId: string;
  projectName: string;
  severity: RiskSeverity;
  message: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface RiskReport {
  id: string;
  projectId: string | null;
  projectName: string | null;
  reportType: 'portfolio' | 'project' | 'trend-analysis';
  summary: string;
  content: Record<string, unknown>;
  dateRange: { start: string; end: string };
  createdAt: string;
}

export interface AgentInfo {
  name: AgentName;
  status: AgentStatus;
  lastActivity: string;
  activityCount24h: number;
  description: string;
  dataSources: string[];
}

export interface MitigationPlan {
  id: string;
  projectId: string;
  riskEntryId: string;
  title: string;
  description: string;
  status: MitigationStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskHistoryPoint {
  date: string;
  score: number;
  market: number;
  resource: number;
  schedule: number;
  payment: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
