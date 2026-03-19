from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List


@CrewBase
class ProjectGuardianCrew:
    """Project Guardian AI — Multi-Agent Risk Analysis Crew."""

    agents: List[BaseAgent]
    tasks: List[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # ── Agents ────────────────────────────────────────────────────────────────

    @agent
    def market_analysis_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["market_analysis_agent"],  # type: ignore[index]
            verbose=True,
            reasoning=True,
        )

    @agent
    def risk_scoring_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["risk_scoring_agent"],  # type: ignore[index]
            verbose=True,
        )

    @agent
    def project_tracking_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["project_tracking_agent"],  # type: ignore[index]
            verbose=True,
        )

    @agent
    def reporting_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["reporting_agent"],  # type: ignore[index]
            verbose=True,
        )

    @agent
    def chat_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["chat_agent"],  # type: ignore[index]
            verbose=False,
        )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    @task
    def market_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config["market_analysis_task"],  # type: ignore[index]
        )

    @task
    def risk_scoring_task(self) -> Task:
        return Task(
            config=self.tasks_config["risk_scoring_task"],  # type: ignore[index]
        )

    @task
    def project_tracking_task(self) -> Task:
        return Task(
            config=self.tasks_config["project_tracking_task"],  # type: ignore[index]
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config["reporting_task"],  # type: ignore[index]
            context=[
                self.market_analysis_task(),
                self.risk_scoring_task(),
                self.project_tracking_task(),
            ],
            markdown=True,
        )

    @task
    def chat_task(self) -> Task:
        return Task(
            config=self.tasks_config["chat_task"],  # type: ignore[index]
            markdown=True,
        )

    # ── Crews ─────────────────────────────────────────────────────────────────

    @crew
    def full_analysis_crew(self) -> Crew:
        """Full 4-agent sequential risk analysis."""
        return Crew(
            agents=[
                self.market_analysis_agent(),
                self.risk_scoring_agent(),
                self.project_tracking_agent(),
                self.reporting_agent(),
            ],
            tasks=[
                self.market_analysis_task(),
                self.risk_scoring_task(),
                self.project_tracking_task(),
                self.reporting_task(),
            ],
            process=Process.sequential,
            verbose=True,
        )

    def chat_crew(self) -> Crew:
        """Single-agent chat crew."""
        return Crew(
            agents=[self.chat_agent()],
            tasks=[self.chat_task()],
            process=Process.sequential,
            verbose=False,
        )
