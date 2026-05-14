"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-slate-700 px-5 py-3 rounded-2xl font-semibold shadow-sm transition"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}