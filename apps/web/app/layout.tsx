import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/provider/ThemeProvider";

export const metadata: Metadata = {
  icons: "/logo.svg",
  title: "MsgMate",
  description: "Chatting with fun!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> 
      </head>
      <body>
        <Toaster />
        <ThemeProvider defaultColor="default" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
