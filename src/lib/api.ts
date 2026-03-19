/**
 * RiskPulse AI — API client
 * Connects the React frontend to the FastAPI / CrewAI backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProjectPayload {
  project_id: string;
  project_name: string;
  client: string;
  project_manager: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: string;
  risk_score: number;
  risk_trend: string;
  primary_risk_factor: string;
}

export interface AgentJob {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  started_at?: string;
  completed_at?: string;
}

export interface ChatResponse {
  role: 'assistant';
  content: string;
  timestamp: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'API error');
  }
  return res.json();
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'API error');
  }
  return res.json();
}

// ── Job polling ───────────────────────────────────────────────────────────────

/**
 * Poll a job until it completes or fails.
 * @param jobId  - job_id returned by an agent endpoint
 * @param onUpdate - called on each poll with the latest job state
 * @param intervalMs - polling interval (default 2s)
 */
export async function pollJob(
  jobId: string,
  onUpdate: (job: AgentJob) => void,
  intervalMs = 2000,
): Promise<AgentJob> {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const job = await get<AgentJob>(`/jobs/${jobId}`);
        onUpdate(job);
        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(timer);
          resolve(job);
        }
      } catch (err) {
        clearInterval(timer);
        reject(err);
      }
    }, intervalMs);
  });
}

// ── Agent endpoints ───────────────────────────────────────────────────────────

/** Trigger the Market Analysis agent for one project. */
export const runMarketAnalysis = (project: ProjectPayload) =>
  post<AgentJob>('/agents/market-analysis', { project });

/** Trigger the Risk Scoring agent for one project. */
export const runRiskScoring = (project: ProjectPayload) =>
  post<AgentJob>('/agents/risk-scoring', { project });

/** Trigger the Project Tracking agent for one project. */
export const runProjectTracking = (project: ProjectPayload) =>
  post<AgentJob>('/agents/project-tracking', { project });

/**
 * Run all 4 agents sequentially (full analysis).
 * This is the most comprehensive — use for deep-dive reports.
 */
export const runFullAnalysis = (project: ProjectPayload, portfolioContext = '') =>
  post<AgentJob>('/agents/full-analysis', { project, portfolio_context: portfolioContext });

// ── Chat endpoint ─────────────────────────────────────────────────────────────

/** Send a message to the AI Risk Advisor chat agent. */
export const sendChatMessage = (message: string, portfolioContext = '') =>
  post<ChatResponse>('/agents/chat', {
    message,
    portfolio_context: portfolioContext,
  });

// ── Portfolio ─────────────────────────────────────────────────────────────────

/** Get a plain-text portfolio summary to inject as agent context. */
export const getPortfolioSummary = (projects: ProjectPayload[]) =>
  post<{ summary: string }>('/portfolio/summarize', projects);

/** Health check */
export const healthCheck = () => get<{ status: string }>('/health');
