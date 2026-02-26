import Header from "@/components/layout/Header";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    redirect("/");
  }

  try {
    const decoded = jwt.verify(token, secret) as { role?: string };
    if (decoded.role !== "admin") {
      redirect("/");
    }
  } catch {
    redirect("/");
  }

  return (
    <>
      {/* Reuse header (logo + logout) */}
      <Header />

      {/* Admin-specific navbar */}
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
}
