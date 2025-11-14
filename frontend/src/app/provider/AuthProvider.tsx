'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      setAuth(JSON.parse(userStr), token);
    }
  }, [setAuth]);

  return <>{children}</>;
}
