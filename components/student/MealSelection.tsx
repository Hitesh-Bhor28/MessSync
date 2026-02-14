"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/redux/store";
import {
  toggleMeal,
  setDate,
  setLoading,
  saveSuccess,
  saveFailure,
} from "../../app/redux/slices/mealSlice";

import { Calendar, Clock, CheckCircle, Save } from "lucide-react";

export default function MealSelection() {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedDate, meals, loading } = useSelector(
    (state: RootState) => state.meals
  );

  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = (
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    dispatch(toggleMeal(meal));
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));

    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          meals,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(saveFailure(data.message));
        return;
      }

      dispatch(saveSuccess());

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      dispatch(saveFailure("Failed to save meal selection"));
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
          Mark your meal attendance for tomorrow. Changes can be made until
          10:00 PM today.
        </p>
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

          <button
            disabled
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-400 cursor-not-allowed"
          >
            Other Dates
            <div className="text-sm font-normal mt-1">
              Coming Soon
            </div>
          </button>
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
          meals for tomorrow
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : "Save Meal Selection"}
          </button>
        </div>
      </div>
    </div>
  );
}
