'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AppLogo from '@/components/ui/AppLogo';
import { ShieldCheck, UserCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.reeves@acme.corp');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState('owner');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole, '/');
      toast.success(
        `Logged in as ${selectedRole === 'owner' ? 'Account Owner' : 'Marketing User'}`
      );
    }, 400);
  };

  const handleQuickLogin = (roleToUse) => {
    setLoading(true);
    setTimeout(() => {
      login(roleToUse, '/');
      toast.success(`Logged in as ${roleToUse === 'owner' ? 'Account Owner' : 'Marketing User'}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md card p-8 z-10 border border-border shadow-xl">
        {/* Logo and title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-3">
            <AppLogo size={44} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to LinkedFlow</h1>
          <p className="text-xs text-muted-foreground mt-1">
            AI-Powered LinkedIn Marketing & Post Automation Engine
          </p>
        </div>

        {/* Quick Role Simulation Picker */}
        <div className="mb-6 p-3 rounded-xl bg-muted/50 border border-border/80">
          <span className="text-xs font-600 text-muted-foreground uppercase tracking-wider block mb-2">
            1-Click Demo Login (Role Gating Test)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('owner')}
              className="flex flex-col items-start p-2.5 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-primary text-xs font-700">
                <ShieldCheck size={14} />
                <span>Account Owner</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
                Can approve & publish posts
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('marketing')}
              className="flex flex-col items-start p-2.5 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-accent text-xs font-700">
                <UserCheck size={14} />
                <span>Marketing User</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
                Creates drafts (approvals gated)
              </span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-3 text-xs text-muted-foreground">
            or sign in with email
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-600 text-foreground block mb-1.5">Work Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base pl-9 text-sm"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-600 text-foreground block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base pl-9 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-600 text-foreground block mb-1.5">Assigned Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-base text-sm"
            >
              <option value="owner">Account Owner (Approver & Publisher)</option>
              <option value="marketing">Marketing User (Content Creator)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5 mt-2 font-600 shadow-md"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Social / OAuth Option */}
        <div className="mt-4 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => handleQuickLogin('owner')}
            className="w-full py-2.5 px-3 rounded-lg border border-border bg-muted/30 hover:bg-muted font-500 text-xs text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4 text-[#0A66C2] fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
            </svg>
            Sign in with LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}
