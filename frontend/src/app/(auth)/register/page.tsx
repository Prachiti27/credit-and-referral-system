'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { useAuthStore } from '../../../../store/authStore';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const params = useSearchParams();
  const referralCodeFromUrl = params.get('r') || '';
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: referralCodeFromUrl,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setAuth(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-100"
    >
      <h2 className="text-2xl font-bold text-slate-800">Create account ✨</h2>

      <p className="mt-1 text-xs text-slate-500">
        {referralCodeFromUrl
          ? 'Referral applied! Earn credits on your first purchase 🎁'
          : 'Sign up to start earning credits and unlocking rewards.'}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Name</label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Referral Code (optional)
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase tracking-wide focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            value={form.referralCode}
            onChange={(e) =>
              setForm({ ...form, referralCode: e.target.value.toUpperCase() })
            }
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2 font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </form>
    </motion.div>
  );
}
