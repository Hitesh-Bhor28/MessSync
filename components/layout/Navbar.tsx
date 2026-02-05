"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `px-4 py-3 text-sm font-medium border-b-2 ${
      pathname === path
        ? "border-green-600 text-green-600"
        : "border-transparent text-gray-600 hover:text-gray-900"
    }`;

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        <Link href="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>
        <Link href="/meals" className={linkStyle("/meals")}>
          Meal Selection
        </Link>
        <Link href="/history" className={linkStyle("/history")}>
          History
        </Link>
      </div>
    </nav>
  );
}
