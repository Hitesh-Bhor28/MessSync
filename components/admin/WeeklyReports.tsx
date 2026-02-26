"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingDown, TrendingUp, Download } from 'lucide-react';

interface WeeklyDatum {
  day: string;
  expected: number;
  served: number;
  waste: number;
}

interface DistributionDatum {
  name: string;
  value: number;
  color: string;
}

interface WasteDatum {
  week: string;
  traditional: number;
  withSystem: number;
}

export default function WeeklyReports() {
  const [weeklyData, setWeeklyData] = useState<WeeklyDatum[]>([]);
  const [mealDistribution, setMealDistribution] = useState<DistributionDatum[]>([]);
  const [wasteComparison, setWasteComparison] = useState<WasteDatum[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/reports?days=7', {
          credentials: 'include',
        });
        const payload = await res.json();

        if (!res.ok) {
          throw new Error(payload?.message || 'Failed to load reports');
        }

        if (!ignore) {
          setWeeklyData(Array.isArray(payload?.weeklyData) ? payload.weeklyData : []);
          setMealDistribution(Array.isArray(payload?.mealDistribution) ? payload.mealDistribution : []);
          setWasteComparison(Array.isArray(payload?.wasteComparison) ? payload.wasteComparison : []);
        }
      } catch (err: any) {
        if (!ignore) {
          setWeeklyData([]);
          setMealDistribution([]);
          setWasteComparison([]);
          setError(err?.message || "Failed to load reports");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      ignore = true;
    };
  }, []);

  const totalExpected = weeklyData.reduce((sum, day) => sum + day.expected, 0);
  const totalServed = weeklyData.reduce((sum, day) => sum + day.served, 0);
  const totalWaste = weeklyData.reduce((sum, day) => sum + day.waste, 0);
  const accuracy = totalExpected
    ? ((totalServed / totalExpected) * 100).toFixed(1)
    : "0.0";
  const wastePercentage = totalExpected
    ? ((totalWaste / totalExpected) * 100).toFixed(1)
    : "0.0";

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const res = await fetch("/api/admin/reports/export/pdf?days=7", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to export report");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `weekly-report-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-sm text-gray-500">
          Loading reports...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Planning Summary</h2>
          <p className="text-gray-600">
            Analytics and reports for meal planning and waste reduction
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export Report"}
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Report Period</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="px-4 py-3 border-2 border-green-600 bg-green-50 text-green-700 rounded-lg font-medium">
            This Week
          </button>
          <button className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300">
            Last Week
          </button>
          <button className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300">
            Custom Range
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Meals</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalExpected}</div>
          <div className="text-sm text-gray-500 mt-1">Expected this week</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Accuracy</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{accuracy}%</div>
          <div className="text-sm text-green-600 mt-1">+3.2% from last week</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Food Waste</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalWaste}</div>
          <div className="text-sm text-green-600 mt-1">-35% reduction</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Waste Rate</span>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{wastePercentage}%</div>
          <div className="text-sm text-gray-500 mt-1">Of expected meals</div>
        </div>
      </div>

      {/* Expected vs Served Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Daily Consumption Analysis</h3>
        <p className="text-sm text-gray-600 mb-6">Expected meals vs actual meals served</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="expected" fill="#10b981" name="Expected" radius={[8, 8, 0, 0]} />
              <Bar dataKey="served" fill="#3b82f6" name="Served" radius={[8, 8, 0, 0]} />
              <Bar dataKey="waste" fill="#ef4444" name="Waste" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Meal Distribution</h3>
          <p className="text-sm text-gray-600 mb-6">Average daily attendance by meal type</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mealDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mealDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {mealDistribution.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Reduction Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Waste Reduction Impact</h3>
          <p className="text-sm text-gray-600 mb-6">Traditional vs MessSync system comparison</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wasteComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Traditional Method"
                  dot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="withSystem" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="With MessSync"
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">Average Reduction:</span> 65% decrease in food waste compared to traditional planning
            </p>
          </div>
        </div>
      </div>

      {/* Daily Report Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Daily Breakdown</h3>
          <p className="text-sm text-gray-600 mt-1">Detailed view of each day's performance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Day</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Expected</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Served</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Waste</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Accuracy</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {weeklyData.map((day, index) => {
                const dayAccuracy = ((day.served / day.expected) * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{day.day}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{day.expected}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{day.served}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {day.waste} meals
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{dayAccuracy}%</td>
                    <td className="px-6 py-4 text-center">
                      {parseFloat(dayAccuracy) >= 98 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Excellent
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Good
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Environmental Impact This Week</h3>
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>~17.5 kg of food saved compared to traditional method</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Equivalent to 35 kg CO₂ emissions prevented</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>₹4,200 estimated cost savings this week</span>
              </div>
            </div>
          </div>
          <div className="text-6xl">🌍</div>
        </div>
      </div>
    </div>
  );
}
