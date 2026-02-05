"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });

  // clear client storage
  localStorage.removeItem("token");

  router.replace("/");
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
            <h1 className="text-lg font-semibold text-gray-900">MessSync</h1>
            <p className="text-xs text-gray-500">Student Portal</p>
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
