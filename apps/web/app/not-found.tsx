"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6 text-center"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute -inset-8 bg-gradient-to-r from-pink-500 to-purple-500 blur-2xl opacity-20 rounded-full"
          />
          <h1 className="relative text-9xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          The page you're looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            Go Back
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
