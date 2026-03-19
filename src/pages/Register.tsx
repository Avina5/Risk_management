import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!passwordRules.every(r => r.test(form.password))) {
      setError('Password does not meet the requirements.'); return;
    }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setTimeout(() => {
      const result = register(form.name.trim(), form.email.trim(), form.password);
      setLoading(false);
      if (!result.ok) {
        setError(result.error ?? 'Registration failed.');
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }, 600);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[hsl(215,28%,7%)] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-[hsl(160,84%,39%)]/15 flex items-center justify-center mx-auto">
            <CheckCircle className="h-7 w-7 text-[hsl(160,84%,39%)]" />
          </div>
          <h2 className="text-xl font-bold text-white">Account created!</h2>
          <p className="text-white/50 text-sm">Redirecting you to sign in...</p>
        </div>
      </div>
    );
  }

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
              Join RiskPulse AI<br />today
            </h2>
            <p className="text-white/50 text-sm mt-3 leading-relaxed max-w-xs">
              Get instant access to AI-powered risk monitoring across your entire project portfolio.
            </p>
          </div>
          <div className="space-y-3">
            {['Free to get started', 'No credit card required', 'Full platform access', 'Cancel anytime'].map(item => (
              <div key={item} className="flex items-center gap-2.5 text-white/60 text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-[hsl(160,84%,39%)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-[11px]">RiskPulse AI © 2026</p>
      </div>

      {/* Right panel */}
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
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
            <p className="text-white/50 text-sm mt-1">
              Already have one?{' '}
              <button onClick={() => navigate('/login')} className="text-[hsl(217,91%,60%)] hover:underline">
                Sign in
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Full Name</Label>
              <Input
                placeholder="Alex Johnson"
                className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(217,91%,60%)]"
                value={form.name}
                onChange={set('name')}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Email address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(217,91%,60%)]"
                value={form.email}
                onChange={set('email')}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Password</Label>
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10 focus:border-[hsl(217,91%,60%)]"
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  onClick={() => setShowPass(s => !s)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password strength indicators */}
              {form.password && (
                <div className="flex gap-3 pt-1">
                  {passwordRules.map(r => (
                    <span key={r.label} className={`flex items-center gap-1 text-[10px] ${r.test(form.password) ? 'text-[hsl(160,84%,39%)]' : 'text-white/30'}`}>
                      <CheckCircle className="h-2.5 w-2.5" /> {r.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/70">Confirm Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[hsl(217,91%,60%)]"
                value={form.confirm}
                onChange={set('confirm')}
              />
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
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-[11px] text-white/30 mt-6">
            By registering you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
