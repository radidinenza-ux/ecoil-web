'use client';

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Droplet, Info, TrendingUp, Home, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useApp } from "@/components/context";

/**
 * Custom Next.js dynamic routing Link because of Next.js setup module rules.
 */
import NextLink from "next/link";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getDashboardHref = () => {
    if (!currentUser) return "/login";
    return currentUser.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/90 backdrop-blur-md" id="main-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" id="header-container">
        <NextLink href="/" className="flex items-center gap-2 font-bold text-emerald-700 hover:opacity-90 transition-opacity" id="header-logo-link">
          <Droplet className="h-6 w-6 text-emerald-600 fill-emerald-50 animate-pulse" id="header-logo-icon" />
          <span className="text-xl tracking-tight font-extrabold text-zinc-900" id="header-logo-text">
            Eco<span className="text-emerald-600">Oil</span>
          </span>
        </NextLink>
        <nav className="flex items-center gap-1 sm:gap-4" id="header-nav">
          <NextLink
            href="/"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/" 
                ? "bg-emerald-50 text-emerald-700 font-semibold" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600"
            }`}
            id="nav-link-home"
          >
            <Home className="h-4 w-4" />
            <span>Beranda</span>
          </NextLink>
          <NextLink
            href="/grafik-harga"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/grafik-harga" 
                ? "bg-emerald-50 text-emerald-700 font-semibold" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600"
            }`}
            id="nav-link-harga"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Grafik Harga</span>
          </NextLink>

          {/* Dynamic auth controls */}
          {currentUser ? (
            <div className="flex items-center gap-2 border-l border-zinc-100 pl-2 sm:pl-4" id="header-auth-section">
              <NextLink
                href={getDashboardHref()}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith("/dashboard")
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
                id="nav-link-dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </NextLink>
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Keluar"
                id="btn-signout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-zinc-100 pl-2 sm:pl-4" id="header-unauth-section">
              <NextLink
                href="/login"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/login"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
                id="nav-link-login"
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk</span>
              </NextLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
