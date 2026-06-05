"use client";

import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-50 text-red-500 p-6 rounded-full mb-6">
        <FaExclamationTriangle size={48} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred while trying to load this page.
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-4 rounded-lg text-left text-sm font-mono text-gray-800 mb-6 max-w-2xl overflow-auto w-full">
            <p className="font-bold text-red-600">{error.message}</p>
            {error.stack && <pre className="mt-2 text-xs">{error.stack}</pre>}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryhover transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
