"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { Loading } from "@/components/ui/loading";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const PUBLIC_PATHS = ["/login", "/signup", "/"];
const DEFAULT_AUTH_PATH = "/login";
const DEFAULT_PRIVATE_PATH = "/chat";

export default function AuthGuard({
  children,
  requireAuth = true,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const isRootPath = pathname === "/chat";

    if (isRootPath) {
      if (isAuthenticated) {
        router.replace(DEFAULT_PRIVATE_PATH);
      } else {
        router.replace(DEFAULT_AUTH_PATH);
      }
      return;
    }

    if (!isAuthenticated && requireAuth && !isPublicPath) {
      router.replace(DEFAULT_AUTH_PATH);
    } else if (isAuthenticated && isPublicPath) {
      router.replace(DEFAULT_PRIVATE_PATH);
    }
  }, [isAuthenticated, pathname, requireAuth, router]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
