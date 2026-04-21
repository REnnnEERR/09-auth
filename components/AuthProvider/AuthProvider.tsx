"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const user = await checkSession();

        const isPrivateRoute =
          pathname.startsWith("/profile") || pathname.startsWith("/notes");

        if (!user && isPrivateRoute) {
          clearIsAuthenticated();
          router.push("/sign-in");
        }

        if (user) {
          setUser(user);
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}