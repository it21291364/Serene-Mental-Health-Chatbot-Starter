"use client";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import SafetyBanner from "./SafetyBanner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = {
  role: "user" | "assistant";
  content: string;
  at: number;
  status?: "sending" | "sent" | "seen"; // for user messages
};

/* ---------- Helpers ---------- */
function formatTime(ts: number) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const hh = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}
function dayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const y = new Date(); y.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, y)) return "Yesterday";
  return d.toLocaleDateString();
}
// Normalize "1) item" → "1. item" so Markdown creates ordered lists
function normalizeForMarkdown(text: string) {
  return text.replace(/^\s*(\d+)\)\s/gm, "$1. ");
}

/* ---------- Small UI bits ---------- */
function DateChip({ label }: { label: string }) {
  const chip: CSSProperties = {
    fontSize: 12,
    background: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 999,
    padding: "6px 10px",
    color: "#475569",
    backdropFilter: "blur(6px)",
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
      <span style={chip}>{label}</span>
    </div>
  );
}

function Ticks({ status }: { status?: Msg["status"] }) {
  if (!status) return null;
  const grey = "#94a3b8";
  const blue = "#53bdeb";
  const color = status === "seen" ? blue : grey;

  // single tick for "sending"
  if (status === "sending") {
    return (
      <span title={status} style={{ display: "inline-flex", alignItems: "center", marginLeft: 4 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" style={{ opacity: 0.9 }}>
          <path fill={grey} d="M9.29 16.29L4.7 11.7l1.42-1.42 3.17 3.17 7.29-7.29 1.42 1.42z" />
        </svg>
      </span>
    );
  }

  // double tick for "sent" (grey) and "seen" (blue)
  return (
    <span title={status} style={{ display: "inline-flex", alignItems: "center", marginLeft: 4 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ opacity: 0.9 }}>
        <path fill={color} d="M9.29 16.29L4.7 11.7l1.42-1.42 3.17 3.17 7.29-7.29 1.42 1.42z" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginLeft: -8 }}>
        <path fill={color} d="M12.29 16.29L7.7 11.7l1.42-1.42 3.17 3.17 7.29-7.29 1.42 1.42z" />
      </svg>
    </span>
  );
}

function TypingIndicator() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, []);
  const dot = (on: boolean) => ({
    width: 6,
    height: 6,
    background: "#94a3b8",
    borderRadius: 99,
    opacity: on ? 1 : 0.3,
  } as CSSProperties);
  return (
    <div aria-live="polite" style={{ textAlign: "left" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#fff",
          padding: "8px 12px",
          borderRadius: 16,
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <span style={dot(dots >= 1)} />
        <span style={dot(dots >= 2)} />
        <span style={dot(dots >= 3)} />
      </div>
    </div>
  );
}

function MD({ text }: { text: string }) {
  // Inline-styled Markdown renderer for assistant messages
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p style={{ margin: "6px 0 8px", lineHeight: 1.55 }}>{children}</p>,
        strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
        em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
        ul: ({ children }) => <ul style={{ margin: "6px 0 8px", paddingLeft: 18 }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ margin: "6px 0 8px", paddingLeft: 20 }}>{children}</ol>,
        li: ({ children }) => <li style={{ margin: "2px 0" }}>{children}</li>,
        a: ({ href, children }) => (
          <a href={href} style={{ color: "#128C7E", textDecoration: "underline" }}>{children}</a>
        ),
        h3: ({ children }) => <h3 style={{ margin: "6px 0 4px", fontSize: 14, fontWeight: 700 }}>{children}</h3>,
        br: () => <br />,
      }}
    >
      {normalizeForMarkdown(text)}
    </ReactMarkdown>
  );
}

