"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
          style={{
            animation: "glow 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]"
          style={{
            animation: "glow 6s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]"
          style={{
            animation: "glow 6s ease-in-out infinite 4s",
          }}
        />
      </div>

      <div className="fixed top-4 right-4 flex items-center space-x-2">
        <Switch
          id="theme-mode"
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <Label htmlFor="theme-mode">
          {theme === "dark" ? "Dark" : "Light"}
        </Label>
      </div>

      {/* Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold">Chat Reimagined</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A new era of communication. Fast, secure, and beautifully simple.
          </p>
          <Button onClick={() => router.push("/login")} size="lg">
            Get Started
          </Button>
        </motion.div>
      </div>

      <div className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-muted-foreground">
              We're redefining what a chat experience can be
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Instant"
              description="Messages delivered in real-time"
              icon="⚡"
            />
            <FeatureCard
              title="Secure"
              description="End-to-end encryption for all chats"
              icon="🔒"
            />
            <FeatureCard
              title="Reliable"
              description="24/7 uptime guaranteed"
              icon="🌐"
            />
          </div>
        </div>
      </div>

      <footer className="py-8 text-center text-sm text-muted-foreground relative">
        © {new Date().getFullYear()} Chatly. All rights reserved.
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-background/50">
    <CardHeader className="text-center">
      <div className="w-12 h-12 rounded-full mb-6 flex items-center justify-center mx-auto bg-primary text-primary-foreground">
        <span className="text-2xl">{icon}</span>
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
);
