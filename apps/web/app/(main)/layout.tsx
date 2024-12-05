export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-dvh bg-background">{children}</main>;
}
