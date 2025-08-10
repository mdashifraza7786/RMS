"use client";

import React from "react";

export default function LoadingBar() {
  return (
    <div className="w-full h-1 overflow-hidden rounded-full bg-gray-200">
      <div className="h-full w-1/3 bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 animate-[loadingbar_1.2s_ease_infinite]" />
      <style jsx>{`
        @keyframes loadingbar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}


