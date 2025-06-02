import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import { SWRConfig } from "swr";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Analytics } from "@vercel/analytics/next";
import "sentry.client.config";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Chatly | Real-time chat with end-to-end encryption",
  description:
    "Real-time chat with end-to-end encryption and instant messaging, secure and private. Try it now!",
  keywords: [
    "chat",
    "chatly",
    "end-to-end encryption",
    "e2ee",
    "e2e encryption",
    "e2e",
    "encryption",
    "secure",
    "private",
    "messaging",
    "instant messaging",
    "communication",
    "social networking",
    "community",
    "user interaction",
    "user engagement",
    "chat application",
    "real-time chat",
    "chat app",
    "messaging",
    "instant messaging",
    "communication",
    "social networking",
    "community",
    "user interaction",
    "user engagement",
  ],

  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Chatly | Real-time chat with end-to-end encryption",
    description:
      "Real-time chat with end-to-end encryption and instant messaging, secure and private. Try it now!",
    images: [
      {
        url: "https://chatlyz.xyz/og.png",
        width: 1200,
        height: 630,
        alt: "Chatly",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateIfStale: false,
              revalidateOnMount: true,
            }}
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <main>
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
