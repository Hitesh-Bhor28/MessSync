import { useState } from 'react';
import { Calendar, Clock, CheckCircle, Save } from 'lucide-react';

export default function MealSelection() {
  const [selectedDate, setSelectedDate] = useState('tomorrow');
  const [meals, setMeals] = useState({
    breakfast: true,
    lunch: false,
    dinner: true
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    setMeals(prev => ({
      ...prev,
      [meal]: !prev[meal]
    }));
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meal Selection</h2>
        <p className="text-gray-600">
          Mark your meal attendance for tomorrow. Changes can be made until 10:00 PM today.
        </p>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Meal status updated successfully!</p>
            <p className="text-sm text-green-700">Your preferences have been saved for tomorrow.</p>
          </div>
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
          <button
            disabled
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-400 cursor-not-allowed"
          >
            Other Dates
            <div className="text-sm font-normal mt-1">Coming Soon</div>
          </button>
        </div>
      </div>

      {/* Cutoff Timer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-900">Submission Cutoff: Today at 10:00 PM</p>
          <p className="text-sm text-amber-700">Time remaining: 8 hours 23 minutes</p>
        </div>
      </div>

      {/* Meal Selection Cards */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Select Your Meals</h3>
          <p className="text-sm text-gray-600">
            Click on each meal card to toggle your attendance
          </p>
        </div>

        <div className="space-y-4">
          {/* Breakfast */}
          <div
            onClick={() => handleToggle('breakfast')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
              meals.breakfast
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🌅</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Breakfast</h4>
                  <p className="text-sm text-gray-600">7:00 AM - 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  meals.breakfast
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {meals.breakfast ? 'Yes' : 'No'}
                </div>
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  meals.breakfast
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300 bg-white'
                }`}>
                  {meals.breakfast && <CheckCircle className="w-6 h-6 text-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Lunch */}
          <div
            onClick={() => handleToggle('lunch')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
              meals.lunch
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">☀️</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Lunch</h4>
                  <p className="text-sm text-gray-600">12:30 PM - 2:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  meals.lunch
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {meals.lunch ? 'Yes' : 'No'}
                </div>
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  meals.lunch
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300 bg-white'
                }`}>
                  {meals.lunch && <CheckCircle className="w-6 h-6 text-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Dinner */}
          <div
            onClick={() => handleToggle('dinner')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
              meals.dinner
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🌙</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Dinner</h4>
                  <p className="text-sm text-gray-600">7:00 PM - 9:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  meals.dinner
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {meals.dinner ? 'Yes' : 'No'}
                </div>
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  meals.dinner
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300 bg-white'
                }`}>
                  {meals.dinner && <CheckCircle className="w-6 h-6 text-white" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Submit */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Selection Summary</h3>
            <p className="text-sm text-gray-600 mt-1">
              You have selected {Object.values(meals).filter(Boolean).length} out of 3 meals for tomorrow
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Meal Selection
          </button>
          <button
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">💡 Tip:</span> Marking your meals accurately helps the mess staff prepare the right amount of food, reducing waste and saving resources.
        </p>
      </div>
    </div>
  );
}
