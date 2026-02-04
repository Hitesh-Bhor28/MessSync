import { useState } from 'react';
import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../components/LoginScreen';
import StudentDashboard from '../components/student/StudentDashboard';
import MealSelection from '../components/student/MealSelection';
import MealHistory from '../components/student/MealHistory';
import AdminDashboard from '../components/admin/AdminDashboard';
import FoodEstimation from '../components/admin/FoodEstimation';
import WeeklyReports from '../components/admin/WeeklyReports';

type UserRole = 'student' | 'admin' | null;
type StudentView = 'dashboard' | 'selection' | 'history';
type AdminView = 'dashboard' | 'estimation' | 'reports';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [studentView, setStudentView] = useState<StudentView>('dashboard');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');

  const handleLogin = (role: 'student' | 'admin') => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setStudentView('dashboard');
    setAdminView('dashboard');
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">MessSync</h1>
                <p className="text-xs text-gray-500">
                  {userRole === 'student' ? 'Student Portal' : 'Admin Portal'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {userRole === 'student' && (
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              <button
                onClick={() => setStudentView('dashboard')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  studentView === 'dashboard'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setStudentView('selection')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  studentView === 'selection'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Meal Selection
              </button>
              <button
                onClick={() => setStudentView('history')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  studentView === 'history'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
            </div>
          </div>
        </nav>
      )}

      {userRole === 'admin' && (
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              <button
                onClick={() => setAdminView('dashboard')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  adminView === 'dashboard'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Daily Dashboard
              </button>
              <button
                onClick={() => setAdminView('estimation')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  adminView === 'estimation'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Food Estimation
              </button>
              <button
                onClick={() => setAdminView('reports')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  adminView === 'reports'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Reports
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'student' && (
          <>
            {studentView === 'dashboard' && <StudentDashboard onNavigateToSelection={() => setStudentView('selection')} />}
            {studentView === 'selection' && <MealSelection />}
            {studentView === 'history' && <MealHistory />}
          </>
        )}

        {userRole === 'admin' && (
          <>
            {adminView === 'dashboard' && <AdminDashboard />}
            {adminView === 'estimation' && <FoodEstimation />}
            {adminView === 'reports' && <WeeklyReports />}
          </>
        )}
      </main>
    </div>
  );
}