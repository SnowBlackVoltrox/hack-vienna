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
      }, 1900);
    }, 380);
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
        className={`min-h-screen flex flex-col items-center justify-center px-4 ${leaving ? "page-out" : ""}`}
        style={{ backgroundColor: "#f8f8f8" }}
      >
        {/* Heading — jumps in */}
        <div
          className="animate-jump text-center mb-4"
          style={{ animationDuration: "0.85s" }}
        >
          <h1
            className="text-5xl font-bold leading-tight tracking-tight"
            style={{ color: "#13044f" }}
          >
            From zero to notary
            <br />appointment in{" "}
            <span style={{ color: "#501dff" }}>3 minutes</span>
          </h1>
        </div>

        {/* Subtitle — fades up after heading */}
        <p
          className="animate-up text-base mb-10"
          style={{
            color: "#13044f",
            opacity: 0.5,
            animationDelay: "0.38s",
          }}
        >
          Upload your document or describe your situation.
        </p>

        {/* Cards — fade up with a bit more delay */}
        <div
          className="animate-up grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl"
          style={{ animationDelay: "0.58s" }}
        >
          {/* Upload */}
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-5 cursor-pointer border-2 transition-all duration-200 hover:scale-[1.025]"
            style={{
              backgroundColor: dragActive ? "#501dff06" : "#fff",
              borderStyle: "dashed",
              borderColor: dragActive ? "#501dff" : "#501dff30",
              boxShadow: "0 2px 24px #501dff08",
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#501dff0f" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V7M12 7L9.5 9.5M12 7L14.5 9.5" stroke="#501dff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 15C4 17.2091 5.79086 19 8 19H16C18.2091 19 20 17.2091 20 15" stroke="#501dff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm mb-1" style={{ color: "#13044f" }}>Upload your document</p>
              <p className="text-xs" style={{ color: "#13044f", opacity: 0.4 }}>Drag & drop or click · PDF, Word, image</p>
            </div>
            <span className="text-xs font-semibold px-5 py-2 rounded-full" style={{ backgroundColor: "#501dff", color: "#fff" }}>
              Choose file
            </span>
          </div>

          {/* Describe */}
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-5 cursor-pointer border-2 border-dashed transition-all duration-200 hover:scale-[1.025]"
            style={{
              backgroundColor: "#fff",
              borderColor: "#13044f18",
              boxShadow: "0 2px 24px #13044f06",
            }}
            onClick={startChat}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#13044f0a" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 9H16M8 13H13M6 3H18C19.1046 3 20 3.89543 20 5V15C20 16.1046 19.1046 17 18 17H13L8 21V17H6C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3Z" stroke="#13044f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm mb-1" style={{ color: "#13044f" }}>Describe your situation</p>
              <p className="text-xs" style={{ color: "#13044f", opacity: 0.4 }}>Plain language — no jargon required</p>
            </div>
            <span
              className="text-xs font-semibold px-5 py-2 rounded-full border-2"
              style={{ borderColor: "#13044f28", color: "#13044f" }}
            >
              Start typing
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────────── CHAT ──────────────────── */
  return (
    <div
      className="page-in min-h-screen flex flex-col"
      style={{ backgroundColor: "#f8f8f8" }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-10 px-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end msg-right" : "justify-start msg-left"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#501dff", color: "#fff" }}
                >
                  N
                </div>
              )}

              <div
                className="max-w-md px-5 py-4 text-base leading-relaxed"
                style={
                  msg.role === "assistant"
                    ? {
                        backgroundColor: "#501dff",
                        color: "#fff",
                        borderRadius: "20px 20px 20px 5px",
                      }
                    : {
                        backgroundColor: "#fff",
                        color: "#13044f",
                        borderRadius: "20px 20px 5px 20px",
                        boxShadow: "0 2px 12px #13044f0a",
                      }
                }
              >
                {msg.isTyping ? (
                  <span className="flex gap-1.5 items-center h-5 px-1">
                    <span className="typing-dot w-2 h-2 rounded-full" style={{ backgroundColor: "#fff" }} />
                    <span className="typing-dot w-2 h-2 rounded-full" style={{ backgroundColor: "#fff" }} />
                    <span className="typing-dot w-2 h-2 rounded-full" style={{ backgroundColor: "#fff" }} />
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

      {/* Input — no divider line */}
      <div className="px-4 pb-6 pt-2">
        <div
          className="max-w-2xl mx-auto flex gap-3 items-center rounded-2xl px-4 py-3"
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 4px 24px #13044f0e",
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
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-25"
            style={{ backgroundColor: "#501dff" }}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
