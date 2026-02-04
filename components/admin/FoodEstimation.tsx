import { useState } from 'react';
import { Calculator, Users, Package } from 'lucide-react';

interface FoodItem {
  name: string;
  unit: string;
  perStudent: number;
  emoji: string;
}

const foodItems: FoodItem[] = [
  { name: 'Rice', unit: 'kg', perStudent: 0.25, emoji: '🍚' },
  { name: 'Dal', unit: 'kg', perStudent: 0.15, emoji: '🍲' },
  { name: 'Vegetables', unit: 'kg', perStudent: 0.2, emoji: '🥗' },
  { name: 'Roti/Chapati', unit: 'pieces', perStudent: 4, emoji: '🫓' },
  { name: 'Curry', unit: 'liters', perStudent: 0.15, emoji: '🍛' },
  { name: 'Milk', unit: 'liters', perStudent: 0.2, emoji: '🥛' }
];

export default function FoodEstimation() {
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [customQuantities, setCustomQuantities] = useState<{ [key: string]: number }>({});

  const studentCounts = {
    breakfast: 287,
    lunch: 312,
    dinner: 245
  };

  const currentStudents = studentCounts[selectedMeal];

  const calculateQuantity = (item: FoodItem) => {
    const customQty = customQuantities[item.name];
    if (customQty !== undefined) {
      return (currentStudents * customQty).toFixed(2);
    }
    return (currentStudents * item.perStudent).toFixed(2);
  };

  const handleCustomQuantity = (itemName: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCustomQuantities(prev => ({
        ...prev,
        [itemName]: numValue
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Quantity Estimation</h2>
        <p className="text-gray-600">
          Calculate required food quantities based on expected student count
        </p>
      </div>

      {/* Meal Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Select Meal</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedMeal('breakfast')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedMeal === 'breakfast'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">🌅</div>
            <div className="font-medium text-gray-900">Breakfast</div>
            <div className="text-sm text-gray-600 mt-1">{studentCounts.breakfast} students</div>
          </button>

          <button
            onClick={() => setSelectedMeal('lunch')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedMeal === 'lunch'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">☀️</div>
            <div className="font-medium text-gray-900">Lunch</div>
            <div className="text-sm text-gray-600 mt-1">{studentCounts.lunch} students</div>
          </button>

          <button
            onClick={() => setSelectedMeal('dinner')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedMeal === 'dinner'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">🌙</div>
            <div className="font-medium text-gray-900">Dinner</div>
            <div className="text-sm text-gray-600 mt-1">{studentCounts.dinner} students</div>
          </button>
        </div>
      </div>

      {/* Student Count Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Expected Students</h3>
              <p className="text-blue-100 text-sm mt-1">
                For {selectedMeal} tomorrow
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{currentStudents}</div>
            <div className="text-blue-100 text-sm">students</div>
          </div>
        </div>
      </div>

      {/* Food Items Calculation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Estimated Food Quantities</h3>
            <Package className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Automatically calculated based on standard quantities per student
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {foodItems.map((item, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Unit: {item.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {calculateQuantity(item)}
                  </div>
                  <div className="text-sm text-gray-600">{item.unit}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Per student:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={item.perStudent.toString()}
                      value={customQuantities[item.name] ?? ''}
                      onChange={(e) => handleCustomQuantity(item.name, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                    <span className="text-gray-700 font-medium">{item.unit}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Calculation:</span>
                  <span className="text-gray-900 font-mono">
                    {currentStudents} × {customQuantities[item.name] ?? item.perStudent} = {calculateQuantity(item)} {item.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Additional Notes</h3>
        <textarea
          placeholder="Add any special instructions or notes for the kitchen staff..."
          className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg">
          Save & Export Estimation
        </button>
        <button className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-gray-400 transition-colors">
          Reset to Defaults
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">💡 Tip:</span> You can customize the quantity per student for each item. The total will be automatically recalculated based on the expected number of students.
        </p>
      </div>
    </div>
  );
}
