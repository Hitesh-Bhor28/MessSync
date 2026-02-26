"use client";

import { useEffect, useState } from 'react';
import { Calendar, Users, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MealMetric {
  count: number;
  total: number;
  percentage: number;
  change: number;
}

interface DashboardData {
  totalStudents: number;
  responses: number;
  avgAttendance: number;
  pending: number;
  served: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  meals: {
    breakfast: MealMetric;
    lunch: MealMetric;
    dinner: MealMetric;
  };
}

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState('tomorrow');
  const [customDate, setCustomDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [data, setData] = useState<DashboardData>({
    totalStudents: 0,
    responses: 0,
    avgAttendance: 0,
    pending: 0,
    served: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    },
    meals: {
      breakfast: { count: 0, total: 0, percentage: 0, change: 0 },
      lunch: { count: 0, total: 0, percentage: 0, change: 0 },
      dinner: { count: 0, total: 0, percentage: 0, change: 0 },
    },
  });
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [servedCounts, setServedCounts] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [isSavingServed, setIsSavingServed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reminderToast, setReminderToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isExportingDaily, setIsExportingDaily] = useState(false);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const dateQuery =
          selectedDate === 'custom' ? customDate : selectedDate;
        const res = await fetch(`/api/admin/dashboard?date=${dateQuery}`, {
          credentials: 'include',
        });
        const payload = await res.json();

        if (!res.ok) {
          throw new Error(payload?.message || 'Failed to load dashboard');
        }

        if (!ignore) {
          setData(payload);
          setServedCounts({
            breakfast: payload?.served?.breakfast ?? 0,
            lunch: payload?.served?.lunch ?? 0,
            dinner: payload?.served?.dinner ?? 0,
          });
        }
      } catch (err: any) {
        if (!ignore) {
          setData({
            totalStudents: 0,
            responses: 0,
            avgAttendance: 0,
            pending: 0,
            served: {
              breakfast: 0,
              lunch: 0,
              dinner: 0,
            },
            meals: {
              breakfast: { count: 0, total: 0, percentage: 0, change: 0 },
              lunch: { count: 0, total: 0, percentage: 0, change: 0 },
              dinner: { count: 0, total: 0, percentage: 0, change: 0 },
            },
          });
          setServedCounts({
            breakfast: 0,
            lunch: 0,
            dinner: 0,
          });
          setError(err?.message || "Failed to load dashboard");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [selectedDate, customDate]);

  const mealData = data.meals;
  const dateQuery =
    selectedDate === 'custom' ? customDate : selectedDate;
  const expectedTotal =
    mealData.breakfast.count + mealData.lunch.count + mealData.dinner.count;
  const servedTotal =
    data.served.breakfast + data.served.lunch + data.served.dinner;
  const wasteTotal = Math.max(expectedTotal - servedTotal, 0);
  const accuracyPercent = expectedTotal
    ? Math.round((servedTotal / expectedTotal) * 100)
    : 0;

  const handleSendReminders = async () => {
    if (isSendingReminders) return;
    setIsSendingReminders(true);

    try {
      const res = await fetch(`/api/admin/reminders?date=${dateQuery}`, {
        method: 'POST',
        credentials: 'include',
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.message || 'Failed to send reminders');
      }

      setReminderToast({
        type: "success",
        message: payload?.message || "Reminders sent.",
      });
      setTimeout(() => {
        setReminderToast(null);
      }, 3000);
    } catch (err: any) {
      setReminderToast({
        type: "error",
        message: err?.message || "Failed to send reminders",
      });
      setTimeout(() => {
        setReminderToast(null);
      }, 3000);
    } finally {
      setIsSendingReminders(false);
    }
  };

  const handleSaveServed = async () => {
    if (isSavingServed) return;
    setIsSavingServed(true);

    try {
      await fetch("/api/admin/served", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateQuery,
          meals: servedCounts,
        }),
      });
      setData((prev) => ({
        ...prev,
        served: {
          breakfast: servedCounts.breakfast,
          lunch: servedCounts.lunch,
          dinner: servedCounts.dinner,
        },
      }));
    } finally {
      setIsSavingServed(false);
    }
  };

  const handleExportDaily = async () => {
    if (isExportingDaily) return;
    setIsExportingDaily(true);

    try {
      const res = await fetch(
        `/api/admin/reports/export/daily/pdf?date=${dateQuery}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to export daily report");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `daily-report-${dateQuery}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingDaily(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-sm text-gray-500">
          Loading dashboard...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
      {reminderToast && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg z-50 text-white ${
            reminderToast.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {reminderToast.message}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Meal Demand Dashboard</h2>
          <p className="text-gray-600">
            View expected student count for each meal and plan accordingly
          </p>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Select Date</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedDate('tomorrow')}
            className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
              selectedDate === 'tomorrow'
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Tomorrow
            <div className="text-sm font-normal mt-1">{getTomorrowDate()}</div>
          </button>
          <div className="flex-1">
            <button
              onClick={() => setSelectedDate('custom')}
              className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                selectedDate === 'custom'
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              Custom Date
              <div className="text-sm font-normal mt-1">Select any date</div>
            </button>
            {selectedDate === 'custom' && (
              <div className="mt-3">
                <input
                  type="date"
                  value={customDate}
                  onChange={(event) => setCustomDate(event.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.totalStudents}</div>
          <div className="text-sm text-gray-500 mt-1">Hostel capacity</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Responses</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.responses}</div>
          <div className="text-sm text-gray-500 mt-1">
            {data.totalStudents
              ? Math.round((data.responses / data.totalStudents) * 100)
              : 0}% submitted
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Avg Attendance</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.avgAttendance}%</div>
          <div className="text-sm text-gray-500 mt-1">Across all meals</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pending</span>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.pending}</div>
          <div className="text-sm text-gray-500 mt-1">Not yet submitted</div>
        </div>
      </div>

      {/* Served vs Expected */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-2">Expected Meals</div>
          <div className="text-3xl font-bold text-gray-900">{expectedTotal}</div>
          <div className="text-sm text-gray-500 mt-1">Based on submissions</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-2">Served Meals</div>
          <div className="text-3xl font-bold text-gray-900">{servedTotal}</div>
          <div className="text-sm text-gray-500 mt-1">Recorded by admin</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-2">Accuracy & Waste</div>
          <div className="text-3xl font-bold text-gray-900">{accuracyPercent}%</div>
          <div className="text-sm text-gray-500 mt-1">{wasteTotal} meals waste</div>
        </div>
      </div>

      {/* Meal-wise Demand */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
          <h3 className="font-semibold text-lg">Meal-wise Expected Demand</h3>
          <p className="text-green-100 text-sm mt-1">Based on student submissions</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Breakfast */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  🌅
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Breakfast</h4>
                  <p className="text-sm text-gray-600">7:00 AM - 9:00 AM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{mealData.breakfast.count}</div>
                <div className="text-sm text-gray-600">students</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Expected attendance</span>
                <span className="font-medium text-gray-900">{mealData.breakfast.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mealData.breakfast.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{mealData.breakfast.count} of {mealData.breakfast.total} students</span>
                <span className={`font-medium ${mealData.breakfast.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mealData.breakfast.change > 0 ? '+' : ''}{mealData.breakfast.change}% vs last week
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Lunch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                  ☀️
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Lunch</h4>
                  <p className="text-sm text-gray-600">12:30 PM - 2:30 PM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{mealData.lunch.count}</div>
                <div className="text-sm text-gray-600">students</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Expected attendance</span>
                <span className="font-medium text-gray-900">{mealData.lunch.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mealData.lunch.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{mealData.lunch.count} of {mealData.lunch.total} students</span>
                <span className={`font-medium ${mealData.lunch.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mealData.lunch.change > 0 ? '+' : ''}{mealData.lunch.change}% vs last week
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Dinner */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                  🌙
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Dinner</h4>
                  <p className="text-sm text-gray-600">7:00 PM - 9:00 PM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{mealData.dinner.count}</div>
                <div className="text-sm text-gray-600">students</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Expected attendance</span>
                <span className="font-medium text-gray-900">{mealData.dinner.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mealData.dinner.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{mealData.dinner.count} of {mealData.dinner.total} students</span>
                <span className={`font-medium ${mealData.dinner.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mealData.dinner.change > 0 ? '+' : ''}{mealData.dinner.change}% vs last week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Served Counts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Actual Meals Served</h3>
            <p className="text-sm text-gray-600">Record served counts for accurate waste and accuracy</p>
          </div>
          <button
            onClick={handleSaveServed}
            disabled={isSavingServed}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSavingServed ? "Saving..." : "Save Served Counts"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
            <div key={meal} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 capitalize">{meal}</span>
                <span className="text-xs text-gray-500">
                  Expected: {mealData[meal].count}
                </span>
              </div>
              <input
                type="number"
                min="0"
                value={servedCounts[meal]}
                onChange={(event) =>
                  setServedCounts((prev) => ({
                    ...prev,
                    [meal]: Number(event.target.value || 0),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleExportDaily}
          disabled={isExportingDaily}
          className="bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExportingDaily ? "Exporting..." : "Export Daily Report"}
        </button>
        <button
          onClick={handleSendReminders}
          disabled={isSendingReminders}
          className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-gray-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSendingReminders ? "Sending..." : "Send Reminder to Pending Students"}
        </button>
      </div>
    </div>
  );
}
