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

export const metadata: Metadata = {
  title: "Chatly",
  description: "Real-time chat application",
  keywords: [
    "chat",
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
            </main>
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
