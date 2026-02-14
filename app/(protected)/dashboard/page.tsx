"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDashboardData, setLoading } from "../../redux/slices/dashboardSlice";
import StudentDashboard from "@/components/student/StudentDashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        dispatch(setLoading(true));

        const res = await fetch("/api/student/dashboard", {
          credentials: "include",
        });

        const data = await res.json();

        dispatch(setDashboardData(data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, [dispatch]);

  return (
    <StudentDashboard
      onNavigateToSelection={() => router.push("/meals")}
    />
  );
}
