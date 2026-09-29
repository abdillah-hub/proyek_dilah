"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, ShieldCheck, Mail, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  return localStorage.getItem("user");
}

function getServerSnapshot(): string | null {
  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const rawUser = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let user: UserProfile | null = null;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("user")) {
      router.replace("/auth/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    router.push("/auth/login");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#eef4fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Memeriksa status login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef4fc] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <header className="bg-[#f8fafc]/90 backdrop-blur-md border border-white rounded-2xl p-4 md:px-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4382ec] text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-400/30">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800">Dashboard</h1>
              <p className="text-xs text-gray-500">Selamat datang kembali</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition border border-red-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </header>

        {/* Welcome Card */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-blue-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-2">
                Sesi Aktif
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Halo, {user.name}! 👋
              </h2>
              <p className="text-blue-100 text-xs md:text-sm mt-1">
                Anda telah berhasil masuk ke dashboard akun Anda.
              </p>
            </div>

            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-sm self-start sm:self-auto">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
        </section>

        {/* Profile Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#f8fafc]/90 border border-white rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
              <User className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 font-medium">Nama Lengkap</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{user.name}</p>
          </div>

          <div className="bg-[#f8fafc]/90 border border-white rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 font-medium">Alamat Email</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5 truncate">{user.email}</p>
          </div>

          <div className="bg-[#f8fafc]/90 border border-white rounded-2xl p-5 shadow-sm">
            <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 font-medium">Status Akun</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">Terverifikasi</p>
          </div>
        </section>

        {/* Quick Links / Content Area */}
        <section className="bg-[#f8fafc]/90 border border-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Menu & Akses Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/kelas/1"
              className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Lihat Halaman Kelas</h4>
                  <p className="text-[11px] text-gray-500">Buka contoh kelas dinamis (/kelas/1)</p>
                </div>
              </div>
            </Link>

            <div className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Tanggal Sesi</h4>
                  <p className="text-[11px] text-gray-500">
                    {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}