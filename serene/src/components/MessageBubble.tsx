"use client";
export default function MessageBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode; }) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "text-right" : "text-left"}>
      <div className={`inline-block rounded-2xl px-4 py-2 ${isUser ? "bg-sky-100" : "bg-gray-100"}`}>
        {children}
      </div>
    </div>
  );
}
