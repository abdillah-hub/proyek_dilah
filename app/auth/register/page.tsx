"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const isPasswordMatching =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Password dan Confirm Password tidak cocok!", isError: true });
      return;
    }

    if (!formData.agreeTerms) {
      setMessage({ text: "Anda harus menyetujui syarat & ketentuan.", isError: true });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setMessage({ text: data.message, isError: false });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setMessage({ text: data.message || "Registrasi gagal.", isError: true });
      }
    } catch {
      setMessage({ text: "Gagal terhubung ke server!", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eef4fc] p-4">
      <div className="w-full max-w-[380px] bg-[#f8fafc]/90 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/5 p-7 border border-white">
        
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>

        <div className="flex flex-col items-center mb-5">
          <div className="w-13 h-13 p-3 bg-[#4382ec] text-white rounded-full flex items-center justify-center mb-2 shadow-md shadow-blue-400/40">
            <User className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Create Account</h1>
          <p className="text-xs text-gray-500 mt-0.5">Join us today!</p>
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Your full name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs pl-10 pr-3 py-2 bg-[#f3f6fa] border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Your email address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs pl-10 pr-3 py-2 bg-[#f3f6fa] border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-xs pl-10 pr-9 py-2 bg-[#f3f6fa] border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full text-xs pl-10 pr-9 py-2 bg-[#f3f6fa] border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {isPasswordMatching && (
              <span className="block mt-1 text-[10px] font-medium text-emerald-600">Passwords match</span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-[11px] text-gray-600">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1d6bf3] hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/30 transition duration-200 mt-1"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#3b82f6] font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}