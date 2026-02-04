import { useState } from 'react';
import { Calendar, Users, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState('tomorrow');

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

  const mealData = {
    breakfast: {
      count: 287,
      total: 350,
      percentage: 82,
      change: +5
    },
    lunch: {
      count: 312,
      total: 350,
      percentage: 89,
      change: -3
    },
    dinner: {
      count: 245,
      total: 350,
      percentage: 70,
      change: +12
    }
  };

  return (
    <div className="space-y-6">
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
          <button
            onClick={() => setSelectedDate('custom')}
            className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
              selectedDate === 'custom'
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Custom Date
            <div className="text-sm font-normal mt-1">Select any date</div>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">350</div>
          <div className="text-sm text-gray-500 mt-1">Hostel capacity</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Responses</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">342</div>
          <div className="text-sm text-gray-500 mt-1">98% submitted</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Avg Attendance</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">80%</div>
          <div className="text-sm text-gray-500 mt-1">Across all meals</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pending</span>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-500 mt-1">Not yet submitted</div>
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

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg">
          Export Daily Report
        </button>
        <button className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-gray-400 transition-colors">
          Send Reminder to Pending Students
        </button>
      </div>
    </div>
  );
}
