import type { Project, RiskEntry, AgentActivityLog, Alert, RiskReport, AgentInfo, MitigationPlan, RiskHistoryPoint } from '@/types/risk';

export const projects: Project[] = [
  { id: 'p1', name: 'CloudMigrate Pro', status: 'at-risk', startDate: '2025-09-01', endDate: '2026-06-30', budget: 2400000, client: 'Acme Corp', projectManager: 'Sarah Chen', riskScore: 82, riskTrend: 'up', primaryRiskFactor: 'Resource attrition' },
  { id: 'p2', name: 'FinTech Gateway', status: 'active', startDate: '2025-11-15', endDate: '2026-08-15', budget: 1800000, client: 'Global Finance Ltd', projectManager: 'James Rodriguez', riskScore: 67, riskTrend: 'up', primaryRiskFactor: 'Market volatility' },
  { id: 'p3', name: 'Healthcare Portal v3', status: 'active', startDate: '2026-01-10', endDate: '2026-09-30', budget: 950000, client: 'MedFirst Inc', projectManager: 'Aisha Patel', riskScore: 34, riskTrend: 'down', primaryRiskFactor: 'None significant' },
  { id: 'p4', name: 'RetailEdge POS', status: 'at-risk', startDate: '2025-07-01', endDate: '2026-04-30', budget: 3100000, client: 'RetailMax', projectManager: 'David Kim', riskScore: 91, riskTrend: 'up', primaryRiskFactor: 'Payment delay' },
  { id: 'p5', name: 'LogiTrack Fleet', status: 'active', startDate: '2025-12-01', endDate: '2026-07-31', budget: 1200000, client: 'TransGlobal Logistics', projectManager: 'Maria Santos', riskScore: 45, riskTrend: 'stable', primaryRiskFactor: 'Schedule compression' },
  { id: 'p6', name: 'EduConnect LMS', status: 'active', startDate: '2026-02-01', endDate: '2026-10-15', budget: 780000, client: 'UniTech Education', projectManager: 'Tom Baker', riskScore: 28, riskTrend: 'down', primaryRiskFactor: 'None significant' },
  { id: 'p7', name: 'SmartFactory IoT', status: 'at-risk', startDate: '2025-10-15', endDate: '2026-05-30', budget: 4500000, client: 'IndustrialPrime', projectManager: 'Elena Volkov', riskScore: 76, riskTrend: 'up', primaryRiskFactor: 'Supply chain disruption' },
  { id: 'p8', name: 'CyberShield v2', status: 'active', startDate: '2026-01-05', endDate: '2026-08-20', budget: 2100000, client: 'SecureNet Corp', projectManager: 'Marcus Johnson', riskScore: 52, riskTrend: 'stable', primaryRiskFactor: 'Regulatory changes' },
  { id: 'p9', name: 'GreenEnergy Dashboard', status: 'active', startDate: '2025-11-01', endDate: '2026-06-15', budget: 650000, client: 'EcoVolt Solutions', projectManager: 'Linda Park', riskScore: 19, riskTrend: 'down', primaryRiskFactor: 'None significant' },
  { id: 'p10', name: 'BankCore Modernization', status: 'at-risk', startDate: '2025-06-01', endDate: '2026-12-31', budget: 8200000, client: 'National First Bank', projectManager: 'Richard Wong', riskScore: 88, riskTrend: 'up', primaryRiskFactor: 'Scope creep' },
  { id: 'p11', name: 'TravelHub Platform', status: 'active', startDate: '2026-01-20', endDate: '2026-09-01', budget: 1450000, client: 'Wanderlust Inc', projectManager: 'Sarah Chen', riskScore: 41, riskTrend: 'stable', primaryRiskFactor: 'API dependency' },
  { id: 'p12', name: 'InsureTech Claims', status: 'on-hold', startDate: '2025-08-15', endDate: '2026-07-01', budget: 3400000, client: 'Pacific Insurance', projectManager: 'James Rodriguez', riskScore: 63, riskTrend: 'stable', primaryRiskFactor: 'Budget constraint' },
  { id: 'p13', name: 'AgriSense Monitor', status: 'active', startDate: '2026-02-15', endDate: '2026-11-30', budget: 520000, client: 'FarmTech Co', projectManager: 'Aisha Patel', riskScore: 22, riskTrend: 'down', primaryRiskFactor: 'None significant' },
  { id: 'p14', name: 'MediaStream CDN', status: 'active', startDate: '2025-10-01', endDate: '2026-05-15', budget: 1900000, client: 'StreamMax Media', projectManager: 'David Kim', riskScore: 58, riskTrend: 'up', primaryRiskFactor: 'Performance bottleneck' },
  { id: 'p15', name: 'GovPortal Citizen', status: 'active', startDate: '2025-09-15', endDate: '2026-08-30', budget: 5600000, client: 'Dept of Digital', projectManager: 'Elena Volkov', riskScore: 71, riskTrend: 'up', primaryRiskFactor: 'Compliance gap' },
];

