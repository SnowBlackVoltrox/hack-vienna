"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleFile(file: File) {
    // Store file name in sessionStorage and navigate to chat
    sessionStorage.setItem("uploadedDocument", file.name);
    router.push("/book?mode=document");
  }

  function handleDescribeManually() {
    router.push("/book?mode=manual");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f8f8" }}>
      {/* Nav */}
      <nav className="w-full px-8 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "#13044f" }}
          >
            notarity
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "#13044f" }}
          >
            How it works
          </a>
          <a
            href="#"
            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "#13044f" }}
          >
            About
          </a>
          <button
            className="text-sm font-semibold px-5 py-2 rounded-full transition-all hover:opacity-90"
            style={{ backgroundColor: "#501dff", color: "#fff" }}
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{ borderColor: "#501dff22", backgroundColor: "#501dff0d", color: "#501dff" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#501dff" }} />
            AI-powered notary booking
          </div>

          <h1
            className="text-5xl font-bold leading-tight tracking-tight mb-4"
            style={{ color: "#13044f" }}
          >
            From zero to notary<br />appointment in{" "}
            <span style={{ color: "#501dff" }}>3 minutes</span>
          </h1>

          <p
            className="text-lg leading-relaxed opacity-70"
            style={{ color: "#13044f" }}
          >
            Not sure what you need? Just upload your document or describe your
            situation — our assistant handles the rest.
          </p>
        </div>

        {/* Two action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Upload card */}
          <div
            className={`relative rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer border-2 transition-all group ${
              dragActive
                ? "border-solid scale-[1.01]"
                : "border-dashed hover:scale-[1.01]"
            }`}
            style={{
              backgroundColor: dragActive ? "#501dff08" : "#fff",
              borderColor: dragActive ? "#501dff" : "#501dff40",
              boxShadow: "0 2px 24px 0 #501dff0a",
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileInput}
            />

            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
              style={{ backgroundColor: "#501dff12" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 16V8M12 8L9 11M12 8L15 11"
                  stroke="#501dff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                  stroke="#501dff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="text-center">
              <p className="font-semibold text-base mb-1" style={{ color: "#13044f" }}>
                Upload your document
              </p>
              <p className="text-sm opacity-55" style={{ color: "#13044f" }}>
                Drag & drop or click to select
                <br />
                PDF, Word, or image
              </p>
            </div>

            <span
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all group-hover:opacity-90"
              style={{ backgroundColor: "#501dff", color: "#fff" }}
            >
              Choose file
            </span>
          </div>

          {/* Manual card */}
          <div
            className="relative rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer border-2 border-dashed transition-all group hover:scale-[1.01]"
            style={{
              backgroundColor: "#fff",
              borderColor: "#13044f20",
              boxShadow: "0 2px 24px 0 #13044f08",
            }}
            onClick={handleDescribeManually}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "#13044f0c" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 10H16M8 14H13M7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3Z"
                  stroke="#13044f"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="text-center">
              <p className="font-semibold text-base mb-1" style={{ color: "#13044f" }}>
                Describe your situation
              </p>
              <p className="text-sm opacity-55" style={{ color: "#13044f" }}>
                Tell us what you need in plain
                <br />
                language — no jargon required
              </p>
            </div>

            <span
              className="text-xs font-semibold px-4 py-2 rounded-full border-2 transition-all group-hover:opacity-80"
              style={{ borderColor: "#13044f", color: "#13044f", backgroundColor: "transparent" }}
            >
              Start typing
            </span>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-xs opacity-40 font-medium" style={{ color: "#13044f" }}>
            TRUSTED BY 1,000+ BUSINESSES WORLDWIDE
          </p>
          <div className="flex items-center gap-6 opacity-35 grayscale">
            {["refurbed", "Bitpanda", "Speedinvest", "Oyster"].map((name) => (
              <span
                key={name}
                className="text-sm font-semibold tracking-tight"
                style={{ color: "#13044f" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs opacity-30" style={{ color: "#13044f" }}>
          GDPR · eIDAS · KYC compliant · Certified data centre
        </p>
      </footer>
    </div>
  );
}
