import AuthGuard from "@/components/shared/AuthGuard";
import SideBar from "@/components/sidebar/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-dvh overflow-hidden">
        <SideBar />
        {children}
      </div>
    </AuthGuard>
  );
}
