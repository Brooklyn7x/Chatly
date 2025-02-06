"use client";
import AuthGuard from "@/components/shared/AuthGuard";
import SideBar from "@/components/sidebar/Sidebar";
import { useSocketSetup } from "@/hooks/useSocketSetup";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSocketSetup();
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-dvh overflow-hidden">
        <SideBar />
        {children}
      </div>
    </AuthGuard>
  );
}