/* ---------- Main Component ---------- */
export default function ChatWindow() {
  const [mounted, setMounted] = useState(false);

  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I’m Serene. What’s on your mind today?", at: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [crisis, setCrisis] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const lock = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const days = useMemo(() => {
    const map = new Map<string, Msg[]>();
    for (const m of msgs) {
      const label = dayLabel(m.at);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(m);
    }
    return Array.from(map.entries());
  }, [msgs]);

  function scrollToBottom() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }
  useEffect(() => { scrollToBottom(); }, [msgs, waiting]);

  function typeOut(fullText: string, atIndex: number, speed = 16) {
    let i = 0;
    const step = () => {
      i++;
      setMsgs((prev) => {
        const copy = [...prev];
        copy[atIndex] = { ...copy[atIndex], content: fullText.slice(0, i) };
        return copy;
      });
      if (i < fullText.length) setTimeout(step, speed);
      else lock.current = false;
    };
    step();
  }

  async function send() {
    if (!input.trim() || lock.current) return;
    lock.current = true;

    const userMsg: Msg = { role: "user", content: input.trim(), at: Date.now(), status: "sending" };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setWaiting(true);

    // Immediately show double grey ticks as "sent"
    setMsgs(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, status: "sent" } : m));

    let payload: { mode: "normal" | "crisis"; content: string } | null = null;
    try {
      payload = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
        headers: { "Content-Type": "application/json" },
      }).then((r) => r.json());
    } catch {
      setWaiting(false);
      lock.current = false;
      // keep as "sent" on error
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had trouble replying. Please try again.", at: Date.now() },
      ]);
      return;
    }

    setWaiting(false);

    const text = payload?.content ?? "";
    if (payload?.mode === "crisis") setCrisis(text);
    else setCrisis(null);

    // Mark as READ exactly when Serene starts replying → double BLUE ticks
    setMsgs(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, status: "seen" } : m));

    const idx = next.length; // insert assistant bubble and type into it
    setMsgs((prev) => [...prev, { role: "assistant", content: "", at: Date.now() }]);
    typeOut(text, idx);
  }

  /* ---------- Inline Styles ---------- */
  const S = {
    container: {
      width: "100%",
      height: "80vh",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
      background: "#fff",
    } as CSSProperties,

    header: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "#128C7E", // WhatsApp green
      color: "#fff",
      padding: "10px 12px",
    } as CSSProperties,
    back: { color: "rgba(255,255,255,0.9)", fontSize: 18, textDecoration: "none" } as CSSProperties,
    avatar: {
      height: 36, width: 36, borderRadius: "50%",
      background: "rgba(255,255,255,0.25)",
      display: "grid", placeItems: "center",
      fontSize: 14,
    } as CSSProperties,
    topMeta: { lineHeight: 1.1 } as CSSProperties,
    name: { fontWeight: 600 } as CSSProperties,
    status: { fontSize: 12, opacity: 0.9 } as CSSProperties,
    menu: { marginLeft: "auto", fontSize: 20, lineHeight: 1 } as CSSProperties,

    messagesArea: {
      height: "calc(100% - 112px)", // header (≈56) + input (≈56)
      overflowY: "auto",
      padding: 12,
      backgroundColor: "#ece5dd",
      backgroundImage:
        "radial-gradient(circle at 10% 10%, rgba(0,0,0,0.03) 2px, transparent 2px)," +
        "radial-gradient(circle at 60% 50%, rgba(0,0,0,0.03) 2px, transparent 2px)," +
        "radial-gradient(circle at 30% 80%, rgba(0,0,0,0.03) 2px, transparent 2px)",
      backgroundSize: "200px 200px, 180px 180px, 220px 220px",
    } as CSSProperties,
    inner: { maxWidth: 720, margin: "0 auto" } as CSSProperties,

    row: (mine: boolean) =>
      ({
        position: "relative",
        display: "flex",
        justifyContent: mine ? "flex-end" : "flex-start",
        margin: "6px 0",
      }) as CSSProperties,

    bubble: (mine: boolean) =>
      ({
        position: "relative",
        maxWidth: "80%",
        padding: "8px 10px 6px 10px",
        borderRadius: 12,
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
        background: mine ? "#dcf8c6" : "#ffffff",
        overflowWrap: "anywhere",
      }) as CSSProperties,

    tail: (mine: boolean) =>
      ({
        position: "absolute",
        bottom: 0,
        width: 0, height: 0,
        borderStyle: "solid",
        borderWidth: 8,
        borderColor: "transparent",
        ...(mine
          ? { right: -2, borderLeftColor: "#dcf8c6", borderRightWidth: 0, marginBottom: -1 }
          : { left: -2, borderRightColor: "#ffffff", borderLeftWidth: 0, marginBottom: -1 }),
      }) as CSSProperties,

    content: { whiteSpace: "pre-wrap", lineHeight: 1.55 } as CSSProperties,
    timeRow: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
      fontSize: 10,
      color: "#64748b",
    } as CSSProperties,

    inputBar: {
      display: "flex", alignItems: "center", gap: 8,
      padding: 8, background: "#f5f5f5", borderTop: "1px solid rgba(0,0,0,0.08)",
    } as CSSProperties,
    emoji: { borderRadius: 999, padding: 8, background: "transparent", border: "none", cursor: "pointer" } as CSSProperties,
    inputWrap: { flex: 1 } as CSSProperties,
    input: {
      width: "100%", borderRadius: 999, border: "1px solid rgba(0,0,0,0.15)",
      padding: "10px 14px", background: "#fff",
    } as CSSProperties,
    send: {
      borderRadius: 999, padding: 10, background: "#128C7E", color: "#fff",
      border: "none", cursor: "pointer",
    } as CSSProperties,
    disable: { opacity: 0.5, cursor: "not-allowed" } as CSSProperties,
  };

  /* ---------- Skeleton on server (pre-hydration) ---------- */
  if (!mounted) {
    return (
      <div style={S.container}>
        <div style={S.header}>
          <span style={S.back}>←</span>
          <div style={S.avatar}>🟢</div>
          <div style={S.topMeta}>
            <div style={S.name}>Serene</div>
            <div style={S.status}>online</div>
          </div>
          <div style={S.menu}>⋮</div>
        </div>
        <div style={S.messagesArea}><div style={S.inner} /></div>
        <div style={{ padding: 8, background: "#f5f5f5", borderTop: "1px solid rgba(0,0,0,0.08)" }} />
      </div>
    );
  }

  /* ---------- Live UI (client) ---------- */
  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <a href="/" style={S.back} suppressHydrationWarning>←</a>
        <div style={S.avatar}>🟢</div>
        <div style={S.topMeta}>
          <div style={S.name}>Serene</div>
          <div style={S.status}>{waiting ? "typing…" : "online"}</div>
        </div>
        <div style={S.menu}>⋮</div>
      </div>

      {/* Messages */}
      <div ref={listRef} style={S.messagesArea}>
        <div style={S.inner}>
          {crisis && (
            <div style={{ marginBottom: 12 }}>
              <SafetyBanner visible={true} message={crisis} />
            </div>
          )}

          {days.map(([label, items]) => (
            <div key={label}>
              <DateChip label={label} />
              {items.map((m, i) => {
                const mine = m.role === "user";
                return (
                  <div key={m.at + "-" + i} style={S.row(mine)} aria-live="polite">
                    <div style={S.bubble(mine)}>
                      <div style={S.content}>
                        {m.role === "assistant" ? <MD text={m.content} /> : <span>{m.content}</span>}
                      </div>
                      <div style={S.timeRow}>
                        <span>{formatTime(m.at)}</span>
                        {m.role === "user" && <Ticks status={m.status} />}
                      </div>
                      {/* Tail triangle */}
                      <span style={S.tail(mine)} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {waiting && <div style={{ marginTop: 8 }}><TypingIndicator /></div>}
        </div>
      </div>

      {/* Input */}
      <div style={S.inputBar}>
        <button
          title="Emoji"
          style={S.emoji}
          aria-label="Emoji"
          suppressHydrationWarning
        >
          😊
        </button>

        <div style={S.inputWrap}>
          <input
            style={S.input}
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !waiting && !lock.current && send()}
            aria-label="Message input"
            disabled={waiting || lock.current}
            suppressHydrationWarning
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            data-gramm="false"
            data-lt-active="false"
          />
        </div>

        <button
          onClick={send}
          style={{ ...S.send, ...((waiting || lock.current) ? S.disable : null) }}
          disabled={waiting || lock.current}
          aria-busy={waiting || lock.current}
          title="Send"
          suppressHydrationWarning
        >
          ➤
        </button>
      </div>
    </div>
  );
}
