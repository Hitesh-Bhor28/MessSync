"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Users, UserCog, User } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();

    const [selectedRole, setSelectedRole] =
        useState<"student" | "admin">("student");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: selectedRole,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                return;
            }

            router.push("/");
        } catch {
            setError("Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 py-3 border rounded-lg"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 py-3 border rounded-lg"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 py-3 border rounded-lg"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>

                    <div className="text-center mt-4 text-sm">
                        <span className="text-gray-600">
                            Already have an account?{" "}
                        </span>
                        <Link
                            href="/"
                            className="text-green-600 font-medium hover:underline"
                        >
                            Login here
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}
