import type { Metadata } from "next";
import Link from "next/link";
import css from "./NotFound.module.css";

export const metadata: Metadata = {
  title: "Page not found | NoteHub",
  description: "The page you are looking for does not exist",
  openGraph: {
    title: "404 — Page not found",
    description: "This page does not exist on NoteHub",
    url: "https://notehub.vercel.app/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Page not found",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div>
      <h1 className={css.title}>404</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">Go back home</Link>
    </div>
  );
}