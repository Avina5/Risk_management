import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.ok) {
        navigate('/dashboard');
      } else {
        setError(result.error ?? 'Invalid email or password.');
      }
    }, 600);
  };

  const fillDemo = () => {
    setEmail('admin@riskpulse.ai');
    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[hsl(215,28%,7%)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 border-r border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,60%)]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(217,91%,60%)] opacity-5 blur-[100px] rounded-full pointer-events-none" />

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-white text-xs transition-colors w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </button>

        <div className="space-y-6">
          <div className="h-12 w-12 rounded-xl bg-[hsl(217,91%,60%)] flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Your AI-powered<br />risk command center
            </h2>
            <p className="text-white/50 text-sm mt-3 leading-relaxed max-w-xs">
              Four specialized agents monitor your entire project portfolio in real time, surfacing risks before they escalate.
            </p>
          </div>
          <div className="space-y-3">
            {[
              'Real-time portfolio risk scoring',
              'Automated agent reasoning traces',
              'Instant critical alerts',
              'Mitigation plan tracking',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 text-white/60 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-[hsl(217,91%,60%)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-[11px]">RiskPulse AI © 2026</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-[hsl(217,91%,60%)] flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">RiskPulse AI</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-white/50 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 p-3 rounded-lg border border-[hsl(217,91%,60%)]/20 bg-[hsl(217,91%,60%)]/5">
            <p className="text-[11px] text-white/50 mb-1.5">Demo credentials</p>
            <p className="text-[11px] text-white/70 font-mono">admin@riskpulse.ai / demo1234</p>
            <button
              onClick={fillDemo}
              className="text-[11px] text-[hsl(217,91%,60%)] hover:underline mt-1"
            >
              Fill automatically →
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(217,91%,60%)] focus:ring-[hsl(217,91%,60%)]"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Password</Label>
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10 focus:border-[hsl(217,91%,60%)] focus:ring-[hsl(217,91%,60%)]"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  onClick={() => setShowPass(s => !s)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white text-sm mt-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-[11px] text-white/30 mt-6">
            By signing in you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
