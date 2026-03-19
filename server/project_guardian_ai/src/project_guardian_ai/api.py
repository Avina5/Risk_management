"""
RiskPulse AI — FastAPI server
Exposes REST endpoints for the multi-agent CrewAI backend.
"""

import os
import json
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from .crew import ProjectGuardianCrew  # noqa: E402

# ── App setup ─────────────────────────────────────────────────────────────────

app = FastAPI(
    title="RiskPulse AI API",
    description="Multi-Agent Risk Monitoring — CrewAI Backend",
    version="1.0.0",
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)

# In-memory job store (replace with Redis/DB in production)
_jobs: dict[str, dict] = {}


# ── Request / Response models ─────────────────────────────────────────────────

class ProjectInput(BaseModel):
    project_id: str
    project_name: str
    client: str
    project_manager: str
    budget: float
    start_date: str
    end_date: str
    status: str
    risk_score: int
    risk_trend: str
    primary_risk_factor: str


class ChatRequest(BaseModel):
    message: str
    portfolio_context: Optional[str] = ""


class MarketAnalysisRequest(BaseModel):
    project: ProjectInput


class RiskScoringRequest(BaseModel):
    project: ProjectInput


class ProjectTrackingRequest(BaseModel):
    project: ProjectInput


class FullAnalysisRequest(BaseModel):
    project: ProjectInput
    portfolio_context: Optional[str] = ""


class AgentResponse(BaseModel):
    job_id: str
    status: str          # "queued" | "running" | "completed" | "failed"
    result: Optional[str] = None
    error: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _project_inputs(p: ProjectInput, extra: dict | None = None) -> dict:
    base = {
        "project_name": p.project_name,
        "client": p.client,
        "project_manager": p.project_manager,
        "budget": f"{p.budget:,.0f}",
        "start_date": p.start_date,
        "end_date": p.end_date,
        "status": p.status,
        "risk_score": p.risk_score,
        "risk_trend": p.risk_trend,
        "primary_risk_factor": p.primary_risk_factor,
    }
    if extra:
        base.update(extra)
    return base


def _new_job(job_id: str) -> dict:
    job = {
        "job_id": job_id,
        "status": "queued",
        "result": None,
        "error": None,
        "started_at": datetime.utcnow().isoformat(),
        "completed_at": None,
    }
    _jobs[job_id] = job
    return job


def _run_crew_task(job_id: str, crew_fn, inputs: dict):
    """Runs a crew task synchronously inside a background thread."""
    _jobs[job_id]["status"] = "running"
    try:
        result = crew_fn(inputs)
        _jobs[job_id]["status"] = "completed"
        _jobs[job_id]["result"] = result.raw if hasattr(result, "raw") else str(result)
    except Exception as exc:
        _jobs[job_id]["status"] = "failed"
        _jobs[job_id]["error"] = str(exc)
    finally:
        _jobs[job_id]["completed_at"] = datetime.utcnow().isoformat()


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
def health():
    return {"status": "ok", "service": "RiskPulse AI API", "version": "1.0.0"}


# ── Job status ────────────────────────────────────────────────────────────────

@app.get("/jobs/{job_id}", response_model=AgentResponse, tags=["Jobs"])
def get_job(job_id: str):
    """Poll the status of any async agent job."""
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


# ── Agent: Market Analysis ────────────────────────────────────────────────────

@app.post("/agents/market-analysis", response_model=AgentResponse, tags=["Agents"])
def run_market_analysis(req: MarketAnalysisRequest, background_tasks: BackgroundTasks):
    """
    Trigger the Market Analysis Agent for a specific project.
    Returns a job_id — poll /jobs/{job_id} for the result.
    """
    job_id = f"market_{req.project.project_id}_{int(datetime.utcnow().timestamp())}"
    job = _new_job(job_id)

    crew = ProjectGuardianCrew()
    inputs = _project_inputs(req.project)

    background_tasks.add_task(
        _run_crew_task,
        job_id,
        lambda i: crew.full_analysis_crew().tasks[0].execute_sync(agent=crew.market_analysis_agent(), context=i),
        inputs,
    )
    return job


# ── Agent: Risk Scoring ───────────────────────────────────────────────────────

