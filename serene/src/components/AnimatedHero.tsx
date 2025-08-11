"use client";
import { motion } from "framer-motion";

export default function AnimatedHero() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 items-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
        <h2 className="text-3xl sm:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-fuchsia-500 to-emerald-500">Gentle support when you need it</h2>
        <p className="text-ink-700">Confidential, empathetic guidance, CBT-style reframing, and local resources. Your messages are not stored by default.</p>
        <div className="flex gap-3">
          <a href="/chat" className="button-gradient">Start chatting</a>
          <a href="/how-it-works" className="rounded-2xl border px-5 py-2 bg-white/70 backdrop-blur hover:bg-white">How it works</a>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="card p-6">
        <ul className="text-sm space-y-2">
          <li>✔️ No sign up required (anonymous session)</li>
          <li>✔️ Crisis detection with immediate resources</li>
          <li>✔️ WCAG AA-friendly interface</li>
        </ul>
      </motion.div>
      <div id="trust" className="sm:col-span-2 card p-6">
        <h3 className="text-lg font-medium mb-2">Trust & Safety</h3>
        <p className="text-sm text-ink-700">Not for emergencies. In Sri Lanka, call 1990 (Suwaseriya). Helplines: 1926, 1333, Sumithrayo +94 11 2696666.</p>
      </div>
    </div>
  );
}