import { useState } from "react";
import { Mail, Lock, Users, UserCog } from "lucide-react";

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] =
    useState<"student" | "admin">("student");
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("testpass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // same pattern as netflix-gpt / devTinder
      localStorage.setItem("token", data.token);

      // role-based redirect
      window.location.href =
        selectedRole === "admin" ? "/admin" : "/dashboard";
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-lg">
            M
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MessSync
          </h1>
          <p className="text-gray-600">
            Smart Hostel Food Planning & Waste Reduction
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Role selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Login Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`p-4 rounded-xl border-2 ${
                  selectedRole === "student"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                Student
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`p-4 rounded-xl border-2 ${
                  selectedRole === "admin"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <UserCog className="w-8 h-8 mx-auto mb-2 text-green-600" />
                Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 py-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 py-3 border rounded-lg"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
