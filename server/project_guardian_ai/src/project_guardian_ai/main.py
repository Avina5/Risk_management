#!/usr/bin/env python
"""Entry point — run with: uvicorn project_guardian_ai.main:app --reload"""

import uvicorn
from .api import app  # noqa: F401 — re-exported for uvicorn


def run():
    """CrewAI CLI entry point (crewai run)."""
    uvicorn.run(
        "project_guardian_ai.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )


if __name__ == "__main__":
    run()
