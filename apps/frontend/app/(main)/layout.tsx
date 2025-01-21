import AuthGuard from "@/components/shared/AuthGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <main className="min-h-dvh bg-background">{children}</main>
    </AuthGuard>
    // <main className="min-h-dvh bg-background">{children}</main>
  );
}
