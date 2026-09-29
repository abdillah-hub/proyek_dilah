'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function KelasDetailPage() {
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-[#eef4fc] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#f8fafc]/90 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/5 p-6 border border-white space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">Detail Kelas #{id}</h1>
          <p className="text-xs text-gray-500 mt-1">
            Selamat datang di kelas dengan ID: <span className="font-semibold text-gray-700">{id}</span>
          </p>
        </div>
      </div>
    </main>
  );
}