"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          Chat in Real Time, Simply
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-6 max-w-3xl leading-relaxed">
          A minimalist chat app with instant messaging and seamless
          connectivity. Experience the future of communication today.
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mb-16 px-4"
      >
        <FeatureCard
          title="Instant Messaging"
          description="Messages sent and received instantly."
        />
        <FeatureCard
          title="User-Friendly Interface"
          description="Clean, intuitive, and easy to use."
        />
        <FeatureCard
          title="Real-Time Connectivity"
          description="Stay connected with live updates."
        />
      </motion.section>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <button
          onClick={() => router.push("/login")}
          className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
        >
          Get Started
        </button>
      </motion.div>

      <footer className="mt-16 text-gray-400 text-sm">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  );
}

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-8 bg-gray-800/50 border border-gray-700 rounded-2xl shadow-lg text-center hover:bg-gray-800/70 transition-all duration-200"
  >
    <h3 className="text-2xl font-bold mb-4 text-gray-100">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
);
