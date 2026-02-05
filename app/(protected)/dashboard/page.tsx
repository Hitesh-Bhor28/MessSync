"use client";

import { useRouter } from "next/navigation";
import StudentDashboard from "@/components/student/StudentDashboard";

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigateToSelection = () => {
    router.push("/meals");
  };

  return (
    <StudentDashboard
      onNavigateToSelection={handleNavigateToSelection}
    />
  );
}