"use client";
import { motion } from "framer-motion";

export default function MessageBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode; }) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "text-right" : "text-left"}>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`inline-block rounded-2xl px-4 py-2 ${isUser ? "bg-sky-100" : "bg-gray-100"}`}
      >
        {children}
      </motion.div>
    </div>
  );
}