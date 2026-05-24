import React from "react";
import { Info } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50" id="not-found-page">
      <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 shadow-lg" id="not-found-container">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <Info className="h-6 w-6" id="not-found-icon" />
        </div>
        <h1 className="text-2xl font-extrabold text-zinc-900 mb-2" id="not-found-title">Halaman Tidak Ditemukan</h1>
        <p className="text-zinc-500 text-sm mb-6" id="not-found-description">
          Maaf, halaman yang Anda cari tidak dapat kami temukan atau sedang berada di bawah pemeliharaan.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white font-bold rounded-xl transition-all text-sm cursor-pointer"
          id="not-found-home-btn"
        >
          Kembali ke Beranda
        </a>
      </div>
    </main>
  );
}
