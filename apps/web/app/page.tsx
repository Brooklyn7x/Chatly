"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-grey-800 text-grey-200 flex flex-col items-center justify-center p-4">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-4"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-grey-200">
          Chat in Real Time, Simply
        </h1>
        <p className="text-lg md:text-xl text-grey-400 mt-4 max-w-2xl">
          A minimalist chat app with instant messaging and seamless
          connectivity.
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mb-12 px-4"
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
          onClick={() => router.push("/chat")}
          className="px-8 py-4 bg-grey-600 border text-grey-200 text-lg font-semibold rounded-lg hover:bg-muted/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </motion.div>

      <footer className="mt-12 text-grey-400 text-sm">
        © {new Date().getFullYear()} ChatApp. All rights reserved.
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
  <motion.div className="p-6 bg-grey-800 border rounded-lg shadow-md text-center hover:bg-muted/50">
    <h3 className="text-xl font-semibold mb-2 text-grey-200">{title}</h3>
    <p className="text-grey-400">{description}</p>
  </motion.div>
);
