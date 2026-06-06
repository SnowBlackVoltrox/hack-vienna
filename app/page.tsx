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

const FIRST_MESSAGE =
  "Looks like you need a **signature notarisation** to send your document to the national bank. Is it right?";

export default function Home() {
  const [phase, setPhase] = useState<"landing" | "chat">("landing");
  const [landingOut, setLandingOut] = useState(false);
  const [chatIn, setChatIn] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startChat() {
    setLandingOut(true);
    setTimeout(() => {
      setPhase("chat");
      setTimeout(() => {
        setChatIn(true);
        const typingId = "typing-1";
        setMessages([{ id: typingId, role: "assistant", content: "", isTyping: true }]);
        setTimeout(() => {
          setMessages([{ id: typingId, role: "assistant", content: FIRST_MESSAGE }]);
        }, 1800);
      }, 60);
    }, 420);
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
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
    setInput("");
  }

  /* ── LANDING ── */
  if (phase === "landing") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: "#f8f8f8",
          opacity: landingOut ? 0 : 1,
          transform: landingOut ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Minimal nav */}
        <nav className="px-8 py-5 max-w-5xl mx-auto w-full">
          <span className="text-lg font-bold tracking-tight" style={{ color: "#13044f" }}>
            notarity
          </span>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20 pt-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1
              className="text-5xl font-bold leading-tight tracking-tight mb-4"
              style={{ color: "#13044f" }}
            >
              From zero to notary
              <br />appointment in{" "}
              <span style={{ color: "#501dff" }}>3 minutes</span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "#13044f", opacity: 0.5 }}>
              Upload your document or describe your situation —{" "}
              our assistant handles the rest.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
            {/* Upload */}
            <div
              className="rounded-2xl p-8 flex flex-col items-center gap-5 cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] group"
              style={{
                backgroundColor: dragActive ? "#501dff06" : "#fff",
                borderStyle: "dashed",
                borderColor: dragActive ? "#501dff" : "#501dff35",
                boxShadow: "0 2px 20px 0 #501dff08",
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => {
                handleDrag(e);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
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
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#501dff10" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15V7M12 7L9.5 9.5M12 7L14.5 9.5" stroke="#501dff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 15C4 17.2091 5.79086 19 8 19H16C18.2091 19 20 17.2091 20 15" stroke="#501dff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm mb-1" style={{ color: "#13044f" }}>
                  Upload your document
                </p>
                <p className="text-xs" style={{ color: "#13044f", opacity: 0.45 }}>
                  Drag & drop or click · PDF, Word, image
                </p>
              </div>
              <span
                className="text-xs font-semibold px-5 py-2 rounded-full"
                style={{ backgroundColor: "#501dff", color: "#fff" }}
              >
                Choose file
              </span>
            </div>

            {/* Describe */}
            <div
              className="rounded-2xl p-8 flex flex-col items-center gap-5 cursor-pointer border-2 border-dashed transition-all duration-200 hover:scale-[1.02] group"
              style={{
                backgroundColor: "#fff",
                borderColor: "#13044f18",
                boxShadow: "0 2px 20px 0 #13044f06",
              }}
              onClick={startChat}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#13044f0a" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 9H16M8 13H13M6 3H18C19.1046 3 20 3.89543 20 5V15C20 16.1046 19.1046 17 18 17H13L8 21V17H6C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3Z" stroke="#13044f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm mb-1" style={{ color: "#13044f" }}>
                  Describe your situation
                </p>
                <p className="text-xs" style={{ color: "#13044f", opacity: 0.45 }}>
                  Plain language — no jargon required
                </p>
              </div>
              <span
                className="text-xs font-semibold px-5 py-2 rounded-full border-2"
                style={{ borderColor: "#13044f30", color: "#13044f" }}
              >
                Start typing
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── CHAT ── */
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#f8f8f8",
        opacity: chatIn ? 1 : 0,
        transform: chatIn ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
      }}
    >
      {/* Thin header */}
      <header
        className="flex items-center px-6 py-4 border-b"
        style={{ backgroundColor: "#fff", borderColor: "#13044f0d" }}
      >
        <span className="text-base font-bold tracking-tight" style={{ color: "#13044f" }}>
          notarity
        </span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end msg-user" : "justify-start msg-assistant"}`}
            >
              {/* Avatar */}
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: "#501dff" }}
                >
                  N
                </div>
              )}

              {/* Bubble */}
              <div
                className="max-w-sm px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        backgroundColor: "#501dff",
                        color: "#fff",
                        borderRadius: "18px 18px 4px 18px",
                      }
                    : {
                        backgroundColor: "#fff",
                        color: "#13044f",
                        borderRadius: "18px 18px 18px 4px",
                        boxShadow: "0 1px 10px #13044f0c",
                      }
                }
              >
                {msg.isTyping ? (
                  <span className="flex gap-1.5 items-center h-4 px-1">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#501dff60" }} />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#501dff60" }} />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#501dff60" }} />
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

      {/* Input bar */}
      <div
        className="border-t px-4 py-4"
        style={{ backgroundColor: "#fff", borderColor: "#13044f0d" }}
      >
        <div className="max-w-2xl mx-auto flex gap-3 items-center">
          <input
            autoFocus
            type="text"
            className="flex-1 px-4 py-3 rounded-full text-sm outline-none border-2 transition-colors"
            style={{
              borderColor: "#13044f12",
              backgroundColor: "#f8f8f8",
              color: "#13044f",
            }}
            placeholder="Type your answer…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button
            className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-30"
            style={{ backgroundColor: "#501dff" }}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