export const riskEntries: RiskEntry[] = [
  { id: 'r1', projectId: 'p1', type: 'resource', severity: 'critical', score: 85, description: '2 senior engineers resigned; no backfill pipeline.', mitigationStrategy: 'Engage contract staffing agency; redistribute workload among existing team.', sourceAgent: 'Project Tracking', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-17T14:00:00Z' },
  { id: 'r2', projectId: 'p1', type: 'schedule', severity: 'warning', score: 70, description: 'Sprint velocity dropped 30% over last 3 sprints.', mitigationStrategy: 'Reduce scope for next release; prioritize critical path items.', sourceAgent: 'Project Tracking', createdAt: '2026-03-14T09:00:00Z', updatedAt: '2026-03-16T11:00:00Z' },
  { id: 'r3', projectId: 'p2', type: 'market', severity: 'warning', score: 65, description: 'New EU payment regulations may affect integration timeline.', mitigationStrategy: 'Pre-compliance audit with legal team; modular architecture for regulation layer.', sourceAgent: 'Market Analysis', createdAt: '2026-03-16T08:45:00Z', updatedAt: '2026-03-16T08:45:00Z' },
  { id: 'r4', projectId: 'p4', type: 'payment', severity: 'critical', score: 92, description: 'Client has missed 2 consecutive milestone payments totaling $620K.', mitigationStrategy: 'Escalate to executive sponsor; prepare project pause contingency.', sourceAgent: 'Risk Scoring', createdAt: '2026-03-13T16:20:00Z', updatedAt: '2026-03-17T09:30:00Z' },
  { id: 'r5', projectId: 'p4', type: 'resource', severity: 'warning', score: 60, description: 'Team morale declining due to payment uncertainty.', mitigationStrategy: 'Transparent communication from leadership; retention bonuses for key staff.', sourceAgent: 'Project Tracking', createdAt: '2026-03-15T14:00:00Z', updatedAt: '2026-03-15T14:00:00Z' },
  { id: 'r6', projectId: 'p7', type: 'market', severity: 'warning', score: 72, description: 'IoT chip supplier reported 8-week delivery delays.', mitigationStrategy: 'Source alternative suppliers; redesign with available components.', sourceAgent: 'Market Analysis', createdAt: '2026-03-12T11:15:00Z', updatedAt: '2026-03-16T10:00:00Z' },
  { id: 'r7', projectId: 'p10', type: 'schedule', severity: 'critical', score: 88, description: 'Scope increased 40% without timeline extension.', mitigationStrategy: 'Change request board review; phased delivery approach.', sourceAgent: 'Project Tracking', createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-03-17T16:00:00Z' },
  { id: 'r8', projectId: 'p10', type: 'payment', severity: 'warning', score: 65, description: 'Budget overrun projected at 25% by Q3.', mitigationStrategy: 'Cost optimization review; renegotiate vendor contracts.', sourceAgent: 'Risk Scoring', createdAt: '2026-03-14T13:00:00Z', updatedAt: '2026-03-14T13:00:00Z' },
  { id: 'r9', projectId: 'p15', type: 'market', severity: 'warning', score: 68, description: 'WCAG 2.2 compliance deadline moved up by 3 months.', mitigationStrategy: 'Accelerate accessibility audit; dedicated compliance sprint.', sourceAgent: 'Market Analysis', createdAt: '2026-03-11T10:30:00Z', updatedAt: '2026-03-15T12:00:00Z' },
  { id: 'r10', projectId: 'p8', type: 'market', severity: 'stable', score: 48, description: 'New zero-day vulnerability class discovered in target stack.', mitigationStrategy: 'Update threat model; accelerate penetration testing phase.', sourceAgent: 'Market Analysis', createdAt: '2026-03-16T07:30:00Z', updatedAt: '2026-03-16T07:30:00Z' },
];

export const alerts: Alert[] = [
  { id: 'a1', projectId: 'p4', projectName: 'RetailEdge POS', severity: 'critical', message: 'Payment default detected: 2 missed milestone payments ($620K outstanding)', acknowledged: false, createdAt: '2026-03-17T09:30:00Z' },
  { id: 'a2', projectId: 'p10', projectName: 'BankCore Modernization', severity: 'critical', message: 'Scope creep alert: 40% scope increase with no timeline adjustment', acknowledged: false, createdAt: '2026-03-17T08:00:00Z' },
  { id: 'a3', projectId: 'p1', projectName: 'CloudMigrate Pro', severity: 'critical', message: 'Resource crisis: 2 senior engineers departed, critical skills gap', acknowledged: true, createdAt: '2026-03-16T14:20:00Z' },
  { id: 'a4', projectId: 'p7', projectName: 'SmartFactory IoT', severity: 'warning', message: 'Supply chain delay: IoT chip delivery pushed 8 weeks', acknowledged: false, createdAt: '2026-03-16T10:15:00Z' },
  { id: 'a5', projectId: 'p2', projectName: 'FinTech Gateway', severity: 'warning', message: 'Regulatory change: EU payment directive may impact Q2 deliverables', acknowledged: false, createdAt: '2026-03-16T08:50:00Z' },
  { id: 'a6', projectId: 'p15', projectName: 'GovPortal Citizen', severity: 'warning', message: 'Compliance deadline accelerated: WCAG 2.2 due 3 months earlier', acknowledged: true, createdAt: '2026-03-15T12:30:00Z' },
  { id: 'a7', projectId: 'p14', projectName: 'MediaStream CDN', severity: 'warning', message: 'Performance degradation: P95 latency exceeding SLA thresholds', acknowledged: false, createdAt: '2026-03-15T09:45:00Z' },
];

export const agentActivities: AgentActivityLog[] = [
  { id: 'al1', agentName: 'Market Analysis', actionType: 'trend_scan', reasoningTrace: 'Scanned 142 financial news sources. Detected EU payment directive draft with 87% probability of affecting cross-border fintech projects. Cross-referenced with project P2 (FinTech Gateway) integration requirements.', projectId: 'p2', projectName: 'FinTech Gateway', timestamp: '2026-03-17T08:45:00Z', dataSources: ['Reuters API', 'EU Legislative Tracker', 'Bloomberg Terminal'] },
  { id: 'al2', agentName: 'Risk Scoring', actionType: 'score_update', reasoningTrace: 'Recalculated risk score for RetailEdge POS. Payment factor weighted at 0.4 due to consecutive missed payments. Combined with resource morale indicator (0.2 weight) yields composite score of 91.', projectId: 'p4', projectName: 'RetailEdge POS', timestamp: '2026-03-17T09:30:00Z', dataSources: ['Payment Ledger', 'HR Sentiment Survey', 'Project Velocity Tracker'] },
  { id: 'al3', agentName: 'Project Tracking', actionType: 'velocity_analysis', reasoningTrace: 'Sprint velocity for CloudMigrate Pro dropped from 45 to 31 story points over 3 sprints. Root cause: 2 senior engineer departures on Mar 5 and Mar 12. Knowledge transfer incomplete for 3 critical microservices.', projectId: 'p1', projectName: 'CloudMigrate Pro', timestamp: '2026-03-17T10:30:00Z', dataSources: ['Jira API', 'HR System', 'Git Commit History'] },
  { id: 'al4', agentName: 'Reporting', actionType: 'report_generation', reasoningTrace: 'Generated weekly portfolio risk report. 4 projects in critical zone (score >75), 3 in warning zone (50-75). Portfolio weighted risk score increased 12% week-over-week. Flagged RetailEdge POS and BankCore Modernization for executive review.', projectId: null, projectName: null, timestamp: '2026-03-17T06:00:00Z', dataSources: ['Risk Score DB', 'Project Status DB', 'Alert History'] },
  { id: 'al5', agentName: 'Market Analysis', actionType: 'supply_chain_monitor', reasoningTrace: 'Detected TSMC capacity constraint announcement affecting IoT chip production. Cross-referenced with SmartFactory IoT bill of materials. 3 of 7 critical components sourced from affected production line.', projectId: 'p7', projectName: 'SmartFactory IoT', timestamp: '2026-03-16T11:15:00Z', dataSources: ['TSMC Investor Relations', 'Industry Supply Chain DB', 'Component BOM Registry'] },
  { id: 'al6', agentName: 'Project Tracking', actionType: 'scope_analysis', reasoningTrace: 'BankCore Modernization backlog grew from 340 to 476 items (+40%). No corresponding timeline or resource adjustment detected. Current burn rate projects completion at Feb 2027, exceeding deadline by 2 months.', projectId: 'p10', projectName: 'BankCore Modernization', timestamp: '2026-03-16T09:00:00Z', dataSources: ['Jira API', 'Resource Allocation DB', 'Project Charter'] },
  { id: 'al7', agentName: 'Risk Scoring', actionType: 'batch_recalculation', reasoningTrace: 'Nightly batch recalculation for all 15 active projects. 3 scores increased (P1 +5, P7 +3, P15 +4), 2 decreased (P3 -2, P9 -3). Portfolio average risk score: 56.1 (prev: 53.8).', projectId: null, projectName: null, timestamp: '2026-03-16T02:00:00Z', dataSources: ['All Project Data', 'Market Indicators', 'HR Systems'] },
  { id: 'al8', agentName: 'Market Analysis', actionType: 'compliance_scan', reasoningTrace: 'WCAG 2.2 enforcement timeline revised by accessibility regulatory body. New deadline 3 months earlier than projected. Impact assessment: GovPortal Citizen (P15) accessibility sprint must accelerate.', projectId: 'p15', projectName: 'GovPortal Citizen', timestamp: '2026-03-15T12:00:00Z', dataSources: ['Regulatory Gazette', 'W3C Updates', 'Gov Compliance Portal'] },
];

export const agents: AgentInfo[] = [
  { name: 'Market Analysis', status: 'live', lastActivity: '2026-03-17T08:45:00Z', activityCount24h: 23, description: 'Monitors financial markets, regulatory changes, and supply chain news to detect external risk factors.', dataSources: ['Reuters API', 'Bloomberg Terminal', 'EU Legislative Tracker', 'TSMC Investor Relations', 'Regulatory Gazettes', 'W3C Updates'] },
  { name: 'Risk Scoring', status: 'live', lastActivity: '2026-03-17T09:30:00Z', activityCount24h: 18, description: 'Computes composite risk scores using weighted multi-factor models across payment, resource, schedule, and market dimensions.', dataSources: ['Payment Ledger', 'HR Sentiment Survey', 'Project Velocity Tracker', 'Market Risk Index'] },
  { name: 'Project Tracking', status: 'live', lastActivity: '2026-03-17T10:30:00Z', activityCount24h: 31, description: 'Tracks internal project health indicators including velocity, resource changes, and scope evolution.', dataSources: ['Jira API', 'HR System', 'Git Commit History', 'Resource Allocation DB', 'Project Charter'] },
  { name: 'Reporting', status: 'idle', lastActivity: '2026-03-17T06:00:00Z', activityCount24h: 4, description: 'Generates structured risk reports, executive summaries, and trend analyses on demand and on schedule.', dataSources: ['Risk Score DB', 'Project Status DB', 'Alert History', 'Agent Activity Logs'] },
];

export const mitigationPlans: MitigationPlan[] = [
  { id: 'm1', projectId: 'p1', riskEntryId: 'r1', title: 'Emergency Staffing Pipeline', description: 'Engage 2 contract staffing agencies for senior cloud engineers. Target 2-week placement.', status: 'in-progress', assignee: 'Sarah Chen', createdAt: '2026-03-15T11:00:00Z', updatedAt: '2026-03-17T09:00:00Z' },
  { id: 'm2', projectId: 'p1', riskEntryId: 'r2', title: 'Scope Reduction Sprint', description: 'Identify and defer non-critical features from next 2 releases. Focus on core migration path.', status: 'proposed', assignee: 'Sarah Chen', createdAt: '2026-03-16T14:00:00Z', updatedAt: '2026-03-16T14:00:00Z' },
  { id: 'm3', projectId: 'p4', riskEntryId: 'r4', title: 'Executive Payment Escalation', description: 'Direct engagement between CFO and RetailMax CFO. Payment plan proposal with milestone restructuring.', status: 'in-progress', assignee: 'David Kim', createdAt: '2026-03-14T10:00:00Z', updatedAt: '2026-03-17T08:00:00Z' },
  { id: 'm4', projectId: 'p10', riskEntryId: 'r7', title: 'Change Control Board Review', description: 'Convene CCB to evaluate scope additions. Propose phased delivery with revised milestones.', status: 'proposed', assignee: 'Richard Wong', createdAt: '2026-03-16T10:00:00Z', updatedAt: '2026-03-16T10:00:00Z' },
  { id: 'm5', projectId: 'p7', riskEntryId: 'r6', title: 'Alternative Supplier Evaluation', description: 'Evaluate 3 alternative IoT chip suppliers. Prototype with STMicroelectronics components.', status: 'in-progress', assignee: 'Elena Volkov', createdAt: '2026-03-13T09:00:00Z', updatedAt: '2026-03-16T15:00:00Z' },
];

export const riskReports: RiskReport[] = [
  { id: 'rr1', projectId: null, projectName: null, reportType: 'portfolio', summary: 'Weekly portfolio risk assessment shows 4 critical projects requiring executive attention. Overall portfolio risk increased 12% WoW.', content: {}, dateRange: { start: '2026-03-10', end: '2026-03-17' }, createdAt: '2026-03-17T06:00:00Z' },
  { id: 'rr2', projectId: 'p4', projectName: 'RetailEdge POS', reportType: 'project', summary: 'Critical payment risk: $620K outstanding. Project pause contingency recommended if payment not received by Mar 25.', content: {}, dateRange: { start: '2026-03-01', end: '2026-03-17' }, createdAt: '2026-03-17T07:00:00Z' },
  { id: 'rr3', projectId: null, projectName: null, reportType: 'trend-analysis', summary: 'Q1 2026 risk trends: Market risks up 18% driven by regulatory changes. Resource risks stable. Payment risks concentrated in 2 projects.', content: {}, dateRange: { start: '2026-01-01', end: '2026-03-17' }, createdAt: '2026-03-15T06:00:00Z' },
  { id: 'rr4', projectId: 'p1', projectName: 'CloudMigrate Pro', reportType: 'project', summary: 'Resource attrition causing velocity decline. Staffing mitigation in progress. Schedule risk elevated.', content: {}, dateRange: { start: '2026-03-01', end: '2026-03-15' }, createdAt: '2026-03-15T07:00:00Z' },
];

export const riskHistory: Record<string, RiskHistoryPoint[]> = {
  p1: [
    { date: '2026-01-01', score: 35, market: 20, resource: 30, schedule: 40, payment: 15 },
    { date: '2026-01-15', score: 38, market: 22, resource: 35, schedule: 42, payment: 15 },
    { date: '2026-02-01', score: 45, market: 25, resource: 50, schedule: 48, payment: 18 },
    { date: '2026-02-15', score: 55, market: 28, resource: 62, schedule: 55, payment: 20 },
    { date: '2026-03-01', score: 68, market: 30, resource: 75, schedule: 65, payment: 22 },
    { date: '2026-03-15', score: 82, market: 32, resource: 85, schedule: 70, payment: 25 },
  ],
  p4: [
    { date: '2026-01-01', score: 42, market: 20, resource: 25, schedule: 30, payment: 55 },
    { date: '2026-01-15', score: 48, market: 22, resource: 28, schedule: 32, payment: 65 },
    { date: '2026-02-01', score: 58, market: 25, resource: 30, schedule: 35, payment: 78 },
    { date: '2026-02-15', score: 72, market: 28, resource: 40, schedule: 38, payment: 88 },
    { date: '2026-03-01', score: 85, market: 30, resource: 50, schedule: 40, payment: 92 },
    { date: '2026-03-15', score: 91, market: 32, resource: 60, schedule: 42, payment: 92 },
  ],
};

// Default history for projects without specific data
export function getRiskHistory(projectId: string): RiskHistoryPoint[] {
  if (riskHistory[projectId]) return riskHistory[projectId];
  const project = projects.find(p => p.id === projectId);
  if (!project) return [];
  const score = project.riskScore;
  return [
    { date: '2026-01-01', score: Math.max(10, score - 25), market: score * 0.3, resource: score * 0.25, schedule: score * 0.25, payment: score * 0.2 },
    { date: '2026-01-15', score: Math.max(10, score - 20), market: score * 0.32, resource: score * 0.26, schedule: score * 0.26, payment: score * 0.21 },
    { date: '2026-02-01', score: Math.max(10, score - 15), market: score * 0.34, resource: score * 0.28, schedule: score * 0.28, payment: score * 0.22 },
    { date: '2026-02-15', score: Math.max(10, score - 10), market: score * 0.36, resource: score * 0.3, schedule: score * 0.3, payment: score * 0.23 },
    { date: '2026-03-01', score: Math.max(10, score - 5), market: score * 0.38, resource: score * 0.32, schedule: score * 0.32, payment: score * 0.24 },
    { date: '2026-03-15', score, market: score * 0.4, resource: score * 0.35, schedule: score * 0.35, payment: score * 0.25 },
  ];
}

export const mockChatResponses: Record<string, string> = {
  default: "I can help you analyze project risks across your portfolio. Try asking about specific projects, risk categories, or overall portfolio health.",
  risk_status: "## Portfolio Risk Summary\n\nAs of today, your portfolio risk score stands at **56.1** (up 4.3% from last week).\n\n### Critical Projects (Score > 75)\n- 🔴 **RetailEdge POS** — 91 (Payment default)\n- 🔴 **BankCore Modernization** — 88 (Scope creep)\n- 🔴 **CloudMigrate Pro** — 82 (Resource attrition)\n- 🔴 **SmartFactory IoT** — 76 (Supply chain)\n\n### Recommended Actions\n1. Escalate RetailEdge payment issue to executive level\n2. Convene change control board for BankCore scope\n3. Fast-track contractor hiring for CloudMigrate",
  delayed: "## Projects with Resource-Related Delays\n\n| Project | Risk Score | Issue | Impact |\n|---------|-----------|-------|--------|\n| CloudMigrate Pro | 82 | 2 senior engineers resigned | Velocity down 30% |\n| RetailEdge POS | 91 | Team morale declining | Delivery at risk |\n\n### Root Cause Analysis\nThe **Project Tracking Agent** identified that resource attrition is concentrated in cloud infrastructure roles, a market-wide talent squeeze confirmed by the **Market Analysis Agent**.",
};
