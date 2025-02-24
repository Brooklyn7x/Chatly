"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-8 max-w-md text-center animate-fadeIn">
        <h2 className="text-3xl font-bold text-red-500 mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-300 mb-6">
          We encountered an error and are unable to process your request at the
          moment.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 border transition-colors rounded shadow text-white font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
