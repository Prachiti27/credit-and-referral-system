'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { apiFetch } from '../../../lib/api';
import { motion } from 'framer-motion';

type DashboardData = {
  referredUsers: number;
  convertedUsers: number;
  totalCredits: number;
  referralLink: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }
    const load = async () => {
      try {
        const res = await apiFetch('/me/dashboard', {}, token);
        setData(res);
      } catch (err: any) {
        setError(err.message);
      }
    };
    load();
  }, [token, user, router]);

  const handleCopy = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.referralLink);
    alert('Referral link copied!');
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-800">
            Hey, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500">
            Earn credits by referring your friends & track your progress.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium hover:bg-slate-100 transition"
        >
          Logout
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}

      {!data ? (
        <p className="text-sm text-slate-500">Loading your dashboard...</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard label="Referred Users" value={data.referredUsers} />
            <StatCard label="Converted Users" value={data.convertedUsers} />
            <StatCard label="Total Credits" value={data.totalCredits} highlight />
          </div>

          <div className="mt-4 space-y-3 rounded-3xl bg-white p-6 shadow-lg border border-slate-100">
            <p className="text-sm font-semibold text-slate-700">
              Your Referral Link 🔗
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 rounded-lg border bg-slate-50 px-3 py-3 text-xs font-medium text-slate-700 truncate">
                {data.referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow"
              >
                Copy
              </button>
            </div>
          </div>

          <motion.a
            href="/products"
            whileHover={{ x: 3 }}
            className="inline-block text-sm text-indigo-600 font-medium hover:underline mt-2"
          >
            Browse courses →
          </motion.a>
        </>
      )}
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 shadow-md border ${
        highlight
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'bg-white border-slate-200'
      }`}
    >
      <p
        className={`text-xs font-medium ${
          highlight ? 'opacity-90' : 'text-slate-500'
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </motion.div>
  );
}
