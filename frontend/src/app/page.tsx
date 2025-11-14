"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="grid gap-10 md:grid-cols-2 items-center">
      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight"
        >
          Grow our platform,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            earn credits
          </span>.
        </motion.h1>

        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Invite your friends to CourseVerse. Both of you get instant credits when they make
          their <span className="font-medium text-slate-700">first purchase</span>.
        </p>

        <div className="flex gap-3 pt-2">
          <a
            href="/register"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow hover:bg-indigo-500 hover:shadow-lg transition"
          >
            Get started
          </a>
          <a
            href="/login"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-100 transition"
          >
            Login
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hidden md:block"
      >
        <div className="rounded-3xl bg-white shadow-xl p-6 border border-slate-100">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-semibold text-slate-700">Your Progress</h3>
            <span className="text-xs text-indigo-600">View Dashboard →</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Referred" value="10" />
            <StatCard label="Converted" value="4" />
            <StatCard label="Credits" value="8" highlight />
          </div>

          <div className="h-24 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-end p-3">
            <div className="flex gap-1 w-full">
              <ChartBar height="30%" />
              <ChartBar height="50%" />
              <ChartBar height="40%" />
              <ChartBar height="70%" />
              <ChartBar height="50%" />
              <ChartBar height="85%" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 text-center border ${
        highlight
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white border-slate-200"
      } shadow-sm`}
    >
      <p className="text-[10px] tracking-wide uppercase opacity-70 font-medium">
        {label}
      </p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}

function ChartBar({ height }: { height: string }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-indigo-500 rounded-t-md origin-bottom"
      style={{ height }}
    />
  );
}
