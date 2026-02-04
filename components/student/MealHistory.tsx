import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface MealRecord {
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  status: 'submitted' | 'missed';
}

const mockHistory: MealRecord[] = [
  {
    date: '2026-01-05',
    breakfast: true,
    lunch: true,
    dinner: false,
    status: 'submitted'
  },
  {
    date: '2026-01-04',
    breakfast: true,
    lunch: false,
    dinner: true,
    status: 'submitted'
  },
  {
    date: '2026-01-03',
    breakfast: false,
    lunch: true,
    dinner: true,
    status: 'submitted'
  },
  {
    date: '2026-01-02',
    breakfast: true,
    lunch: true,
    dinner: true,
    status: 'submitted'
  },
  {
    date: '2026-01-01',
    breakfast: true,
    lunch: true,
    dinner: false,
    status: 'submitted'
  },
  {
    date: '2025-12-31',
    breakfast: false,
    lunch: false,
    dinner: false,
    status: 'missed'
  },
  {
    date: '2025-12-30',
    breakfast: true,
    lunch: true,
    dinner: true,
    status: 'submitted'
  }
];

export default function MealHistory() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalMeals = mockHistory.reduce((acc, record) => {
    return acc + (record.breakfast ? 1 : 0) + (record.lunch ? 1 : 0) + (record.dinner ? 1 : 0);
  }, 0);

  const totalSubmitted = mockHistory.filter(r => r.status === 'submitted').length;
  const totalMissed = mockHistory.filter(r => r.status === 'missed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meal History</h2>
        <p className="text-gray-600">
          View your past meal selections and submission records
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Meals</span>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalMeals}</div>
          <div className="text-sm text-gray-500 mt-1">Last 7 days</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Submitted</span>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalSubmitted}</div>
          <div className="text-sm text-gray-500 mt-1">Days on time</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Missed</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalMissed}</div>
          <div className="text-sm text-gray-500 mt-1">Days missed</div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">🌅 Breakfast</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">☀️ Lunch</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">🌙 Dinner</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(record.date)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.breakfast ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.lunch ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.dinner ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {record.status === 'submitted' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Missed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-700">Attending</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-700">Not Attending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Submitted</span>
            <span className="text-sm text-gray-700">On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Missed</span>
            <span className="text-sm text-gray-700">Late/No Entry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
