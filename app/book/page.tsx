"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BookPageContent() {
  const params = useSearchParams();
  const mode = params.get("mode");

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#f8f8f8" }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#13044f" }}>
          Chat flow coming soon
        </h1>
        <p className="opacity-50 text-sm" style={{ color: "#13044f" }}>
          Mode: {mode}
        </p>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookPageContent />
    </Suspense>
  );
}
