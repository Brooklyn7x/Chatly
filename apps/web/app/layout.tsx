import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/provider/ThemeProvider";
import { SWRConfig } from "swr";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
  icons: "/logo.svg",
  title: "Chatly",
  description: "Chatting with fun!",
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
            <main>{children}</main>
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
