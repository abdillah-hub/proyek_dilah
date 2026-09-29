"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setMessage({ text: data.message || "Login berhasil!", isError: false });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setMessage({ text: data.message || "Email atau password salah!", isError: true });
      }
    } catch {
      setMessage({ text: "Gagal terhubung ke server!", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef4fc] p-4">
      <div className="w-full max-w-[380px] bg-[#f8fafc]/90 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/5 p-8 border border-white">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#4382ec] text-white rounded-full flex items-center justify-center mb-3 shadow-md shadow-blue-400/40">
            <User className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {message && (
          <div
            className={`mb-4 p-2.5 rounded-xl text-center text-xs font-medium ${
              message.isError
                ? "bg-red-100 text-red-600 border border-red-200"
                : "bg-emerald-100 text-emerald-600 border border-emerald-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Your email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs pl-10 pr-4 py-3 bg-[#f3f6fa] border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 placeholder:text-gray-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-xs pl-10 pr-10 py-3 bg-[#f3f6fa] border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 placeholder:text-gray-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1d6bf3] hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/30 transition duration-200 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-[#3b82f6] font-semibold hover:underline">
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}