"use client";

import { useEffect, useRef, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { AuthError, AUTH_ERROR_CODES } from "@/utils/errors";
import { Loading } from "@/components/ui/loading";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, isAuthenticated, logout } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const verificationTimer = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const handleVerificationError = (error: unknown) => {
    if (error instanceof AuthError) {
      switch (error.code) {
        case AUTH_ERROR_CODES.TOKEN_EXPIRED:
        case AUTH_ERROR_CODES.INVALID_TOKEN:
          logout();
          router.replace("/login");
          break;
        case AUTH_ERROR_CODES.NETWORK_ERROR:
          verificationTimer.current = setTimeout(verifyToken, 5000);
          break;
        default:
          setError(error);
      }
    } else {
      setError(new Error("An unexpected error occurred"));
    }
  };

  const verifyToken = async () => {
    if (!accessToken || !isAuthenticated) {
      setIsVerifying(false);
      return;
    }

    try {
      // await authApi.verify(accessToken);
      setError(null);
      verificationTimer.current = setTimeout(verifyToken, 4 * 60 * 1000);
    } catch (error) {
      handleVerificationError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (verificationTimer.current) {
      clearTimeout(verificationTimer.current);
    }

    verifyToken();

    return () => {
      if (verificationTimer.current) {
        clearTimeout(verificationTimer.current);
      }
    };
  }, [accessToken, isAuthenticated]);

  if (isVerifying) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error.message}</div>
      </div>
    );
  }

  return children;
}

export default AuthProvider;
