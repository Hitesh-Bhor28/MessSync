"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/";
  };


  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              MessSync
            </h1>
            <p className="text-xs text-gray-500">
              {isAdmin ? "Admin Portal" : "Student Portal"}
            </p>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
