'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/context";
import { 
  ShieldAlert, 
  Settings, 
  UserCheck, 
  TrendingUp, 
  BadgePlus, 
  AlertTriangle, 
  Droplet, 
  Users, 
  Coins, 
  Calendar,
  CheckCircle2,
  Lock,
  LogOut
} from "lucide-react";
import NextLink from "next/link";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, deposits, gradePrices, adminAddDeposit, adminUpdatePrice, logout } = useApp();

  // Admin states
  const [targetEmail, setTargetEmail] = useState("");
  const [liters, setLiters] = useState<number>(10);
  const [grade, setGrade] = useState<"A" | "B" | "C">("A");
  const [depositSuccess, setDepositSuccess] = useState("");

  const [editGradeId, setEditGradeId] = useState<"A" | "B" | "C">("A");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [priceSuccess, setPriceSuccess] = useState("");

  // Populate input on select grade
  React.useEffect(() => {
    const active = gradePrices.find(p => p.id === editGradeId);
    if (active) {
      setNewPrice(active.price);
    }
  }, [editGradeId, gradePrices]);

  // 1. Amankan Rute - Ensure the route is strictly secured
  if (!currentUser) {
    return (
      <main className="flex-1 flex items-center justify-center p-8 bg-zinc-50" id="admin-dash-blocked-session">
        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 text-center shadow-lg" id="blocked-admin-container">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold text-zinc-900 mb-2">Akses Terbatas Admin</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Rute ini membutuhkan autentikasi staff dengan wewenang role ADMIN. Silakan login ke akun admin Anda sekarang.
          </p>
          <NextLink
            href="/login"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all text-sm cursor-pointer"
          >
            Masuk Sebagai Admin
          </NextLink>
        </div>
      </main>
    );
  }

  // Strictly block USER status from seeing admin operations
  if (currentUser.role !== "ADMIN") {
    return (
      <main className="flex-1 flex items-center justify-center p-8 bg-zinc-50" id="admin-dash-blocked-role">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-8 text-center shadow-md" id="blocked-role-container">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-red-700 mb-2">Akses Ditolak (ADMIN Only)</h1>
          <p className="text-zinc-600 text-xs mb-6 leading-relaxed">
            Anda terautentikasi sebagai <span className="font-bold text-zinc-900">{currentUser.name}</span> dengan tingkat hak akses <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold">{currentUser.role}</span>. Rute administratif ini terbatas bagi akun ber-role ADMIN saja.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
               onClick={() => {
                 logout();
                 router.push("/login");
               }}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Ganti Akun Admin</span>
            </button>
            <NextLink
              href="/dashboard/user"
              className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl text-xs flex items-center justify-center cursor-pointer"
            >
              Kembali ke My Dashboard
            </NextLink>
          </div>
        </div>
      </main>
    );
  }

  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositSuccess("");

    if (!targetEmail.trim() || !targetEmail.includes("@")) {
      alert("Masukkan email penyetor yang valid.");
      return;
    }

    if (liters <= 0) {
      alert("Masukkan volume liter yang valid.");
      return;
    }

    adminAddDeposit(targetEmail, liters, grade);
    setDepositSuccess(`Berhasil menginput setoran ${liters} L (${grade}) untuk e-mail mitra: ${targetEmail}`);
    setTargetEmail("");
  };

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    setPriceSuccess("");

    if (newPrice <= 0) {
      alert("Nilai harga per-Grade harus di atas nol.");
      return;
    }

    adminUpdatePrice(editGradeId, newPrice);
    setPriceSuccess(`Indeks harga Grade ${editGradeId} berhasil dimutakhirkan menjadi Rp ${newPrice.toLocaleString("id-ID")}/Liter!`);
  };

  // Admin stats aggregators
  const adminTotalLiters = deposits.reduce((acc, d) => acc + d.liters, 0);
  const adminTotalPayouts = deposits.reduce((acc, d) => acc + d.totalEarnings, 0);
  const uniqueUsers = Array.from(new Set(deposits.map(d => d.email))).length;

  return (
    <main className="flex-1 bg-zinc-50 py-10 px-6 animate-fade-in" id="admin-dashboard-root">
      <div className="mx-auto max-w-5xl" id="admin-container">
        
        {/* Head banner */}
        <section className="bg-zinc-900 text-white rounded-2xl border border-zinc-800 p-8 mb-10 relative overflow-hidden" id="admin-banner">
          <div className="absolute top-0 right-0 p-8 text-zinc-800 opacity-10" id="admin-banner-icon-bg">
            <Settings className="h-44 w-44 animate-spin-slow text-white" />
          </div>
          <div className="relative z-10" id="admin-banner-text">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-4">
              <UserCheck className="h-3.5 w-3.5" />
              Staff Administratif Pusat
            </span>
            <h1 className="text-3xl font-black tracking-tight" id="admin-banner-title">
              Panel Pengelola <span className="text-emerald-500">EcoOil Global</span>
            </h1>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed max-w-2xl">
              Halaman internal admin untuk mengatur konversi harga beli per-Grade secara dinamis dan melakukan input manual penerimaan log minyak jelantah langsung dari pos penimbangan lapangan.
            </p>
          </div>
        </section>

        {/* Global Summary stats cards */}
        <section className="grid sm:grid-cols-3 gap-6 mb-10" id="admin-statistics">
          <div className="bg-white border border-zinc-200 p-6 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Droplet className="h-6 w-6 text-emerald-600 fill-emerald-100" />
            </div>
            <div>
              <span className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Saringan</span>
              <span className="text-xl font-extrabold text-zinc-900 font-mono">{adminTotalLiters} Liter</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Coins className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <span className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Kas Keluar</span>
              <span className="text-xl font-extrabold text-amber-600 font-mono">Rp {adminTotalPayouts.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <span className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Akun Terdaftar</span>
              <span className="text-xl font-extrabold text-zinc-900 font-mono">{uniqueUsers} Mitra</span>
            </div>
          </div>
        </section>

        {/* Interactive forms tools row */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          
          {/* Form Tool A: Update Grade Rates */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm" id="form-edit-price">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-zinc-900">Ubah Konversi Harga Grade</h2>
            </div>
            <p className="text-xs text-zinc-500 mb-6">
              Nilai per liter mutakhir yang ditetapkan di bawah ini akan segera tercermin pada kalkulator simulasi dan halaman info indeks publik.
            </p>

            {priceSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold leading-relaxed">
                {priceSuccess}
              </div>
            )}

            <form onSubmit={handleUpdatePrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Pilih Klasifikasi Grade</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["A", "B", "C"] as const).map((gradeId) => (
                    <button
                      key={gradeId}
                      type="button"
                      onClick={() => {
                        setEditGradeId(gradeId);
                        setPriceSuccess("");
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        editGradeId === gradeId
                          ? "bg-zinc-900 border-zinc-900 text-white"
                          : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      Grade {gradeId}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Harga Konversi Baru (IDR/Liter)</label>
                <input
                  type="number"
                  value={newPrice || ""}
                  onChange={(e) => {
                    setNewPrice(Number(e.target.value));
                    setPriceSuccess("");
                  }}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-zinc-800"
                  placeholder="Contoh: 9800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Simpan & Update Indeks
              </button>
            </form>
          </div>

          {/* Form Tool B: Input New Deposit For User */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm" id="form-add-deposit">
            <div className="flex items-center gap-2 mb-4">
              <BadgePlus className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-zinc-900">Input Setoran Mitra</h2>
            </div>
            <p className="text-xs text-zinc-500 mb-6">
              Tambahkan data penerimaan timbangan baru. Sistem akan otomatis menghitung imbal hasil dan menyimpannya ke tabungan riwayat akun bersangkutan.
            </p>

            {depositSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold leading-relaxed">
                {depositSuccess}
              </div>
            )}

            <form onSubmit={handleCreateDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">E-mail Terdaftar Penyumbang</label>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => {
                    setTargetEmail(e.target.value);
                    setDepositSuccess("");
                  }}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-zinc-800"
                  placeholder="user@ecooil.id"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Jumlah Diukur (L)</label>
                  <input
                    type="number"
                    value={liters || ""}
                    onChange={(e) => {
                      setLiters(Number(e.target.value));
                      setDepositSuccess("");
                    }}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-zinc-800"
                    placeholder="Contoh: 15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Kualitas Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value as "A" | "B" | "C");
                      setDepositSuccess("");
                    }}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-zinc-800"
                  >
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Standard)</option>
                    <option value="C">Grade C (Gosong)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Kirim Pembayaran Setoran
              </button>
            </form>
          </div>

        </div>

        {/* Log list of ALL deposits globally */}
        <section className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-sm" id="global-activity-log">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Log Aktivitas Setoran Global</h2>
              <p className="text-xs text-zinc-400 mt-1">Total {deposits.length} pencatatan transaksi masuk</p>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-zinc-100 text-xs font-bold text-zinc-400 pb-3 uppercase tracking-wider">
                  <th className="pb-3 pr-2">Rincian Mitra</th>
                  <th className="pb-3 px-2">Tanggal</th>
                  <th className="pb-3 px-2">Kualitas</th>
                  <th className="pb-3 px-2">Volume</th>
                  <th className="pb-3 px-2 text-right">Pembayaran Kas</th>
                  <th className="pb-3 pl-2 text-right">Status</th>
                </tr>
              </thead>
         <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                    {/* Baris 1: Contoh Selesai */}
                    <tr className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-zinc-900">user@ecoil.id</td>
                      <td className="py-3.5 px-4 font-mono text-zinc-500">2026-05-24</td>
                      <td className="py-3.5 px-4 font-mono">Grade B</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">5 L</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">Rp 10.000</td>
                      <td className="py-3.5 px-4 text-right"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">✓ Selesai</span></td>
                    </tr>
                    
                    {/* Baris 2: Demo ACC */}
                    {(() => {
                      const [status, setStatus] = React.useState("Menunggu Penjemputan");
                      return (
                        <tr className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-zinc-900">user@ecoil.id</td>
                          <td className="py-3.5 px-4 font-mono text-zinc-500">2026-05-24</td>
                          <td className="py-3.5 px-4 font-mono">Grade B</td>
                          <td className="py-3.5 px-4 font-mono font-semibold">5 L</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">Rp 10.000</td>
                          <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                            {status === "Menunggu Penjemputan" ? (
                              <button onClick={() => setStatus("Selesai")} className="px-2 py-1 bg-zinc-900 text-white rounded font-bold text-[10px] cursor-pointer">ACC</button>
                            ) : <span className="text-emerald-700 font-bold">✓ Selesai</span>}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
      </div>
    </main>
  );
}