@app.post("/agents/risk-scoring", response_model=AgentResponse, tags=["Agents"])
def run_risk_scoring(req: RiskScoringRequest, background_tasks: BackgroundTasks):
    """
    Trigger the Risk Scoring Agent for a specific project.
    Returns a job_id — poll /jobs/{job_id} for the result.
    """
    job_id = f"scoring_{req.project.project_id}_{int(datetime.utcnow().timestamp())}"
    job = _new_job(job_id)

    crew = ProjectGuardianCrew()
    inputs = _project_inputs(req.project)

    background_tasks.add_task(
        _run_crew_task,
        job_id,
        lambda i: crew.risk_scoring_agent().kickoff(
            f"Score the risk for project: {json.dumps(i)}"
        ),
        inputs,
    )
    return job


# ── Agent: Project Tracking ───────────────────────────────────────────────────

@app.post("/agents/project-tracking", response_model=AgentResponse, tags=["Agents"])
def run_project_tracking(req: ProjectTrackingRequest, background_tasks: BackgroundTasks):
    """
    Trigger the Project Tracking Agent for a specific project.
    Returns a job_id — poll /jobs/{job_id} for the result.
    """
    job_id = f"tracking_{req.project.project_id}_{int(datetime.utcnow().timestamp())}"
    job = _new_job(job_id)

    crew = ProjectGuardianCrew()
    inputs = _project_inputs(req.project)

    background_tasks.add_task(
        _run_crew_task,
        job_id,
        lambda i: crew.project_tracking_agent().kickoff(
            f"Assess project health for: {json.dumps(i)}"
        ),
        inputs,
    )
    return job


# ── Agent: Full Analysis (all 4 agents) ──────────────────────────────────────

@app.post("/agents/full-analysis", response_model=AgentResponse, tags=["Agents"])
def run_full_analysis(req: FullAnalysisRequest, background_tasks: BackgroundTasks):
    """
    Run all 4 agents sequentially (market → scoring → tracking → reporting).
    This is the most comprehensive analysis. Returns a job_id.
    """
    job_id = f"full_{req.project.project_id}_{int(datetime.utcnow().timestamp())}"
    job = _new_job(job_id)

    crew = ProjectGuardianCrew()
    inputs = _project_inputs(req.project, {"portfolio_context": req.portfolio_context or ""})

    background_tasks.add_task(
        _run_crew_task,
        job_id,
        lambda i: crew.full_analysis_crew().kickoff(inputs=i),
        inputs,
    )
    return job


# ── Agent: Chat ───────────────────────────────────────────────────────────────

@app.post("/agents/chat", tags=["Chat"])
def chat(req: ChatRequest):
    """
    Synchronous chat endpoint — the AI Risk Advisor answers portfolio questions.
    Suitable for real-time chat UI (responds in ~2-5s).
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    crew = ProjectGuardianCrew()
    inputs = {
        "user_message": req.message,
        "portfolio_context": req.portfolio_context or "No portfolio context provided.",
    }

    try:
        result = crew.chat_crew().kickoff(inputs=inputs)
        return {
            "role": "assistant",
            "content": result.raw if hasattr(result, "raw") else str(result),
            "timestamp": datetime.utcnow().isoformat(),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(exc)}")


# ── Portfolio summary (used as context by agents) ─────────────────────────────

@app.post("/portfolio/summarize", tags=["Portfolio"])
def summarize_portfolio(projects: list[ProjectInput]):
    """
    Accepts the full project list and returns a plain-text portfolio summary
    suitable for injecting as context into agent prompts.
    """
    if not projects:
        return {"summary": "No projects in portfolio."}

    critical = [p for p in projects if p.risk_score >= 75]
    warning = [p for p in projects if 50 <= p.risk_score < 75]
    stable = [p for p in projects if p.risk_score < 50]
    avg = sum(p.risk_score for p in projects) / len(projects)

    lines = [
        f"Portfolio: {len(projects)} projects | Avg risk score: {avg:.1f}",
        f"Critical ({len(critical)}): {', '.join(p.project_name for p in critical)}",
        f"Warning ({len(warning)}): {', '.join(p.project_name for p in warning)}",
        f"Stable ({len(stable)}): {len(stable)} projects",
        "",
        "Top risks:",
    ]
    for p in sorted(projects, key=lambda x: x.risk_score, reverse=True)[:5]:
        lines.append(f"  - {p.project_name} [{p.risk_score}] — {p.primary_risk_factor}")

    return {"summary": "\n".join(lines)}
