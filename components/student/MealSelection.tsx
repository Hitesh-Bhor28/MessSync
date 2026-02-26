"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/redux/store";
import {
  toggleMeal,
  setDate,
  setMeals,
  setLoading,
  saveSuccess,
  saveFailure,
} from "../../app/redux/slices/mealSlice";
import {
  setDashboardData,
  setError as setDashboardError,
  setLoading as setDashboardLoading,
} from "../../app/redux/slices/dashboardSlice";

import { Calendar, Clock, CheckCircle, Save } from "lucide-react";

export default function MealSelection() {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedDate, meals, loading, error } = useSelector(
    (state: RootState) => state.meals
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const resolveDateKey = (value: string) => {
    if (value === "today") {
      return toLocalDateKey(new Date());
    }
    if (value === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return toLocalDateKey(tomorrow);
    }
    return value;
  };

  const getTomorrowKey = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toLocalDateKey(tomorrow);
  };

  const dateInputValue =
    selectedDate === "tomorrow" ? getTomorrowKey() : selectedDate;

  useEffect(() => {
    let ignore = false;

    const loadMeals = async () => {
      dispatch(setLoading(true));

      try {
        const res = await fetch(
          `/api/meals?date=${resolveDateKey(selectedDate)}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          dispatch(saveFailure(data?.message || "Failed to load meals"));
          return;
        }

        if (!ignore) {
          dispatch(
            setMeals({
              breakfast: Boolean(data?.meals?.breakfast),
              lunch: Boolean(data?.meals?.lunch),
              dinner: Boolean(data?.meals?.dinner),
            })
          );
        }
      } catch {
        if (!ignore) {
          dispatch(saveFailure("Failed to load meals"));
        }
      }
    };

    loadMeals();

    return () => {
      ignore = true;
    };
  }, [dispatch, selectedDate]);

  const handleToggle = (
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    dispatch(toggleMeal(meal));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    dispatch(setLoading(true));

    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: resolveDateKey(selectedDate),
          meals,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(saveFailure(data.message));
        return;
      }

      dispatch(saveSuccess());

      dispatch(setDashboardLoading(true));
      try {
        const dashboardRes = await fetch("/api/student/dashboard", {
          credentials: "include",
        });
        const dashboardData = await dashboardRes.json();

        if (!dashboardRes.ok) {
          dispatch(
            setDashboardError(
              dashboardData?.message || "Failed to refresh dashboard"
            )
          );
        } else {
          dispatch(setDashboardData(dashboardData));
        }
      } catch {
        dispatch(setDashboardError("Failed to refresh dashboard"));
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      dispatch(saveFailure("Failed to save meal selection"));
    } finally {
      setIsSaving(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Meal Selection
        </h2>
        <p className="text-gray-600">
          Mark your meal attendance for your selected date. Changes can be made
          until 10:00 PM today.
        </p>
        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
        {loading && !isSaving && (
          <p className="mt-3 text-sm text-gray-500">
            Loading selection...
          </p>
        )}
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>Meal selection saved successfully!</span>
        </div>
      )}

      {/* Date Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Select Date</h3>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch(setDate("tomorrow"))}
            className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
              selectedDate === "tomorrow"
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            Tomorrow
            <div className="text-sm font-normal mt-1">
              {getTomorrowDate()}
            </div>
          </button>

          <div className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200">
            <label className="block text-sm font-medium text-gray-700">
              Other Date
            </label>
            <input
              type="date"
              min={getTomorrowKey()}
              value={dateInputValue}
              onChange={(event) => dispatch(setDate(event.target.value))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Cutoff Timer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-900">
            Submission Cutoff: Today at 10:00 PM
          </p>
          <p className="text-sm text-amber-700">
            Time remaining: 8 hours 23 minutes
          </p>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Select Your Meals
          </h3>
          <p className="text-sm text-gray-600">
            Click on each meal card to toggle your attendance
          </p>
        </div>

        <div className="space-y-4">
          {(["breakfast", "lunch", "dinner"] as const).map(
            (meal) => (
              <div
                key={meal}
                onClick={() => handleToggle(meal)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                  meals[meal]
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {meal === "breakfast"
                        ? "🌅"
                        : meal === "lunch"
                        ? "☀️"
                        : "🌙"}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 capitalize">
                        {meal}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {meal === "breakfast"
                          ? "7:00 AM - 9:00 AM"
                          : meal === "lunch"
                          ? "12:30 PM - 2:30 PM"
                          : "7:00 PM - 9:00 PM"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-lg font-medium ${
                        meals[meal]
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {meals[meal] ? "Yes" : "No"}
                    </div>

                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                        meals[meal]
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {meals[meal] && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900">
          Selection Summary
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          You have selected{" "}
          {Object.values(meals).filter(Boolean).length} out of 3
          meals for {selectedDate === "tomorrow" ? "tomorrow" : "this date"}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Saving..." : "Save Meal Selection"}
          </button>
        </div>
      </div>
    </div>
  );
}
