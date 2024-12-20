"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContainer from "../../components/auth/AuthContainer";
import useAuth from "@/hooks/useAuth";

const AuthPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  return <AuthContainer />;
};

export default AuthPage;
