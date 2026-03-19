import { useNavigate } from 'react-router-dom';
import { Bot, Shield, TrendingUp, Zap, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Bot, title: 'Multi-Agent AI', desc: 'Four specialized agents continuously monitor market, resources, schedule, and payment risks.' },
  { icon: Shield, title: 'Real-Time Risk Scoring', desc: 'Dynamic composite risk scores updated as new signals are detected across your portfolio.' },
  { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Trend analysis and early warning systems surface risks before they become critical.' },
  { icon: BarChart3, title: 'Portfolio Dashboards', desc: 'Executive-level views across all projects with drill-down into individual risk factors.' },
  { icon: Zap, title: 'Instant Alerts', desc: 'Configurable notifications for threshold breaches, payment delays, and scope changes.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Shared mitigation plans and agent reasoning traces keep every stakeholder aligned.' },
];

const stats = [
  { value: '15+', label: 'Projects Monitored' },
  { value: '4', label: 'AI Agents Active' },
  { value: '92%', label: 'Risk Detection Rate' },
  { value: '<2s', label: 'Alert Latency' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(215,28%,7%)] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[hsl(217,91%,60%)] flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">RiskPulse AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-8"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-xs h-8 bg-transparent"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
          <Button
            size="sm"
            className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white text-xs h-8"
            onClick={() => navigate('/login')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-20">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[hsl(217,91%,60%)] opacity-10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsl(217,91%,60%)]/30 bg-[hsl(217,91%,60%)]/10 text-[hsl(217,91%,70%)] text-[11px] font-medium mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(217,91%,60%)] animate-pulse" />
          Multi-Agent Risk Intelligence Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight mb-6">
          Predict Risk Before It
          <span className="text-[hsl(217,91%,60%)]"> Becomes a Crisis</span>
        </h1>

        <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed mb-10">
          RiskPulse AI deploys four specialized agents to continuously scan your project portfolio,
          score risks in real time, and surface mitigation strategies before issues escalate.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            size="lg"
            className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white h-10 px-6 text-sm gap-2"
            onClick={() => navigate('/register')}
          >
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white h-10 px-6 text-sm bg-transparent"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 w-full max-w-2xl">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold font-mono text-[hsl(217,91%,60%)]">{s.value}</span>
              <span className="text-[11px] text-white/50 mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">Everything you need to stay ahead of risk</h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Purpose-built agents work around the clock so your team can focus on delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-[hsl(217,91%,60%)]/30 transition-all"
            >
              <div className="h-8 w-8 rounded-lg bg-[hsl(217,91%,60%)]/15 flex items-center justify-center mb-3">
                <f.icon className="h-4 w-4 text-[hsl(217,91%,60%)]" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-[12px] text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center rounded-2xl border border-[hsl(217,91%,60%)]/20 bg-[hsl(217,91%,60%)]/5 p-12">
          <h2 className="text-2xl font-bold mb-3">Ready to take control of project risk?</h2>
          <p className="text-white/50 text-sm mb-8">Sign in with the demo account to explore the full platform.</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            {['Real-time monitoring', 'AI-powered insights', 'Instant alerts'].map(t => (
              <span key={t} className="flex items-center gap-1 text-[11px] text-white/60">
                <CheckCircle className="h-3 w-3 text-[hsl(160,84%,39%)]" /> {t}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white h-10 px-8 text-sm gap-2"
              onClick={() => navigate('/register')}
            >
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white h-10 px-6 text-sm bg-transparent"
              onClick={() => navigate('/login')}
            >
              Sign In Instead
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[hsl(217,91%,60%)] flex items-center justify-center">
            <Bot className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs text-white/40">RiskPulse AI © 2026</span>
        </div>
        <p className="text-[11px] text-white/30">Multi-Agent Risk Intelligence</p>
      </footer>
    </div>
  );
}
