"use client";
import { useRef, useState } from "react";
import SafetyBanner from "./SafetyBanner";
import MessageBubble from "./MessageBubble";

type Msg = { role: "user" | "assistant"; content: string };

function TypingIndicator() {
  // Simple animated 3 dots
  return (
    <div className="text-left">
      <div className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-2">
        <span className="sr-only">Serene is typing</span>
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]" />
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.1s]" />
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I’m Serene. What’s on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [crisis, setCrisis] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false); // show typing indicator before text arrives
  const lock = useRef(false);

  function typeOut(fullText: string, atIndex: number, speed = 18) {
    // progressively reveal assistant text
    let i = 0;
    const step = () => {
      i++;
      setMsgs(prev => {
        const copy = [...prev];
        copy[atIndex] = { ...copy[atIndex], content: fullText.slice(0, i) };
        return copy;
      });
      if (i < fullText.length) {
        setTimeout(step, speed);
      } else {
        lock.current = false; // done typing
      }
    };
    step();
  }

  async function send() {
    if (!input.trim() || lock.current) return;
    lock.current = true;

    const next = [...msgs, { role: "user", content: input.trim() } as Msg];
    setMsgs(next);
    setInput("");

    // Show "Serene is typing…" while waiting for the server
    setWaiting(true);

    let payload: { mode: "normal" | "crisis"; content: string };
    try {
      payload = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: next }),
        headers: { "Content-Type": "application/json" }
      }).then(r => r.json());
    } catch (e) {
      setWaiting(false);
      lock.current = false;
      setMsgs(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble replying. Please try again." }]);
      return;
    }

    setWaiting(false);

    // Insert an empty assistant bubble, then type into it
    const idx = next.length; // position for assistant reply
    const text = payload.content ?? "";
    if (payload.mode === "crisis") setCrisis(text); else setCrisis(null);

    setMsgs(prev => [...prev, { role: "assistant", content: "" }]);
    // Start the typewriter effect
    typeOut(text, idx);
  }

  const disableInput = waiting || lock.current;

  return (
    <div className="grid gap-4">
      <SafetyBanner visible={!!crisis} message={crisis ?? ""} />
      <div className="rounded-2xl border p-4 space-y-3 bg-white min-h-[40vh]">
        {msgs.map((m, i) => (
          <MessageBubble key={i} role={m.role}>{m.content}</MessageBubble>
        ))}
        {waiting && <TypingIndicator />}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border px-4 py-2"
          placeholder="Type a message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disableInput && send()}
          aria-label="Message input"
          disabled={disableInput}
        />
        <button
          onClick={send}
          className="rounded-xl px-4 py-2 bg-black text-white disabled:opacity-50"
          disabled={disableInput}
          aria-busy={disableInput}
        >
          {waiting ? "Typing…" : "Send"}
        </button>
      </div>

      <p className="text-xs text-ink-500">
        This app does not store your messages by default. It is not a substitute for professional care.
      </p>
    </div>
  );
}
