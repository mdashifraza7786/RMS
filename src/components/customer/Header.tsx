"use client";

import { FiChevronLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import React from "react";

export default function CustomerHeader({ title, back = false }: { title: string; back?: boolean }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-white to-rose-50/80 backdrop-blur border-b px-4 py-3 flex items-center gap-3">
      {back ? (
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          <FiChevronLeft className="text-lg" />
        </button>
      ) : (
        <span className="w-9 h-9" />
      )}
      <div className="text-lg font-semibold flex-1 truncate text-gray-900">{title}</div>
      <span className="w-9 h-9" />
    </header>
  );
}


