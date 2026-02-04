import { useState } from 'react';
import { Mail, Lock, Users, UserCog } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'student' | 'admin') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-lg">
            M
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MessSync</h1>
          <p className="text-gray-600">Smart Hostel Food Planning & Waste Reduction</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Login Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'student'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className={`w-8 h-8 mx-auto mb-2 ${
                  selectedRole === 'student' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-900">Student</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <UserCog className={`w-8 h-8 mx-auto mb-2 ${
                  selectedRole === 'admin' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-900">Admin</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedRole === 'student' ? 'College Email / ID' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'student' ? 'student@college.edu' : 'admin@mess.edu'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Login as {selectedRole === 'student' ? 'Student' : 'Admin'}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              First-time users are auto-registered
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-medium">Wireframe Demo:</span> Click any login button to view the interface
          </p>
        </div>
      </div>
    </div>
  );
}
