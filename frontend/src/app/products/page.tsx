'use client';

import { useAuthStore } from '../../../store/authStore';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PRODUCTS = [
  { id: 'COURSE-1', name: 'Java Fundamentals', amount: 499 },
  { id: 'COURSE-2', name: 'Next.js Essentials', amount: 699 },
];

export default function ProductsPage() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  const handleBuy = async (id: string, amount: number) => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await apiFetch(
        '/purchases',
        {
          method: 'POST',
          body: JSON.stringify({ productId: id, amount }),
        },
        token
      );
      alert(
        res.isReferralCredited
          ? 'Purchase successful. Referral credits awarded!'
          : 'Purchase successful.'
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-slate-800">Available Courses 📚</h1>
      <p className="text-sm text-slate-500">
        Simulate a purchase — if you were referred, your first purchase grants credits.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {PRODUCTS.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md 
            hover:shadow-lg transition cursor-pointer group"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                {p.name}
              </h2>
              <p className="text-sm font-medium">
                <span className="text-slate-500">Price: </span>
                <span className="text-indigo-600 font-bold">₹{p.amount}</span>
              </p>
            </div>

            <button
              onClick={() => handleBuy(p.id, p.amount)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold 
              text-white shadow hover:bg-indigo-500 transition"
            >
              Buy Now
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
