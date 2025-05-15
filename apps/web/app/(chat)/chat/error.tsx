"use client";

import { Button } from "@/components/ui/button";
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
    <div className="min-h-dvh flex flex-col items-center justify-center bg-secondary p-6">
      <div className="bg-black rounded-lg shadow-xl p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-300 mb-6">
          We encountered an error and are unable to process your request at the
          moment.
        </p>
        <Button
          variant={"outline"}
          onClick={reset}
          className="px-4 py-2 transition-colors rounded shadow text-white font-medium"
        >
          Try Again.!
        </Button>
      </div>
    </div>
  );
}
