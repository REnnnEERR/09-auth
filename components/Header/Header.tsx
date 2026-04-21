import Link from "next/link";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        NoteHub
      </Link>

      <nav>
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/">Home</Link>
          </li>

          <li className={css.navigationItem}>
            <Link href="/notes">Notes</Link>
          </li>

          {/* 🔐 AUTH LINKS */}
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}