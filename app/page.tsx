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

/* Subtle radial glow — changes between landing and chat */
const LANDING_BG = `
  radial-gradient(ellipse 110% 55% at 50% -10%, rgba(80,29,255,0.11) 0%, transparent 62%),
  radial-gradient(ellipse 60% 40% at 80% 80%, rgba(80,29,255,0.05) 0%, transparent 55%),
  #f8f8f8
`.trim();

const CHAT_BG = `
  radial-gradient(ellipse 80% 50% at 15% 0%, rgba(80,29,255,0.07) 0%, transparent 55%),
  #f4f2fa
`.trim();

export default function Home() {
  const [phase, setPhase] = useState<"landing" | "chat">("landing");
  const [leaving, setLeaving] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startChat() {
    setLeaving(true);
    setTimeout(() => {
      setPhase("chat");
      setMessages([{ id: "t1", role: "assistant", content: "", isTyping: true }]);
      setTimeout(() => {
        setMessages([{ id: "t1", role: "assistant", content: FIRST_MSG }]);
      }, 2000);
    }, 540);
  }

  function handleFile(file: File) {
    sessionStorage.setItem("doc", file.name);
    startChat();
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
    setInput("");
  }

  /* ──────────────────── LANDING ──────────────────── */
  if (phase === "landing") {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-6 ${leaving ? "page-out" : ""}`}
        style={{ background: LANDING_BG }}
      >
        {/* Hero text */}
        <div className="animate-jump text-center w-full max-w-4xl mb-5">
          <h1
            className="font-bold leading-[1.08] tracking-tight"
            style={{
              color: "#13044f",
              fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
            }}
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
          className="animate-up text-center mb-14"
          style={{
            color: "#13044f",
            opacity: 0.45,
            fontSize: "1.1rem",
            letterSpacing: "0.01em",
            animationDelay: "0.55s",
          }}
        >
          Upload your document or describe your situation —{" "}
          <br className="hidden sm:block" />
          our assistant figures out the rest.
        </p>

        {/* Cards */}
        <div
          className="animate-up grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
          style={{ maxWidth: 780, animationDelay: "0.82s" }}
        >
          {/* Upload */}
          <div
            className="group rounded-3xl p-10 flex flex-col items-center gap-6 cursor-pointer border transition-all duration-300 hover:scale-[1.025] hover:-translate-y-1"
            style={{
              background: "linear-gradient(145deg, #ffffff 0%, #faf8ff 100%)",
              borderColor: dragActive ? "#501dff" : "rgba(80,29,255,0.15)",
              borderStyle: dragActive ? "solid" : "dashed",
              borderWidth: 2,
              boxShadow: dragActive
                ? "0 0 0 4px rgba(80,29,255,0.08), 0 8px 40px rgba(80,29,255,0.12)"
                : "0 4px 32px rgba(80,29,255,0.07), 0 1px 4px rgba(19,4,79,0.04)",
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => { handleDrag(e); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(80,29,255,0.12) 0%, rgba(139,92,246,0.08) 100%)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V7M12 7L9 9.5M12 7L15 9.5" stroke="#501dff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 15.5C3.5 17.433 5.067 19 7 19H17C18.933 19 20.5 17.433 20.5 15.5" stroke="#501dff" strokeWidth="1.9" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="text-center">
              <p className="font-semibold text-base mb-1.5" style={{ color: "#13044f" }}>
                Upload your document
              </p>
              <p className="text-sm" style={{ color: "#13044f", opacity: 0.4 }}>
                Drag & drop or click · PDF, Word, image
              </p>
            </div>

            <span
              className="text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 group-hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #501dff 0%, #6d35ff 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(80,29,255,0.3)",
              }}
            >
              Choose file
            </span>
          </div>

          {/* Describe */}
          <div
            className="group rounded-3xl p-10 flex flex-col items-center gap-6 cursor-pointer border-2 border-dashed transition-all duration-300 hover:scale-[1.025] hover:-translate-y-1"
            style={{
              background: "linear-gradient(145deg, #ffffff 0%, #fdfcff 100%)",
              borderColor: "rgba(19,4,79,0.12)",
              boxShadow: "0 4px 32px rgba(19,4,79,0.05), 0 1px 4px rgba(19,4,79,0.04)",
            }}
            onClick={startChat}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(19,4,79,0.06)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M8 9H16M8 13H13M6 3H18C19.1046 3 20 3.89543 20 5V15C20 16.1046 19.1046 17 18 17H13L8 21V17H6C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3Z" stroke="#13044f" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="text-center">
              <p className="font-semibold text-base mb-1.5" style={{ color: "#13044f" }}>
                Describe your situation
              </p>
              <p className="text-sm" style={{ color: "#13044f", opacity: 0.4 }}>
                Plain language — no legal jargon required
              </p>
            </div>

            <span
              className="text-sm font-semibold px-6 py-2.5 rounded-full border-2 transition-all duration-200"
              style={{
                borderColor: "rgba(19,4,79,0.2)",
                color: "#13044f",
                background: "transparent",
              }}
            >
              Start typing
            </span>
          </div>
        </div>

        {/* Trust strip */}
        <div
          className="animate-up mt-16 flex items-center gap-8"
          style={{ animationDelay: "1.05s" }}
        >
          {["refurbed", "Bitpanda", "Speedinvest", "Oyster"].map((name) => (
            <span key={name} className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#13044f", opacity: 0.2 }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────────── CHAT ──────────────────── */
  return (
    <div
      className="page-in min-h-screen flex flex-col"
      style={{ background: CHAT_BG }}
    >
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-7">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-4 ${msg.role === "user" ? "justify-end msg-right" : "justify-start msg-left"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, #501dff 0%, #6d35ff 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(80,29,255,0.3)",
                  }}
                >
                  N
                </div>
              )}

              <div
                className="px-7 py-5 text-lg leading-relaxed"
                style={
                  msg.role === "assistant"
                    ? {
                        background: "linear-gradient(135deg, #501dff 0%, #6b2fff 100%)",
                        color: "#fff",
                        borderRadius: "24px 24px 24px 6px",
                        maxWidth: 580,
                        boxShadow: "0 8px 32px rgba(80,29,255,0.22), 0 2px 8px rgba(80,29,255,0.15)",
                      }
                    : {
                        backgroundColor: "#fff",
                        color: "#13044f",
                        borderRadius: "24px 24px 6px 24px",
                        maxWidth: 580,
                        boxShadow: "0 4px 24px rgba(19,4,79,0.08), 0 1px 4px rgba(19,4,79,0.05)",
                      }
                }
              >
                {msg.isTyping ? (
                  <span className="flex gap-2 items-center h-6 px-1">
                    <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.7)" }} />
                    <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.7)" }} />
                    <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.7)" }} />
                  </span>
                ) : (
                  parseContent(msg.content)
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Floating input — no divider */}
      <div className="px-6 pb-8 pt-2">
        <div
          className="max-w-4xl mx-auto flex gap-4 items-center px-6 py-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 40px rgba(19,4,79,0.1), 0 2px 8px rgba(19,4,79,0.06)",
          }}
        >
          <input
            autoFocus
            type="text"
            className="flex-1 text-lg outline-none bg-transparent"
            style={{ color: "#13044f" }}
            placeholder="Type your answer…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-25 disabled:scale-100"
            style={{
              background: "linear-gradient(135deg, #501dff 0%, #6d35ff 100%)",
              boxShadow: input.trim() ? "0 4px 16px rgba(80,29,255,0.35)" : "none",
            }}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
