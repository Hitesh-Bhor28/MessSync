import { Calendar, CheckCircle, XCircle, Clock, TrendingDown } from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToSelection: () => void;
}

export default function StudentDashboard({ onNavigateToSelection }: StudentDashboardProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const todaysMeals = {
    breakfast: true,
    lunch: true,
    dinner: false
  };

  const tomorrowsMeals = {
    breakfast: true,
    lunch: false,
    dinner: true
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Hitesh!</h2>
        <p className="text-green-100">Manage your meal preferences and help reduce food waste</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{today}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">This Week</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">18</div>
          <div className="text-sm text-gray-500 mt-1">Meals Attended</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Saved</span>
            <TrendingDown className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-500 mt-1">Meals Marked Absent</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Participation</span>
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">95%</div>
          <div className="text-sm text-gray-500 mt-1">On-Time Submission</div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Today's Meals</h3>
          <p className="text-sm text-gray-600 mt-1">Your confirmed meal schedule for today</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              todaysMeals.breakfast 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌅</span>
                {todaysMeals.breakfast ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="font-medium text-gray-900">Breakfast</div>
              <div className="text-sm text-gray-600 mt-1">7:00 AM - 9:00 AM</div>
              <div className={`text-sm font-medium mt-2 ${
                todaysMeals.breakfast ? 'text-green-700' : 'text-red-700'
              }`}>
                {todaysMeals.breakfast ? 'Attending' : 'Not Attending'}
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              todaysMeals.lunch 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">☀️</span>
                {todaysMeals.lunch ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="font-medium text-gray-900">Lunch</div>
              <div className="text-sm text-gray-600 mt-1">12:30 PM - 2:30 PM</div>
              <div className={`text-sm font-medium mt-2 ${
                todaysMeals.lunch ? 'text-green-700' : 'text-red-700'
              }`}>
                {todaysMeals.lunch ? 'Attending' : 'Not Attending'}
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              todaysMeals.dinner 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌙</span>
                {todaysMeals.dinner ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="font-medium text-gray-900">Dinner</div>
              <div className="text-sm text-gray-600 mt-1">7:00 PM - 9:00 PM</div>
              <div className={`text-sm font-medium mt-2 ${
                todaysMeals.dinner ? 'text-green-700' : 'text-red-700'
              }`}>
                {todaysMeals.dinner ? 'Attending' : 'Not Attending'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tomorrow's Meals - Action Required */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Tomorrow's Meals
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Cutoff time: Today at 10:00 PM • Time remaining: 8h 23m
            </p>
          </div>
          <button
            onClick={onNavigateToSelection}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Update Selection
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              tomorrowsMeals.breakfast 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌅</span>
                {tomorrowsMeals.breakfast ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="font-medium text-gray-900">Breakfast</div>
              <div className={`text-sm font-medium mt-2 ${
                tomorrowsMeals.breakfast ? 'text-green-700' : 'text-gray-600'
              }`}>
                {tomorrowsMeals.breakfast ? 'Will Attend' : 'Will Skip'}
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              tomorrowsMeals.lunch 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">☀️</span>
                {tomorrowsMeals.lunch ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="font-medium text-gray-900">Lunch</div>
              <div className={`text-sm font-medium mt-2 ${
                tomorrowsMeals.lunch ? 'text-green-700' : 'text-gray-600'
              }`}>
                {tomorrowsMeals.lunch ? 'Will Attend' : 'Will Skip'}
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              tomorrowsMeals.dinner 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🌙</span>
                {tomorrowsMeals.dinner ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="font-medium text-gray-900">Dinner</div>
              <div className={`text-sm font-medium mt-2 ${
                tomorrowsMeals.dinner ? 'text-green-700' : 'text-gray-600'
              }`}>
                {tomorrowsMeals.dinner ? 'Will Attend' : 'Will Skip'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Environmental Impact</h3>
            <p className="text-blue-100 mb-4">
              By marking meals accurately, you've helped reduce food waste
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">~2.5 kg of food saved this month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Equivalent to 5 kg CO₂ reduction</span>
              </div>
            </div>
          </div>
          <div className="text-5xl">🌱</div>
        </div>
      </div>
    </div>
  );
}
