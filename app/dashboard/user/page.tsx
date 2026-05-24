'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/context";
import { Droplet, Award, Calendar, CircleDollarSign, AlertTriangle, Truck, MapPin, CheckCircle2, Star, Clock, Flame } from "lucide-react";
import NextLink from "next/link";

export const dynamic = "force-dynamic";

export default function UserDashboardPage() {
  const router = useRouter();
  const { currentUser, deposits, addPickupRequest } = useApp();

  const [formLiters, setFormLiters] = useState<number>(10);
  const [address, setAddress] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle missing user gracefully with custom interactive button
  if (!currentUser) {
    return (
      <main className="flex-1 flex items-center justify-center p-8 bg-zinc-50" id="user-dash-blocked">
        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 p-8 text-center shadow-lg" id="blocked-container">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold text-zinc-900 mb-2">Sesi Belum Masuk</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Anda perlu masuk ke dalam akun EcoOil Anda untuk mengakses dashboard setoran pribadi ini.
          </p>
          <NextLink
            href="/login"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-sm cursor-pointer"
          >
            Masuk Sekarang
          </NextLink>
        </div>
      </main>
    );
  }

  const userDeposits = deposits.filter(
    (d) => d.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const totalLiters = userDeposits.reduce((acc, d) => acc + d.liters, 0);
  const totalEarnings = userDeposits.reduce((acc, d) => acc + d.totalEarnings, 0);

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    if (!address.trim()) {
      alert("Alamat penjemputan lengkap wajib diisi.");
      return;
    }

    if (formLiters <= 0) {
      alert("Jumlah liter harus lebih dari 0.");
      return;
    }

    addPickupRequest(formLiters, address);
    setSuccessMsg(`Berhasil mengajukan penjemputan sebesar ${formLiters} Liter. Kurir akan segera menghubungi kontak Anda.`);
    setAddress("");
  };

  return (
    <main className="flex-1 bg-zinc-50/50 py-10 px-6" id="user-dashboard">
      <div className="mx-auto max-w-5xl" id="user-dashboard-container">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8" id="user-dash-welcome">
          <div>
            <span className="text-xs uppercase font-extrabold text-emerald-700 tracking-widest block mb-0.5">DASHBOARD MITRA</span>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight" id="user-dash-title">
              Halo, <span className="text-emerald-600">{currentUser.name}</span>!
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">Status Keanggotaan: Aktif • Logged as: {currentUser.email}</p>
          </div>
          
          <div className="flex gap-2" id="user-dash-badges">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
              <Star className="h-3 w-3 fill-emerald-600" />
              Sertifikasi Hijau
            </span>
          </div>
        </div>

        {/* Big Metrics Grid to display Points & Cash alternative options */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10" id="user-metrics">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex items-center gap-4" id="m-liters">
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600" id="m-liters-icon">
              <Droplet className="h-6 w-6 text-emerald-600 fill-emerald-100" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">Minyak Disetor</span>
              <span className="text-2xl font-black text-zinc-900 font-mono">{totalLiters} Liter</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex items-center gap-4" id="m-earnings">
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600" id="m-earnings-icon">
              <CircleDollarSign className="h-6 w-6 text-emerald-600 fill-emerald-100" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider font-sans">Tabungan Tunai</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">Rp {(totalLiters * 2000).toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex items-center gap-4" id="m-points">
            <div className="p-4 rounded-xl bg-amber-50 text-amber-600" id="m-points-icon">
              <Award className="h-6 w-6 text-amber-500 fill-amber-50" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">Tabungan Koin Poin</span>
              <span className="text-2xl font-black text-amber-600 font-mono">{(totalLiters * 4).toLocaleString("id-ID")} Poin</span>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-12 gap-8" id="dashboard-layout-grid">
          {/* Main pickup request column */}
          <div className="md:col-span-12 lg:col-span-5" id="request-col">
            
            {/* Promo Poin & Penukaran Lilin */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl border border-emerald-500 shadow-md p-6 mb-6" id="claim-points-card">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-5 w-5 text-amber-300 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-200">Keanggotaan & Klaim Poin</h3>
              </div>
              <p className="text-[11px] text-white/95 leading-relaxed mb-4">
                Pilih tabungan dalam bentuk Koin Poin untuk ditukarkan dengan produk lilin aromaterapi premium pilihan Anda secara gratis!
              </p>
              
              <div className="bg-white/10 rounded-xl p-4 border border-white/10 mb-4">
                <div className="flex justify-between items-center text-xs mb-1 font-bold">
                  <span>Progress Koin Anda:</span>
                  <span className="font-mono text-amber-300 text-sm">{(totalLiters * 4)} / 50 Poin</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-black/25 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${Math.min(((totalLiters * 4) / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {(totalLiters * 4) >= 50 ? (
                <div className="space-y-3">
                  <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-xs font-bold leading-relaxed text-amber-300 text-center animate-bounce">
                    Selamat! Poin Anda mencukupi untuk klaim Lilin Aromaterapi gratis! 🎉
                  </div>
                  <a
                    href={`https://wa.me/6281992020296?text=Halo%20EcoOil,%20saya%20sudah%20mencapai%20${totalLiters * 4}%20poin%20di%20akun%20${currentUser.email}%20dan%20ingin%20menukarkan%20lilin%20aromaterapi%20gratis!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 rounded-xl text-xs font-black text-center block transition-colors shadow-sm cursor-pointer"
                  >
                    Klaim Lilin Gratis via WA (081992020296)
                  </a>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[11px] text-emerald-100 font-medium">
                    Butuh {50 - (totalLiters * 4)} Poin lagi untuk mendapatkan 1 buah Lilin Aromaterapi gratis!
                  </p>
                  <p className="text-[10px] text-emerald-200/90 italic">
                    Tips: 1 Liter setara dengan 4 Poin!
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6" id="pickup-form-card">
              <div className="flex items-center gap-2.5 mb-2" id="pickup-header">
                <Truck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-zinc-900">Request Penjemputan</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-6">
                Kami siap mengambil langsung minyak jelantah saringan Anda di rumah atau restoran demi kenyamanan ekstra.
              </p>

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-bold leading-relaxed mb-6" id="pickup-success">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handlePickupSubmit} className="space-y-4" id="form-pickup">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Perkiraan Volume (Liter)</label>
                  <div className="flex gap-3 items-center">
                    <input
                      id="input-pickup-liters"
                      type="range"
                      min="5"
                      max="150"
                      value={formLiters}
                      onChange={(e) => setFormLiters(Number(e.target.value))}
                      className="w-full select-none accent-emerald-600 h-1.5 bg-zinc-100 rounded-lg cursor-pointer"
                    />
                    <span className="text-sm font-black font-mono bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 w-24 text-center">
                      {formLiters} L
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Alamat Penjemputan Lengkap</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <textarea
                      placeholder="Masukkan nama jalan, nomor rumah, kelurahan, dan kota"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-zinc-700"
                      id="input-address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  id="btn-submit-pickup"
                >
                  <Truck className="h-4 w-4" />
                  <span>Ajukan Penjemputan</span>
                </button>
              </form>
            </div>
          </div>

          {/* User deposit logs column */}
          <div className="md:col-span-12 lg:col-span-7" id="logs-col">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm" id="logs-card">
              <h3 className="text-base font-bold text-zinc-900 mb-4" id="history-title">Riwayat Log Setoran</h3>
              
              {userDeposits.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 border-2 border-dashed border-zinc-100 rounded-xl" id="empty-history-wrapper">
                  <Calendar className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs">Belum ada riwayat setoran minyak jelantah.</p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-thin" id="table-wrapper">
                  <table className="w-full text-left text-sm" id="deposits-table">
                    <thead>
                      <tr className="border-b border-zinc-100 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <th className="pb-3 pr-2">Tanggal</th>
                        <th className="pb-3 px-2">Kualitas</th>
                        <th className="pb-3 px-2">Volume</th>
                        <th className="pb-3 px-2 text-right">Penghasilan</th>
                        <th className="pb-3 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 text-xs">
                      {userDeposits.map((d) => (
                        <tr key={d.id} className="hover:bg-zinc-50/50" id={`row-item-${d.id}`}>
                          <td className="py-3 pr-2 font-medium text-zinc-600">{d.date}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 font-bold rounded-full ${
                              d.grade === "A" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              d.grade === "B" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                              "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                              Grade {d.grade}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-mono font-bold text-zinc-800">{d.liters} Liter</td>
                          <td className="py-3 px-2 text-right font-mono font-black text-emerald-700">
                            Rp {d.totalEarnings.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 pl-2 text-right">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${
                              d.status === "Selesai" 
                                ? "bg-emerald-100 text-emerald-800"
                                : d.status === "Dijadwalkan"
                                ? "bg-blue-100 text-blue-800 animate-pulse"
                                : "bg-zinc-100 text-zinc-600"
                            }`}>
                              {d.status === "Selesai" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3 text-zinc-400" />
                              )}
                              <span>{d.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
