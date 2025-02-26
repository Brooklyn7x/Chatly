// app/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  MessageSquare,
  Users,
  Shield,
  Globe,
  Zap,
  Phone,
  Send,
  Smile,
  Paperclip,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Create a reusable glow effect component
const GlowingBorder = ({
  children,
  className = "",
  intensity = "medium",
  color = "primary",
}) => {
  const glowIntensity = {
    light: "0 0 15px rgba(var(--primary), 0.15)",
    medium: "0 0 20px rgba(var(--primary), 0.25)",
    strong: "0 0 30px rgba(var(--primary), 0.35)",
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-lg -z-10 opacity-0"
        animate={{
          boxShadow: [
            glowIntensity[intensity],
            `0 0 ${intensity === "strong" ? 40 : 25}px rgba(var(--primary), ${intensity === "light" ? 0.25 : 0.45})`,
            glowIntensity[intensity],
          ],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      {children}
    </div>
  );
};

// Glow effect for text
const GlowingText = ({ children, className = "", color = "primary" }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{
        textShadow: [
          "0 0 5px rgba(var(--primary), 0.3)",
          "0 0 10px rgba(var(--primary), 0.5)",
          "0 0 5px rgba(var(--primary), 0.3)",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {children}
    </motion.span>
  );
};

// Animation variants for staggered children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// Smooth scroll function for navigation
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export default function ChatLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, message: "Hi there! 👋", sender: "them", time: "10:23 AM" },
    { id: 2, message: "Hello! How are you?", sender: "you", time: "10:24 AM" },
    {
      id: 3,
      message:
        "I'm doing great! Just trying out this new chat app called ChatSync.",
      sender: "them",
      time: "10:25 AM",
    },
  ]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // For scroll-triggered animations
  const [isVisible, setIsVisible] = useState({
    features: false,
    security: false,
    apps: false,
    pricing: false,
  });

  // Add scroll observer for animation triggers
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe each section
    const sections = ["features", "security", "apps", "pricing"];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  // Simulate progressive message rendering
  useEffect(() => {
    if (currentMessageIndex < chatMessages.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [
          ...prev,
          chatMessages[currentMessageIndex],
        ]);
        setIsTyping(false);
        setCurrentMessageIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex, chatMessages]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-110"
                whileHover={{ boxShadow: "0 0 15px rgba(var(--primary), 0.5)" }}
              >
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </motion.div>
              <span className="hidden sm:inline-block font-bold text-xl group-hover:text-primary transition-colors">
                ChatSync
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {["features", "security", "apps", "pricing"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-sm font-medium transition-colors hover:text-primary relative group outline-none"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-transform hover:scale-105"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="transition-transform hover:scale-105"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-30 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-lg md:hidden"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col space-y-4">
              {["features", "security", "apps", "pricing"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    scrollToSection(item);
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium transition-colors hover:text-primary text-left"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero section with interactive chat demo */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background decorative elements with subtle glow */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/5 blur-3xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.4, 0.3],
                boxShadow: [
                  "0 0 100px rgba(var(--primary), 0.1)",
                  "0 0 150px rgba(var(--primary), 0.15)",
                  "0 0 100px rgba(var(--primary), 0.1)",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
            <motion.div
              className="absolute top-2/3 right-1/4 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/10 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.5, 0.4],
                boxShadow: [
                  "0 0 100px rgba(var(--primary), 0.1)",
                  "0 0 150px rgba(var(--primary), 0.15)",
                  "0 0 100px rgba(var(--primary), 0.1)",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
            ></motion.div>
          </div>

          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="flex flex-col items-start text-left space-y-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className="inline-block rounded-full bg-secondary px-3 py-1 text-sm mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{
                    boxShadow: "0 0 10px rgba(var(--primary), 0.3)",
                  }}
                >
                  <span className="font-medium">End-to-End Encrypted</span>
                </motion.div>

                <GlowingText className="text-4xl font-bold tracking-tight sm:text-5xl block">
                  Connect Securely
                </GlowingText>

                <motion.h1
                  className="text-4xl font-bold tracking-tight sm:text-5xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Across All Devices
                </motion.h1>

                <motion.p
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  ChatSync brings your conversations together with
                  military-grade encryption, real-time messaging, and seamless
                  multi-device sync.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <GlowingBorder intensity="medium">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto group transition-all hover:scale-105 relative z-10"
                      >
                        Start Chatting Now
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </GlowingBorder>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto hover:bg-secondary/50 transition-all"
                      onClick={() => scrollToSection("features")}
                    >
                      See Features
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Interactive Chat Demo */}
              <GlowingBorder intensity="light" className="rounded-lg">
                <motion.div
                  className="rounded-lg border border-border shadow-xl overflow-hidden mx-auto w-full max-w-md bg-background/80"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: 0.4,
                  }}
                >
                  <div className="bg-secondary/40 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/20 relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Alex Taylor</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <motion.span
                            className="mr-1.5 h-2 w-2 rounded-full bg-green-500"
                            animate={{
                              boxShadow: [
                                "0 0 2px rgba(74, 222, 128, 0.5)",
                                "0 0 4px rgba(74, 222, 128, 0.8)",
                                "0 0 2px rgba(74, 222, 128, 0.5)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          ></motion.span>
                          Online
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                      <MessageSquare className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    </div>
                  </div>

                  <div className="bg-background p-4 h-80 overflow-y-auto flex flex-col space-y-4">
                    {visibleMessages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.sender === "you"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          }`}
                          whileHover={{
                            boxShadow:
                              msg.sender === "you"
                                ? "0 0 10px rgba(var(--primary), 0.5)"
                                : "0 0 10px rgba(var(--secondary), 0.5)",
                          }}
                        >
                          <p>{msg.message}</p>
                          <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                        </motion.div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary">
                          <div className="flex space-x-1">
                            <motion.div
                              className="h-2 w-2 rounded-full bg-muted-foreground"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                              }}
                            ></motion.div>
                            <motion.div
                              className="h-2 w-2 rounded-full bg-muted-foreground"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: 0.15,
                              }}
                            ></motion.div>
                            <motion.div
                              className="h-2 w-2 rounded-full bg-muted-foreground"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: 0.3,
                              }}
                            ></motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="bg-secondary/40 p-3 border-t flex items-center">
                    <Smile className="h-6 w-6 text-muted-foreground mr-2 cursor-pointer hover:text-primary transition-colors" />
                    <Paperclip className="h-6 w-6 text-muted-foreground mr-2 cursor-pointer hover:text-primary transition-colors" />
                    <div className="flex-1 bg-background rounded-full px-4 py-2 text-sm text-muted-foreground">
                      Type a message...
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(var(--primary), 0.2)",
                          "0 0 5px rgba(var(--primary), 0.5)",
                          "0 0 0 rgba(var(--primary), 0.2)",
                        ],
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                        },
                      }}
                      className="ml-2 rounded-full p-1"
                    >
                      <Send className="h-6 w-6 text-primary cursor-pointer" />
                    </motion.div>
                  </div>
                </motion.div>
              </GlowingBorder>
            </div>
          </div>
        </section>

        {/* Features with app interface */}
        <section
          id="features"
          className="bg-secondary/30 py-20 overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <GlowingText className="text-3xl font-bold tracking-tight sm:text-4xl block mb-4">
                Feature-Rich Messaging
              </GlowingText>
              <p className="text-lg text-muted-foreground">
                Our chat application offers everything you need for modern
                communication.
              </p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-2 items-center">
              <motion.div
                className="order-2 md:order-1"
                variants={containerVariants}
                initial="hidden"
                animate={isVisible.features ? "visible" : "hidden"}
              >
                <div className="grid gap-6">
                  <motion.div
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="mt-1 mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(var(--primary), 0.3)",
                            "0 0 8px rgba(var(--primary), 0.6)",
                            "0 0 0 rgba(var(--primary), 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="rounded-lg"
                      >
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Real-time Messaging</h3>
                      <p className="mt-2 text-muted-foreground">
                        Send and receive messages instantly with typing
                        indicators and read receipts across all your devices.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="mt-1 mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(var(--primary), 0.3)",
                            "0 0 8px rgba(var(--primary), 0.6)",
                            "0 0 0 rgba(var(--primary), 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.6,
                        }}
                        className="rounded-lg"
                      >
                        <Users className="h-5 w-5 text-primary" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Group Conversations</h3>
                      <p className="mt-2 text-muted-foreground">
                        Create group chats with up to 500 members, with admin
                        controls and member permissions.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <div className="mt-1 mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(var(--primary), 0.3)",
                            "0 0 8px rgba(var(--primary), 0.6)",
                            "0 0 0 rgba(var(--primary), 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 1.2,
                        }}
                        className="rounded-lg"
                      >
                        <Phone className="h-5 w-5 text-primary" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Voice & Video Calls</h3>
                      <p className="mt-2 text-muted-foreground">
                        Crystal-clear voice and HD video calls with screen
                        sharing and up to 25 participants.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Chat interface preview for features section */}
              <motion.div
                className="order-1 md:order-2 flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible.features ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <GlowingBorder intensity="light" className="rounded-[2.5rem]">
                  <div className="relative">
                    {/* Main phone frame */}
                    <div className="border-8 border-secondary rounded-[2.5rem] shadow-xl w-full max-w-[300px] mx-auto overflow-hidden">
                      <div className="bg-background h-[550px] relative">
                        {/* Status bar */}
                        <div className="bg-secondary/40 py-2 px-4 flex justify-between items-center">
                          <div className="text-xs font-medium">9:41</div>
                          <div className="flex gap-1">
                            <motion.div
                              className="h-3 w-3 rounded-full bg-primary/70"
                              animate={{
                                boxShadow: [
                                  "0 0 0px rgba(var(--primary), 0.5)",
                                  "0 0 3px rgba(var(--primary), 0.8)",
                                  "0 0 0px rgba(var(--primary), 0.5)",
                                ],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            ></motion.div>
                            <div className="h-3 w-3 rounded-full bg-muted-foreground/70"></div>
                          </div>
                        </div>

                        {/* App header */}
                        <div className="p-4 border-b">
                          <h3 className="font-bold text-lg flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                            ChatSync
                          </h3>
                        </div>

                        {/* Chat list */}
                        <div className="overflow-y-auto h-[430px]">
                          {/* Active chat with glow */}
                          <motion.div
                            className="p-3 flex items-center bg-primary/5 relative"
                            whileHover={{
                              backgroundColor: "rgba(var(--primary), 0.1)",
                            }}
                          >
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex-shrink-0"></div>
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">Team ChatSync</p>
                                <p className="text-xs text-muted-foreground">
                                  9:41 AM
                                </p>
                              </div>
                              <div className="flex justify-between">
                                <p className="text-sm text-muted-foreground truncate w-36">
                                  Let's discuss the new features
                                </p>
                                <motion.div
                                  className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground"
                                  animate={{
                                    boxShadow: [
                                      "0 0 0px rgba(var(--primary), 0.5)",
                                      "0 0 4px rgba(var(--primary), 0.8)",
                                      "0 0 0px rgba(var(--primary), 0.5)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                  }}
                                >
                                  3
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Other chats */}
                          {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                              key={i}
                              className="p-3 flex items-center border-t hover:bg-secondary/30 transition-colors cursor-pointer"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="h-12 w-12 rounded-full bg-secondary flex-shrink-0"></div>
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">Contact {i}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Yesterday
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  Latest message preview...
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Navigation bar with glowing active icon */}
                        <div className="absolute bottom-0 left-0 right-0 border-t bg-secondary/40 py-2 px-4 flex justify-around">
                          <motion.div
                            animate={{
                              boxShadow: [
                                "0 0 0px rgba(var(--primary), 0.3)",
                                "0 0 5px rgba(var(--primary), 0.6)",
                                "0 0 0px rgba(var(--primary), 0.3)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="rounded-md p-1"
                          >
                            <MessageSquare className="h-6 w-6 text-primary cursor-pointer" />
                          </motion.div>
                          <Users className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition-all" />
                          <Phone className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-primary hover:scale-110 transition-all" />
                          <div className="h-6 w-6 rounded-full bg-secondary cursor-pointer hover:scale-110 transition-transform"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowingBorder>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security section with visual enhancements */}
        <section id="security" className="py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible.security ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, type: "spring" }}
              >
                <GlowingText className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 block">
                  Privacy-First Design
                </GlowingText>
                <p className="mt-4 text-lg text-muted-foreground">
                  Your conversations remain secure and private with our
                  comprehensive security measures.
                </p>

                <motion.ul
                  className="mt-8 space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate={isVisible.security ? "visible" : "hidden"}
                >
                  <motion.li
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(var(--primary), 0.3)",
                          "0 0 5px rgba(var(--primary), 0.6)",
                          "0 0 0px rgba(var(--primary), 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mr-2 rounded-md p-0.5"
                    >
                      <Shield className="h-6 w-6 flex-none text-primary" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium">End-to-End Encryption</h4>
                      <p className="text-muted-foreground">
                        Every message is encrypted on your device and can only
                        be decrypted by the intended recipient.
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(var(--primary), 0.3)",
                          "0 0 5px rgba(var(--primary), 0.6)",
                          "0 0 0px rgba(var(--primary), 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                      className="mr-2 rounded-md p-0.5"
                    >
                      <Shield className="h-6 w-6 flex-none text-primary" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium">Self-Destructing Messages</h4>
                      <p className="text-muted-foreground">
                        Set messages to automatically disappear after being read
                        or after a specific time period.
                      </p>
                    </div>
                  </motion.li>

                  <motion.li
                    className="flex items-start"
                    variants={itemVariants}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(var(--primary), 0.3)",
                          "0 0 5px rgba(var(--primary), 0.6)",
                          "0 0 0px rgba(var(--primary), 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                      className="mr-2 rounded-md p-0.5"
                    >
                      <Shield className="h-6 w-6 flex-none text-primary" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-muted-foreground">
                        Add an extra layer of security to your account with SMS,
                        email, or authenticator app verification.
                      </p>
                    </div>
                  </motion.li>
                </motion.ul>

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.security ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <GlowingBorder
                    intensity="light"
                    className="inline-block rounded-md"
                  >
                    <Button className="group relative z-10">
                      Learn More About Security
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </GlowingBorder>
                </motion.div>
              </motion.div>

              {/* Security visualization */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible.security ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, type: "spring", delay: 0.2 }}
              >
                <GlowingBorder
                  className="bg-secondary/20 rounded-lg p-6 border border-border max-w-md w-full"
                  intensity="light"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-8">
                      {/* Sender device */}
                      <motion.div
                        className="h-16 w-12 rounded-lg bg-secondary border border-border flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </motion.div>

                      {/* Encryption animation */}
                      <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-primary/80 to-primary/20">
                        <motion.div
                          className="absolute -top-1 left-0 h-2 w-2 rounded-full bg-primary"
                          animate={{
                            x: ["0%", "100%"],
                            opacity: [1, 0.8, 0],
                            boxShadow: [
                              "0 0 0px rgba(var(--primary), 0.5)",
                              "0 0 5px rgba(var(--primary), 0.8)",
                              "0 0 0px rgba(var(--primary), 0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            times: [0, 0.8, 1],
                          }}
                        ></motion.div>
                        <motion.div
                          className="absolute -top-1 left-0 h-2 w-2 rounded-full bg-primary"
                          animate={{
                            x: ["0%", "100%"],
                            opacity: [1, 0.8, 0],
                            boxShadow: [
                              "0 0 0px rgba(var(--primary), 0.5)",
                              "0 0 5px rgba(var(--primary), 0.8)",
                              "0 0 0px rgba(var(--primary), 0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.5,
                            times: [0, 0.8, 1],
                          }}
                        ></motion.div>
                        <motion.div
                          className="absolute -top-1 left-0 h-2 w-2 rounded-full bg-primary"
                          animate={{
                            x: ["0%", "100%"],
                            opacity: [1, 0.8, 0],
                            boxShadow: [
                              "0 0 0px rgba(var(--primary), 0.5)",
                              "0 0 5px rgba(var(--primary), 0.8)",
                              "0 0 0px rgba(var(--primary), 0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 1,
                            times: [0, 0.8, 1],
                          }}
                        ></motion.div>
                      </div>

                      {/* Receiver device */}
                      <motion.div
                        className="absolute right-0 top-0 h-16 w-12 rounded-lg bg-secondary border border-border flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </motion.div>

                      {/* Lock icons */}
                      <motion.div
                        className="absolute left-14 top-0 bg-primary text-primary-foreground p-1 rounded-full"
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(var(--primary), 0.5)",
                            "0 0 5px rgba(var(--primary), 0.8)",
                            "0 0 0px rgba(var(--primary), 0.5)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Shield className="h-3 w-3" />
                      </motion.div>
                      <motion.div
                        className="absolute right-14 top-0 bg-primary text-primary-foreground p-1 rounded-full"
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(var(--primary), 0.5)",
                            "0 0 5px rgba(var(--primary), 0.8)",
                            "0 0 0px rgba(var(--primary), 0.5)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        <Shield className="h-3 w-3" />
                      </motion.div>
                    </div>

                    <motion.div
                      className="bg-background border border-border rounded-lg p-4 shadow-lg max-w-xs w-full"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div className="text-sm text-center mb-2 font-medium">
                        End-to-End Encrypted Message
                      </div>
                      <motion.div
                        className="h-4 w-full bg-primary/10 rounded-full mb-2"
                        animate={{
                          backgroundColor: [
                            "rgba(var(--primary), 0.1)",
                            "rgba(var(--primary), 0.2)",
                            "rgba(var(--primary), 0.1)",
                          ],
                          boxShadow: [
                            "0 0 0px rgba(var(--primary), 0.1)",
                            "0 0 3px rgba(var(--primary), 0.3)",
                            "0 0 0px rgba(var(--primary), 0.1)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      ></motion.div>
                      <motion.div
                        className="h-4 w-3/4 bg-primary/10 rounded-full mb-2"
                        animate={{
                          backgroundColor: [
                            "rgba(var(--primary), 0.1)",
                            "rgba(var(--primary), 0.2)",
                            "rgba(var(--primary), 0.1)",
                          ],
                          boxShadow: [
                            "0 0 0px rgba(var(--primary), 0.1)",
                            "0 0 3px rgba(var(--primary), 0.3)",
                            "0 0 0px rgba(var(--primary), 0.1)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 0.3,
                        }}
                      ></motion.div>
                      <motion.div
                        className="h-4 w-5/6 bg-primary/10 rounded-full"
                        animate={{
                          backgroundColor: [
                            "rgba(var(--primary), 0.1)",
                            "rgba(var(--primary), 0.2)",
                            "rgba(var(--primary), 0.1)",
                          ],
                          boxShadow: [
                            "0 0 0px rgba(var(--primary), 0.1)",
                            "0 0 3px rgba(var(--primary), 0.3)",
                            "0 0 0px rgba(var(--primary), 0.1)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 0.6,
                        }}
                      ></motion.div>
                      <div className="mt-4 flex justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 0 0px rgba(var(--primary), 0.3)",
                              "0 0 8px rgba(var(--primary), 0.6)",
                              "0 0 0px rgba(var(--primary), 0.3)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          }}
                        >
                          <Shield className="h-8 w-8 text-primary" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="mt-8 text-sm font-medium text-center max-w-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      Only you and the recipient can read these messages. Not
                      even ChatSync can access your conversations.
                    </motion.div>
                  </div>
                </GlowingBorder>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Apps section */}
        <section id="apps" className="bg-secondary/30 py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.apps ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <GlowingText className="text-3xl font-bold tracking-tight sm:text-4xl block mb-4">
                Available Everywhere
              </GlowingText>
              <p className="text-lg text-muted-foreground">
                Stay connected across all your devices with perfect
                synchronization.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate={isVisible.apps ? "visible" : "hidden"}
            >
              {[
                { name: "iOS", icon: "📱" },
                { name: "Android", icon: "🤖" },
                { name: "macOS", icon: "💻" },
                { name: "Windows", icon: "🪟" },
              ].map((platform, index) => (
                <motion.div
                  key={platform.name}
                  className="bg-background rounded-lg border border-border p-6 flex flex-col items-center text-center"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <GlowingBorder
                    intensity="light"
                    className="rounded-full mb-4"
                  >
                    <motion.div
                      className="text-4xl p-2"
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      {platform.icon}
                    </motion.div>
                  </GlowingBorder>
                  <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    Seamless experience optimized for {platform.name} devices.
                  </p>
                  <Button variant="outline" className="mt-auto group">
                    <span>Download</span>
                    <motion.span
                      className="ml-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4 inline" />
                    </motion.span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-12 rounded-lg p-6 text-center max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.apps ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlowingBorder intensity="medium" className="p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Web Version</h3>
                <p className="text-muted-foreground mb-4">
                  Access your conversations from any browser without installing
                  anything.
                </p>
                <Button className="group">
                  Open Web App
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.span>
                </Button>
              </GlowingBorder>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <GlowingText className="text-3xl font-bold tracking-tight sm:text-4xl block mb-4">
                Frequently Asked Questions
              </GlowingText>
              <p className="text-lg text-muted-foreground">
                Get answers to common questions about ChatSync.
              </p>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {[
                {
                  question: "Is ChatSync really secure?",
                  answer:
                    "Yes, ChatSync uses end-to-end encryption for all messages, calls, and shared files. This means only you and your recipient can read the content. Even we cannot access your conversations.",
                },
                {
                  question: "How many devices can I use with one account?",
                  answer:
                    "Free users can connect up to 3 devices, Pro users can connect up to 5 devices, and Business users can connect up to 8 devices simultaneously with one account.",
                },
                {
                  question: "Can I use ChatSync for business purposes?",
                  answer:
                    "Absolutely! Our Business plan is specifically designed for professional use with features like admin controls, user management, analytics, and compliance tools to meet enterprise requirements.",
                },
                {
                  question: "What happens if I lose my device?",
                  answer:
                    "You can log into your account from our web portal and remotely log out from any lost devices. For added security, we recommend enabling two-factor authentication to prevent unauthorized access.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="border-b py-6"
                  variants={itemVariants}
                >
                  <GlowingBorder intensity="light" className="rounded-md">
                    <motion.button
                      className="flex w-full items-center justify-between text-left p-4 rounded-md bg-background"
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <h3 className="text-lg font-medium">{faq.question}</h3>
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(var(--primary), 0.3)",
                            "0 0 5px rgba(var(--primary), 0.6)",
                            "0 0 0px rgba(var(--primary), 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                        className="rounded-full p-1"
                      >
                        <ChevronDown className="h-5 w-5 text-primary" />
                      </motion.div>
                    </motion.button>
                  </GlowingBorder>
                  <motion.div
                    className="mt-3 px-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <GlowingBorder
              intensity="strong"
              className="rounded-lg p-8 md:p-12 relative overflow-hidden"
            >
              <motion.div
                className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/5 -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.div>

              <div className="text-center max-w-2xl mx-auto relative z-10">
                <GlowingText className="text-3xl font-bold tracking-tight sm:text-4xl block mb-4">
                  Start Chatting Securely Today
                </GlowingText>
                <motion.p
                  className="mt-4 text-lg text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Join millions of users who trust ChatSync for secure,
                  reliable, and feature-rich messaging.
                </motion.p>
                <motion.div
                  className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <GlowingBorder intensity="medium">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto group transition-all hover:scale-105 relative z-10"
                      >
                        Create Free Account
                        <motion.span
                          className="ml-2 inline-block"
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.span>
                      </Button>
                    </Link>
                  </GlowingBorder>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto transition-all hover:bg-secondary/50"
                    >
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </GlowingBorder>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        className="border-t bg-background/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto py-12 px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlowingBorder
                intensity="light"
                className="inline-flex items-center space-x-2 rounded-full p-1"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">ChatSync</span>
              </GlowingBorder>
              <p className="mt-4 text-sm text-muted-foreground">
                Secure, feature-rich messaging platform for personal and
                business communication.
              </p>
              <div className="mt-4 flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                    whileHover={{ y: -5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <GlowingBorder
                      intensity="light"
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                    >
                      {i === 1 && (
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      )}
                      {i === 2 && (
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      )}
                      {i === 3 && (
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      )}
                      {i === 4 && (
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          ></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      )}
                    </GlowingBorder>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {[
                  "Features",
                  "Security",
                  "Mobile App",
                  "Desktop App",
                  "Web Version",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors group flex items-center"
                    >
                      <span className="h-px w-0 bg-primary mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Customers", "Careers", "Blog", "Contact"].map(
                  (item, i) => (
                    <motion.li
                      key={item}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors group flex items-center"
                      >
                        <span className="h-px w-0 bg-primary mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                        {item}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {[
                  "Terms",
                  "Privacy",
                  "Cookies",
                  "Security Policy",
                  "Compliance",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors group flex items-center"
                    >
                      <span className="h-px w-0 bg-primary mr-0 transition-all duration-300 group-hover:w-2 group-hover:mr-2"></span>
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.p
              animate={{
                textShadow: [
                  "0 0 0px rgba(var(--primary), 0)",
                  "0 0 2px rgba(var(--primary), 0.3)",
                  "0 0 0px rgba(var(--primary), 0)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              &copy; {new Date().getFullYear()} ChatSync. All rights reserved.
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
