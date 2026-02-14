import Header from "@/components/layout/Header";
import AdminNavbar from "@/components/layout/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
