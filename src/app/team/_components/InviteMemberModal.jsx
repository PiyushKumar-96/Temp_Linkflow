import React, { useState } from 'react';
import { X, Send, ShieldAlert } from 'lucide-react';
import { InviteMemberSchema } from '@/lib/contracts/team.schema';

export default function InviteMemberModal({ isOpen, onClose, onInvite, isOwner }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'marketing',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = InviteMemberSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onInvite(result.data);
      onClose();
      setFormData({ name: '', email: '', role: 'marketing' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl card-shadow-md w-full max-w-md slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-600 text-foreground">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {!isOwner && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-2.5 text-amber-800 text-xs">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <p>
              Only Account Owners can send binding team invitations. You can preview the invitation
              flow below.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-600 text-foreground mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Rivera"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.name && <p className="text-[11px] text-danger mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-600 text-foreground mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="alex@acme.corp"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.email && <p className="text-[11px] text-danger mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-600 text-foreground mb-1.5">Workspace Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="marketing">Marketing User (Draft & Edit posts)</option>
              <option value="reviewer">Reviewer (Review & Comment only)</option>
              <option value="owner">Account Owner (Approve & Publish to Buffer)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="btn-secondary text-xs py-2 px-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Sending...' : 'Send Invitation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
