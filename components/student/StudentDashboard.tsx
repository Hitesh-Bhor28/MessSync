"use client";

import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingDown,
} from "lucide-react";

import { useSelector } from "react-redux";
import type { RootState } from "../../app/redux/store";

interface StudentDashboardProps {
  onNavigateToSelection: () => void;
}

export default function StudentDashboard({
  onNavigateToSelection,
}: StudentDashboardProps) {
  const { name, todayMeals, tomorrowMeals, stats, loading, error } =
    useSelector((state: RootState) => state.dashboard);


  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ✅ Loading State
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  // ✅ No Data State
  if (!todayMeals || !tomorrowMeals) {
    return (
      <div className="text-center py-20 text-gray-500">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {name || "Student"}!
        </h2>
        <p className="text-green-100">
          Manage your meal preferences and help reduce food waste
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{today}</span>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                This Week
              </span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.weeklyMeals}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Meals Attended
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Saved
              </span>
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.savedMeals}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Meals Marked Absent
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Participation
              </span>
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.participation}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              On-Time Submission
            </div>
          </div>
        </div>
      )}


      {/* Today's Meals */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">
            Today's Meals
          </h3>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["breakfast", "lunch", "dinner"] as const).map(
            (meal) => (
              <div
                key={meal}
                className={`p-4 rounded-lg border-2 ${todayMeals[meal]
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
                  }`}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-2xl">
                    {meal === "breakfast"
                      ? "🌅"
                      : meal === "lunch"
                        ? "☀️"
                        : "🌙"}
                  </span>

                  {todayMeals[meal] ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="font-medium capitalize">
                  {meal}
                </div>

                <div
                  className={`text-sm font-medium mt-2 ${todayMeals[meal]
                    ? "text-green-700"
                    : "text-red-700"
                    }`}
                >
                  {todayMeals[meal]
                    ? "Attending"
                    : "Not Attending"}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Tomorrow's Meals */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Tomorrow's Meals
          </h3>

          <button
            onClick={onNavigateToSelection}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Update Selection
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["breakfast", "lunch", "dinner"] as const).map(
            (meal) => (
              <div
                key={meal}
                className={`p-4 rounded-lg border-2 ${tomorrowMeals[meal]
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
                  }`}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-2xl">
                    {meal === "breakfast"
                      ? "🌅"
                      : meal === "lunch"
                        ? "☀️"
                        : "🌙"}
                  </span>

                  {tomorrowMeals[meal] ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <div className="font-medium capitalize">
                  {meal}
                </div>

                <div
                  className={`text-sm font-medium mt-2 ${tomorrowMeals[meal]
                    ? "text-green-700"
                    : "text-gray-600"
                    }`}
                >
                  {tomorrowMeals[meal]
                    ? "Will Attend"
                    : "Will Skip"}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Your Environmental Impact
            </h3>
            <p className="text-blue-100 mb-4">
              By marking meals accurately, you've helped reduce food waste
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">
                  ~2.5 kg of food saved this month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">
                  Equivalent to 5 kg CO₂ reduction
                </span>
              </div>
            </div>
          </div>
          <div className="text-5xl">🌱</div>
        </div>
      </div>

    </div>
  );
}
