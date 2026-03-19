import { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, Building, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

export function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: currentUser?.name ?? 'Alex Johnson',
    email: currentUser?.email ?? 'admin@riskpulse.ai',
    phone: '+1 (555) 012-3456',
    role: 'Project Manager',
    department: 'Risk & Compliance',
    organization: 'RiskPulse AI',
  });
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync when user changes (e.g. after login)
  useEffect(() => {
    if (currentUser) {
      setProfile(p => ({ ...p, name: currentUser.name, email: currentUser.email }));
    }
  }, [currentUser]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-4 top-16 z-50 w-80 bg-card border rounded-xl shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-sm font-semibold">Profile</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">{profile.name}</p>
            <p className="text-[10px] text-muted-foreground">{profile.role}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Full Name
            </Label>
            <Input
              className="h-8 text-xs"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> Email
            </Label>
            <Input
              className="h-8 text-xs"
              value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" /> Phone
            </Label>
            <Input
              className="h-8 text-xs"
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3" /> Department
            </Label>
            <Input
              className="h-8 text-xs"
              value={profile.department}
              onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
            />
          </div>
        </div>

        <Button className="w-full h-8 text-xs" onClick={handleSave}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
