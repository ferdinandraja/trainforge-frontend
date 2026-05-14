"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const publicPages = ["/", "/login", "/trainer-signup"];

  const isPublicPage = publicPages.includes(pathname);

  if (!isPublicPage) {
    return null;
  }

  return (
    <nav className="bg-slate-950 text-white px-8 py-5 flex justify-between items-center border-b border-slate-800">
      <Link href="/" className="text-3xl font-bold">
        TrainForge
      </Link>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-5 py-2 rounded-xl hover:bg-white/10 transition"
        >
          Login
        </Link>

        <Link
          href="/trainer-signup"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}