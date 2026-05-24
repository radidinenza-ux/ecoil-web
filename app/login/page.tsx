'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, Role } from "@/components/context";
import { Droplet, Key, User, ShieldCheck, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useApp();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    }
  }, [currentUser, router]);

  const handleQuickLogin = (emailPreset: string, rolePreset: Role, namePreset: string) => {
    setError("");
    login(emailPreset, rolePreset, namePreset);
    // Router redirect is handled by useEffect
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Masukkan alamat email yang valid.");
      return;
    }

    if (tab === "signup" && !name) {
      setError("Silakan masukkan nama lengkap.");
      return;
    }

    // Process manual signin or registers
    login(email, role, name || email.split("@")[0]);
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-6 bg-gradient-to-b from-emerald-50/10 via-zinc-50 to-zinc-50/20" id="login-page">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden" id="login-container">
        
        {/* Banner header decoration */}
        <div className="bg-emerald-600 px-6 py-8 text-white text-center relative overflow-hidden" id="login-decor-header">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500 rounded-full opacity-20" />
          <div className="absolute -left-10 -top-10 w-24 h-24 bg-teal-500 rounded-full opacity-20" />
          
          <div className="flex justify-center mb-3" id="login-header-logo">
            <div className="p-3 bg-white/15 rounded-full backdrop-blur-sm">
              <Droplet className="h-8 w-8 text-white fill-emerald-100" />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight" id="login-header-title">Selamat Datang di EcoOil</h2>
          <p className="text-emerald-100 text-xs mt-1">Gunakan platform terintegrasi pengumpulan minyak jelantah terpadu</p>
        </div>

        <div className="p-8" id="login-inner-form">
          {/* Quick tester helper block */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6 text-xs text-amber-900" id="presets-panel">
            <span className="font-bold flex items-center gap-1.5 text-amber-800 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
              Akun Demo Penilaian (Silakan Klik Menu Masuk):
            </span>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setEmail("user@ecooil.id");
                  setPassword("password123");
                  setRole("USER");
                  setTab("signin");
                }}
                className="p-3 bg-white border border-amber-200 hover:bg-amber-100/50 rounded-xl font-semibold text-zinc-700 flex items-start gap-2.5 cursor-pointer transition-colors text-left"
                id="preset-user-btn"
              >
                <User className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="leading-normal">
                  <span className="block font-bold text-zinc-900 text-[11px] uppercase tracking-wider text-emerald-700">Pelanggan / Mitra (USER)</span>
                  <p className="text-zinc-500 font-mono mt-0.5">Email: <span className="text-zinc-800 font-bold">user@ecooil.id</span></p>
                  <p className="text-zinc-500 font-mono">Password: <span className="text-zinc-800 font-bold">password123</span></p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setEmail("radidinenza@gmail.com");
                  setPassword("password123");
                  setRole("ADMIN");
                  setTab("signin");
                }}
                className="p-3 bg-white border border-amber-200 hover:bg-amber-100/50 rounded-xl font-semibold text-zinc-700 flex items-start gap-2.5 cursor-pointer transition-colors text-left"
                id="preset-admin-btn"
              >
                <ShieldCheck className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="leading-normal">
                  <span className="block font-bold text-zinc-900 text-[11px] uppercase tracking-wider text-purple-700">Dosen / Admin Utama (ADMIN)</span>
                  <p className="text-zinc-500 font-mono mt-0.5">Email: <span className="text-zinc-800 font-bold">radidinenza@gmail.com</span></p>
                  <p className="text-zinc-500 font-mono">Password: <span className="text-zinc-800 font-bold">password123</span></p>
                </div>
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2 text-center leading-normal">
              *Klik kartu akun demo di atas untuk otomatis mengisi form email & kata sandi!
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-zinc-100 mb-6" id="login-tabs">
            <button
              onClick={() => { setTab("signin"); setError(""); }}
              className={`flex-1 pb-2.5 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                tab === "signin"
                  ? "border-emerald-600 text-emerald-700 font-extrabold"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
              id="tab-signin"
            >
              Masuk
            </button>
            <button
              onClick={() => { setTab("signup"); setError(""); }}
              className={`flex-1 pb-2.5 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                tab === "signup"
                  ? "border-emerald-600 text-emerald-700 font-extrabold"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              }`}
              id="tab-signup"
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Alert Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-100 text-xs font-semibold leading-relaxed" id="login-alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="credentials-form-tag">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  id="input-email"
                />
              </div>
            </div>

            {tab === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Masukkan nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      id="input-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Role Akun</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <button
                      type="button"
                      onClick={() => setRole("USER")}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        role === "USER"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                          : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                      }`}
                      id="role-select-user"
                    >
                      Mitra Rumah Tangga
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("ADMIN")}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        role === "ADMIN"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                          : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                      }`}
                      id="role-select-admin"
                    >
                      Staff Admin (ADMIN)
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Kata Sandi</label>
                {tab === "signin" && (
                  <span className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer">Lupa Sandi?</span>
                )}
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  id="input-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer hover:shadow-emerald-600/10 transition-all flex items-center justify-center gap-1.5 text-sm"
              id="btn-submit-login"
            >
              <span>{tab === "signin" ? "Masuk ke Sistem" : "Buat Akun & Masuk"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
