"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  isTyping?: boolean;
};

function parseContent(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

const FIRST_MSG =
  "Looks like you need a **signature notarisation** to send your document to the national bank. Is it right?";

const MAX_VISIBLE = 3;

const LANDING_BG = `
  radial-gradient(ellipse 110% 55% at 50% -10%, rgba(80,29,255,0.11) 0%, transparent 62%),
  radial-gradient(ellipse 60% 40% at 80% 80%, rgba(80,29,255,0.05) 0%, transparent 55%),
  #f8f8f8
`.trim();

const CHAT_BG = `
  radial-gradient(ellipse 80% 50% at 15% 0%, rgba(80,29,255,0.07) 0%, transparent 55%),
  #f4f2fa
`.trim();

/* Opacity + grayscale based on distance from bottom of visible stack */
const AGE_STYLES = [
  { opacity: 1,    filter: "none" },
  { opacity: 0.52, filter: "grayscale(0.28)" },
  { opacity: 0.24, filter: "grayscale(0.60)" },
];

export default function Home() {
  /* ─ landing ─ */
  const [leaving, setLeaving] = useState(false);
  const [describeOpen, setDescribeOpen] = useState(false);
  const [describeText, setDescribeText] = useState("");
  const describeInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─ chat ─ */
  const [phase, setPhase] = useState<"landing" | "chat">("landing");
  const [messages, setMessages] = useState<Message[]>([]);
  const [exitBatch, setExitBatch] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  /* Track which messages were visible last render to detect exits */
  const prevVisibleRef = useRef<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const visible = messages.slice(-MAX_VISIBLE);

  /* Detect exiting messages */
  useEffect(() => {
    const currentIds = visible.map((m) => m.id);
    const prevIds = prevVisibleRef.current;
    const exitingIds = prevIds.filter((id) => !currentIds.includes(id));
    if (exitingIds.length > 0 && prevIds.length > 0) {
      const exitMsgs = messages.filter((m) => exitingIds.includes(m.id));
      setExitBatch(exitMsgs);
      const t = setTimeout(() => setExitBatch([]), 450);
      prevVisibleRef.current = currentIds;
      return () => clearTimeout(t);
    }
    prevVisibleRef.current = currentIds;
  }, [messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startChat(userMsg?: string) {
    setLeaving(true);
    setTimeout(() => {
      setPhase("chat");
      const init: Message[] = [];
      if (userMsg?.trim()) {
        init.push({ id: "u0", role: "user", content: userMsg.trim() });
      }
      init.push({ id: "t1", role: "assistant", content: "", isTyping: true });
      setMessages(init);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === "t1" ? { ...m, content: FIRST_MSG, isTyping: false } : m
          )
        );
      }, 2100);
    }, 540);
  }

  function handleFile(file: File) {
    sessionStorage.setItem("doc", file.name);
    startChat();
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    /* Simulate assistant reply after a short pause */
    const typingId = crypto.randomUUID();
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: typingId, role: "assistant", content: "", isTyping: true }]);
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === typingId
              ? { ...m, content: "I understand. Let me help you set that up.", isTyping: false }
              : m
          )
        );
      }, 1800);
    }, 600);
  }

  /* ─────────────── LANDING ─────────────── */
  if (phase === "landing") {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-6 ${leaving ? "page-out" : ""}`}
        style={{ background: LANDING_BG }}
      >
        {/* Heading */}
        <div className="animate-jump text-center w-full max-w-5xl mb-5">
          <h1
            className="font-bold leading-[1.08] tracking-tight"
            style={{ color: "#13044f", fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)" }}
          >
            From zero to notary
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #501dff 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              appointment
            </span>{" "}
            <span style={{ color: "#13044f" }}>in 3 minutes</span>
          </h1>
        </div>

        <p
          className="animate-up text-center mb-14 text-base"
          style={{ color: "#13044f", opacity: 0.42, animationDelay: "0.55s", letterSpacing: "0.01em" }}
        >
          Upload your document or describe your situation —{" "}
          our assistant figures out the rest.
        </p>

        {/* Cards */}
        <div
          className="animate-up grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
          style={{ maxWidth: 820, animationDelay: "0.82s" }}
        >
          {/* Upload */}
          <div
            className="group rounded-3xl p-10 flex flex-col items-center gap-6 cursor-pointer border-2 border-dashed transition-all duration-300 hover:scale-[1.025] hover:-translate-y-1"
            style={{
              background: "linear-gradient(145deg,#ffffff 0%,#faf8ff 100%)",
              borderColor: "rgba(80,29,255,0.18)",
              boxShadow: "0 4px 32px rgba(80,29,255,0.07),0 1px 4px rgba(19,4,79,0.04)",
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => {
              handleDrag(e);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,rgba(80,29,255,0.12) 0%,rgba(139,92,246,0.08) 100%)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V7M12 7L9 9.5M12 7L15 9.5" stroke="#501dff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 15.5C3.5 17.433 5.067 19 7 19H17C18.933 19 20.5 17.433 20.5 15.5" stroke="#501dff" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-base mb-1.5" style={{ color: "#13044f" }}>Upload your document</p>
              <p className="text-sm" style={{ color: "#13044f", opacity: 0.4 }}>Drag & drop or click · PDF, Word, image</p>
            </div>
            <span
              className="text-sm font-semibold px-6 py-2.5 rounded-full"
              style={{
                background: "linear-gradient(135deg,#501dff 0%,#6d35ff 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(80,29,255,0.28)",
              }}
            >
              Choose file
            </span>
          </div>

          {/* Describe */}
          <div
            className="group rounded-3xl p-10 flex flex-col items-center gap-6 border-2 border-dashed transition-all duration-300"
            style={{
              background: "linear-gradient(145deg,#ffffff 0%,#fdfcff 100%)",
              borderColor: describeOpen ? "rgba(80,29,255,0.35)" : "rgba(19,4,79,0.12)",
              boxShadow: describeOpen
                ? "0 4px 32px rgba(80,29,255,0.10),0 1px 4px rgba(19,4,79,0.04)"
                : "0 4px 32px rgba(19,4,79,0.05),0 1px 4px rgba(19,4,79,0.04)",
              cursor: describeOpen ? "default" : "pointer",
              transform: describeOpen ? "scale(1.015) translateY(-4px)" : undefined,
            }}
            onClick={!describeOpen ? () => {
              setDescribeOpen(true);
              setTimeout(() => describeInputRef.current?.focus(), 80);
            } : undefined}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(19,4,79,0.06)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M8 9H16M8 13H13M6 3H18C19.1046 3 20 3.89543 20 5V15C20 16.1046 19.1046 17 18 17H13L8 21V17H6C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3Z" stroke="#13044f" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-base mb-1.5" style={{ color: "#13044f" }}>Describe your situation</p>
              <p className="text-sm" style={{ color: "#13044f", opacity: 0.4 }}>Plain language — no legal jargon required</p>
            </div>

            {describeOpen ? (
              <div className="animate-up w-full flex gap-2" style={{ animationDuration: "0.35s" }}>
                <input
                  ref={describeInputRef}
                  type="text"
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none border-2 transition-colors"
                  style={{
                    borderColor: "rgba(80,29,255,0.25)",
                    color: "#13044f",
                    background: "#f8f7ff",
                  }}
                  placeholder="E.g. I need to send a power of attorney abroad…"
                  value={describeText}
                  onChange={(e) => setDescribeText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && describeText.trim()) startChat(describeText);
                  }}
                />
                <button
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-25"
                  style={{
                    background: "linear-gradient(135deg,#501dff,#6d35ff)",
                    boxShadow: describeText.trim() ? "0 4px 14px rgba(80,29,255,0.3)" : "none",
                  }}
                  disabled={!describeText.trim()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (describeText.trim()) startChat(describeText);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <span
                className="text-sm font-semibold px-6 py-2.5 rounded-full border-2 transition-all duration-200 group-hover:border-opacity-40"
                style={{ borderColor: "rgba(19,4,79,0.2)", color: "#13044f" }}
              >
                Start typing
              </span>
            )}
          </div>
        </div>

        {/* Trust */}
        <div className="animate-up mt-14 flex items-center gap-8" style={{ animationDelay: "1.05s" }}>
          {["refurbed", "Bitpanda", "Speedinvest", "Oyster"].map((name) => (
            <span key={name} className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#13044f", opacity: 0.18 }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* ─────────────── CHAT ─────────────── */
  const rendered = [
    ...exitBatch.map((m) => ({ ...m, _exiting: true, _fromBottom: -1 })),
    ...visible.map((m, i) => ({ ...m, _exiting: false, _fromBottom: visible.length - 1 - i })),
  ];

  return (
    <div className="page-in min-h-screen flex flex-col" style={{ background: CHAT_BG }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {rendered.map((msg) => {
            const ageStyle = AGE_STYLES[msg._fromBottom] ?? AGE_STYLES[2];
            return (
              <div
                key={msg.id}
                className={[
                  "flex items-end gap-4",
                  msg.role === "user" ? "justify-end" : "justify-start",
                  msg._exiting ? "msg-exit" : msg.role === "user" ? "msg-right" : "msg-left",
                ].join(" ")}
                style={{
                  opacity: msg._exiting ? 1 : ageStyle.opacity,
                  filter: msg._exiting ? "none" : ageStyle.filter,
                  transition: "opacity 0.55s ease, filter 0.55s ease",
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg,#501dff 0%,#6d35ff 100%)",
                      color: "#fff",
                      boxShadow: "0 4px 14px rgba(80,29,255,0.28)",
                    }}
                  >
                    N
                  </div>
                )}

                <div
                  className="text-lg leading-relaxed"
                  style={{
                    ...(msg.role === "assistant"
                      ? {
                          background: "linear-gradient(135deg,#501dff 0%,#6b2fff 100%)",
                          color: "#fff",
                          borderRadius: "24px 24px 24px 6px",
                          boxShadow: "0 8px 32px rgba(80,29,255,0.22),0 2px 8px rgba(80,29,255,0.14)",
                        }
                      : {
                          background: "#fff",
                          color: "#13044f",
                          borderRadius: "24px 24px 6px 24px",
                          boxShadow: "0 4px 24px rgba(19,4,79,0.09),0 1px 4px rgba(19,4,79,0.05)",
                        }),
                    maxWidth: 640,
                    padding: "1.25rem 1.6rem",
                  }}
                >
                  {msg.isTyping ? (
                    <span className="flex gap-2 items-center h-6 px-1">
                      <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.65)" }} />
                      <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.65)" }} />
                      <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.65)" }} />
                    </span>
                  ) : (
                    parseContent(msg.content)
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input — right-aligned */}
      <div className="px-6 pb-8 pt-2 max-w-5xl mx-auto w-full flex justify-end">
        <div
          className="flex gap-3 items-center px-5 py-4 rounded-2xl"
          style={{
            width: "58%",
            minWidth: 360,
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 8px 40px rgba(19,4,79,0.1),0 2px 8px rgba(19,4,79,0.06)",
          }}
        >
          <input
            autoFocus
            type="text"
            className="flex-1 text-base outline-none bg-transparent"
            style={{ color: "#13044f" }}
            placeholder="Type your answer…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-25 disabled:scale-100"
            style={{
              background: "linear-gradient(135deg,#501dff 0%,#6d35ff 100%)",
              boxShadow: input.trim() ? "0 4px 16px rgba(80,29,255,0.35)" : "none",
            }}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
