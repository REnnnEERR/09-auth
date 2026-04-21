"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  };

  // ✅ НЕ АВТОРИЗОВАНИЙ
  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <a href="/sign-in" className={css.navigationLink}>
            Login
          </a>
        </li>

        <li className={css.navigationItem}>
          <a href="/sign-up" className={css.navigationLink}>
            Sign up
          </a>
        </li>
      </>
    );
  }

  // ✅ АВТОРИЗОВАНИЙ
  return (
    <>
      <li className={css.navigationItem}>
        <a href="/profile" className={css.navigationLink}>
          Profile
        </a>
      </li>

      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button
          type="button"
          onClick={handleLogout}
          className={css.logoutButton}
        >
          Logout
        </button>
      </li>
    </>
  );
}
``