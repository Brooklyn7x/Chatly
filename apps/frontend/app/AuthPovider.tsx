"use client";

import { useEffect, useRef, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { useRouter } from "next/navigation";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, isAuthenticated, logout } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const verificationTimer = useRef<NodeJS.Timeout>();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      if (!accessToken || !isAuthenticated) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/auth/verify", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("Token verification failed");
        }

        verificationTimer.current = setTimeout(verifyToken, 4 * 60 * 1000);
        setIsVerifying(false);
      } catch (error) {
        console.error("Auth verification failed:", error);
        await logout();
        router.replace("/login");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();

    return () => {
      if (verificationTimer.current) {
        clearTimeout(verificationTimer.current);
      }
    };
  }, [accessToken]);

  // useEffect(() => {
  //   const interceptor = axios.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       if (error.response?.status === 401) {
  //         await logout();
  //         router.replace("/login");
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     axios.interceptors.response.eject(interceptor);
  //   };
  // }, []);

  if (isVerifying) {
    return null;
  }

  return children;
}

export default AuthProvider;
