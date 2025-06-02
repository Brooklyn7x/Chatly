"use client";
import React from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Link from "next/link";
import { ArrowRight, Menu, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
];

export default function HeroSection() {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <>
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-card lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Image
                    src="/new-logo.svg"
                    alt="Chatly Logo"
                    width={80}
                    height={80}
                  />
                </Link>
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu
                    className={`m-auto size-6 duration-200 ${
                      menuState
                        ? "rotate-180 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    }`}
                  />
                  <X
                    className={`absolute inset-0 m-auto size-6 duration-200 ${
                      menuState
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-180 scale-0 opacity-0"
                    }`}
                  />
                </button>
              </div>
              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant={"secondary"}>
                    <Link href="/signup">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu overlay */}
        {menuState && (
          <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden">
            <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white dark:bg-zinc-950 shadow-lg p-6 flex flex-col">
              <button
                onClick={() => setMenuState(false)}
                aria-label="Close Menu"
                className="self-end mb-6"
              >
                <X className="size-6" />
              </button>
              <ul className="flex flex-col gap-6 text-lg">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block text-muted-foreground hover:text-accent-foreground"
                      onClick={() => setMenuState(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login" onClick={() => setMenuState(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/signup" onClick={() => setMenuState(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="overflow-hidden">
        <section className="relative py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="text-center">
              <Link
                href="/"
                className="rounded-md inline-flex items-center gap-2 bg-muted px-3 py-1 text-sm font-medium shadow-sm hover:bg-accent transition-all"
              >
                New
                <ArrowRight className="size-4" />
              </Link>
              <h1 className="mt-8 text-4xl font-bold lg:text-5xl">
                Connect Instantly.
                <br />
                Chat in Real Time.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Experience seamless, secure, and lightning-fast messaging with{" "}
                <b>Chatly</b> — your new favorite real-time chat app. Connect
                with friends, teams, or communities, share files, and stay in
                sync, wherever you are.
              </p>
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  asChild
                  variant="secondary"
                  className="hover:scale-105 transition-transform"
                >
                  <Link href="/login">
                    <Rocket className="mr-2 size-4 relative" />
                    Start Chatting
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
