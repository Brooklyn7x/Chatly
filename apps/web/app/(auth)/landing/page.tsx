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
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function ChatLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block font-bold text-xl">
                ChatSync
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="#features"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#security"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Security
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Pricing
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
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
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-lg animate-in slide-in-from-top md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Security
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              FAQ
            </Link>
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
        </div>
      )}

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute top-2/3 right-1/4 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/10 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 py-24 md:py-32">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-block rounded-full bg-secondary px-3 py-1 text-sm mb-4">
                <span className="font-medium">End-to-End Encrypted</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Communicate Securely Across All Your Devices
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
                ChatSync brings your conversations together in one place with
                military-grade encryption, real-time messaging, and seamless
                multi-device sync.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Chatting Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="mt-6 text-center text-muted-foreground">
                <p>Trusted by over 5 million users worldwide</p>
                <div className="mt-4 flex flex-wrap justify-center gap-8">
                  <div className="h-8 w-32 bg-secondary/50 rounded"></div>
                  <div className="h-8 w-32 bg-secondary/50 rounded"></div>
                  <div className="h-8 w-32 bg-secondary/50 rounded"></div>
                  <div className="h-8 w-32 bg-secondary/50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-secondary/30 py-20">
          <div className="container px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Feature-Rich Messaging
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our chat application offers everything you need for modern
                communication.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Real-time Messaging</h3>
                  <p className="mt-2 text-muted-foreground">
                    Send and receive messages instantly with typing indicators
                    and read receipts across all your devices.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Group Conversations</h3>
                  <p className="mt-2 text-muted-foreground">
                    Create group chats with up to 500 members, with admin
                    controls and member permissions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Voice & Video Calls</h3>
                  <p className="mt-2 text-muted-foreground">
                    Crystal-clear voice and HD video calls with screen sharing
                    and up to 25 participants.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="py-20">
          <div className="container px-4">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Privacy-First Design
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Your conversations remain secure and private with our
                  comprehensive security measures.
                </p>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <Shield className="mr-2 h-6 w-6 flex-none text-primary" />
                    <div>
                      <h4 className="font-medium">End-to-End Encryption</h4>
                      <p className="text-muted-foreground">
                        Every message is encrypted on your device and can only
                        be decrypted by the intended recipient.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Shield className="mr-2 h-6 w-6 flex-none text-primary" />
                    <div>
                      <h4 className="font-medium">Self-Destructing Messages</h4>
                      <p className="text-muted-foreground">
                        Set messages to automatically disappear after being read
                        or after a specific time period.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Shield className="mr-2 h-6 w-6 flex-none text-primary" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-muted-foreground">
                        Add an extra layer of security to your account with SMS,
                        email, or authenticator app verification.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8">
                  <Button>
                    Learn More About Security{" "}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="rounded-lg border bg-card p-2 shadow-lg">
                  <div className="h-[400px] bg-secondary/40 rounded-md flex items-center justify-center">
                    <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-platform */}
        <section className="bg-secondary/30 py-20">
          <div className="container px-4">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <div className="rounded-lg border bg-card p-2 shadow-lg">
                  <div className="h-[400px] bg-secondary/40 rounded-md flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 w-32 rounded-lg bg-primary/10 flex items-center justify-center">
                        <div className="text-primary text-2xl font-bold">
                          iOS
                        </div>
                      </div>
                      <div className="h-32 w-32 rounded-lg bg-primary/10 flex items-center justify-center">
                        <div className="text-primary text-2xl font-bold">
                          Android
                        </div>
                      </div>
                      <div className="h-32 w-32 rounded-lg bg-primary/10 flex items-center justify-center">
                        <div className="text-primary text-2xl font-bold">
                          macOS
                        </div>
                      </div>
                      <div className="h-32 w-32 rounded-lg bg-primary/10 flex items-center justify-center">
                        <div className="text-primary text-2xl font-bold">
                          Windows
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Available Everywhere
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Stay connected across all your devices with perfect
                  synchronization.
                </p>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <Globe className="mr-2 h-6 w-6 flex-none text-primary" />
                    <div>
                      <h4 className="font-medium">Multi-Device Support</h4>
                      <p className="text-muted-foreground">
                        Use ChatSync on up to 8 devices simultaneously with
                        instant sync between them.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <Zap className="mr-2 h-6 w-6 flex-none text-primary" />
                    <div>
                      <h4 className="font-medium">Offline Functionality</h4>
                      <p className="text-muted-foreground">
                        Compose and read messages even without internet, with
                        automatic sync when you're back online.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <CheckCircle2 className="mr-2 h-6 w-6 flex-none text-primary" />
                    <div>
                      <h4 className="font-medium">Web Version</h4>
                      <p className="text-muted-foreground">
                        Access your conversations from any browser without
                        installing anything.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8">
                  <Button>
                    Download Apps <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="container px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that works best for your communication needs.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">Free</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited 1:1 chats</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Basic group chats (up to 10 people)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>1GB file sharing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Voice calls up to 10 minutes</span>
                    </li>
                  </ul>

                  <div className="mt-6">
                    <Button className="w-full" variant="outline">
                      Sign Up Free
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md ring-2 ring-primary">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">Pro</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$9.99</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>All Free features</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Advanced group chats (up to 100 people)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>10GB file sharing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited voice & video calls</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Message scheduling</span>
                    </li>
                  </ul>

                  <div className="mt-6">
                    <Button className="w-full">Get Pro</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">Business</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$29.99</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>All Pro features</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Enterprise groups (up to 500 people)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>100GB file sharing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Admin controls & analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>Dedicated support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                      <span>API access</span>
                    </li>
                  </ul>

                  <div className="mt-6">
                    <Button className="w-full" variant="outline">
                      Contact Sales
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-secondary/30 py-20">
          <div className="container px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Over 5 million users trust ChatSync for their daily
                communication.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-yellow-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-lg italic">
                    "ChatSync has completely transformed how our team
                    communicates. The end-to-end encryption gives us peace of
                    mind knowing our sensitive discussions remain private."
                  </blockquote>

                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary"></div>
                    <div className="ml-3">
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">
                        COO, TechStart Inc.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-yellow-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-lg italic">
                    "As someone who travels frequently, the multi-device sync is
                    a game-changer. I can seamlessly switch between my phone and
                    laptop without missing a beat."
                  </blockquote>

                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary"></div>
                    <div className="ml-3">
                      <p className="font-medium">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">
                        Digital Nomad
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5 text-yellow-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-lg italic">
                    "The video call quality is exceptional, even with multiple
                    participants. It's become our go-to platform for family
                    catch-ups across different time zones."
                  </blockquote>

                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary"></div>
                    <div className="ml-3">
                      <p className="font-medium">Emma Rodriguez</p>
                      <p className="text-sm text-muted-foreground">
                        Family Coordinator
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <div className="container px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get answers to common questions about ChatSync.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="border-b py-6">
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => {}}
                >
                  <h3 className="text-lg font-medium">
                    Is ChatSync really secure?
                  </h3>
                  <ChevronDown className="h-5 w-5" />
                </button>
                <div className="mt-3">
                  <p className="text-muted-foreground">
                    Yes, ChatSync uses end-to-end encryption for all messages,
                    calls, and shared files. This means only you and your
                    recipient can read the content. Even we cannot access your
                    conversations.
                  </p>
                </div>
              </div>

              <div className="border-b py-6">
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => {}}
                >
                  <h3 className="text-lg font-medium">
                    How many devices can I use with one account?
                  </h3>
                  <ChevronDown className="h-5 w-5" />
                </button>
                <div className="mt-3">
                  <p className="text-muted-foreground">
                    Free users can connect up to 3 devices, Pro users can
                    connect up to 5 devices, and Business users can connect up
                    to 8 devices simultaneously with one account.
                  </p>
                </div>
              </div>

              <div className="border-b py-6">
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => {}}
                >
                  <h3 className="text-lg font-medium">
                    Can I use ChatSync for business purposes?
                  </h3>
                  <ChevronDown className="h-5 w-5" />
                </button>
                <div className="mt-3">
                  <p className="text-muted-foreground">
                    Absolutely! Our Business plan is specifically designed for
                    professional use with features like admin controls, user
                    management, analytics, and compliance tools to meet
                    enterprise requirements.
                  </p>
                </div>
              </div>

              <div className="border-b py-6">
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => {}}
                >
                  <h3 className="text-lg font-medium">
                    What happens if I lose my device?
                  </h3>
                  <ChevronDown className="h-5 w-5" />
                </button>
                <div className="mt-3">
                  <p className="text-muted-foreground">
                    You can log into your account from our web portal and
                    remotely log out from any lost devices. For added security,
                    we recommend enabling two-factor authentication to prevent
                    unauthorized access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary/30 py-20">
          <div className="container px-4">
            <div className="rounded-lg bg-primary/10 p-8 md:p-12">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Start Chatting Securely Today
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Join millions of users who trust ChatSync for secure,
                  reliable, and feature-rich messaging.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Create Free Account{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">ChatSync</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Secure, feature-rich messaging platform for personal and
                business communication.
              </p>
              <div className="mt-4 flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <div className="h-8 w-8 rounded-full bg-secondary/50"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {[
                  "Features",
                  "Security",
                  "Mobile App",
                  "Desktop App",
                  "Web Version",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Customers", "Careers", "Blog", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {[
                  "Terms",
                  "Privacy",
                  "Cookies",
                  "Security Policy",
                  "Compliance",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} ChatSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
