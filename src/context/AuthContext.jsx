'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const DEFAULT_USER = {
  name: 'Sarah Reeves',
  email: 'sarah.reeves@acme.corp',
  initials: 'SR',
  avatarUrl: '',
};

export const ACCOUNTS = [
  { id: 'company', name: 'Acme Corp', type: 'Company Page', handle: '@acme-corp' },
  { id: 'personal', name: 'Sarah Reeves', type: 'Personal Profile', handle: '@sarah-reeves' },
];

export function AuthProvider({ children }) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user] = useState(DEFAULT_USER);
  const [role, setRole] = useState('owner'); // 'owner' | 'marketing'
  const [activeAccount, setActiveAccount] = useState(ACCOUNTS[0]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('linkedflow_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        setIsAuthenticated(parsed.isAuthenticated ?? true);
        setRole(parsed.role ?? 'owner');
        if (parsed.activeAccountId) {
          const acc = ACCOUNTS.find((a) => a.id === parsed.activeAccountId);
          if (acc) setActiveAccount(acc);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const persist = (authObj) => {
    try {
      localStorage.setItem('linkedflow_auth', JSON.stringify(authObj));
    } catch {
      // Ignore
    }
  };

  const login = (chosenRole = 'owner', redirectPath = '/') => {
    setIsAuthenticated(true);
    setRole(chosenRole);
    persist({ isAuthenticated: true, role: chosenRole, activeAccountId: activeAccount.id });
    router.push(redirectPath);
  };

  const logout = () => {
    setIsAuthenticated(false);
    persist({ isAuthenticated: false, role, activeAccountId: activeAccount.id });
    router.push('/login');
  };

  const switchAccount = (accountOrId) => {
    const acc =
      typeof accountOrId === 'string'
        ? ACCOUNTS.find((a) => a.id === accountOrId) || ACCOUNTS[0]
        : accountOrId;
    setActiveAccount(acc);
    persist({ isAuthenticated, role, activeAccountId: acc.id });
  };

  const toggleRole = () => {
    const nextRole = role === 'owner' ? 'marketing' : 'owner';
    setRole(nextRole);
    persist({ isAuthenticated, role: nextRole, activeAccountId: activeAccount.id });
    return nextRole;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        isOwner: role === 'owner',
        isMarketing: role === 'marketing',
        activeAccount,
        accounts: ACCOUNTS,
        login,
        logout,
        switchAccount,
        toggleRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
