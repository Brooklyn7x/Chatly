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
import { Logo } from "./logo";
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
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
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
        <section className="relative">
          <div className="relative py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                <Link
                  href="/"
                  className="rounded-md mx-auto flex w-fit items-center gap-2 border p-1 pr-3"
                >
                  <span className="bg-muted rounded-md px-2 py-1 text-xs">
                    New
                  </span>
                  <span className="text-sm">
                    Introducing Chatly: Real-Time Messaging
                  </span>
                  <span className="bg-(--color-border) block h-4 w-px"></span>
                  <ArrowRight className="size-4" />
                </Link>
                <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                  Connect Instantly.
                  <br />
                  Chat in Real Time.
                </h1>
                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">
                  Experience seamless, secure, and lightning-fast messaging with{" "}
                  <b>Chatly</b> — your new favorite real-time chat app. Connect
                  with friends, teams, or communities, share files, and stay in
                  sync, wherever you are.
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                  Chatly lets you message, share, and connect in real time —
                  fast, secure, and easy.
                </p>
                <div className="mt-8">
                  <Button size="lg" asChild variant={"secondary"}>
                    <Link href="/login">
                      <Rocket className="relative size-4" />
                      <span className="text-nowrap">Start Chatting</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="x-auto relative mx-auto mt-8 max-w-lg sm:mt-12">
                <div className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10"></div>
                <div className="absolute inset-x-0 top-12 -z-[1] mx-auto h-1/3 w-2/3 rounded-full bg-blue-300 blur-3xl dark:bg-white/20"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
