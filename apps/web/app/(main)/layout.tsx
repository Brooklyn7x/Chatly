import AuthGuard from "@/components/interface/AuthGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <main className="min-h-dvh bg-background">{children}</main>
    </AuthGuard>
  );
}
