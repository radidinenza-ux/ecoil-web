import './globals.css';
import type { Metadata } from "next";
import React from "react";
import Header from "@/components/Header";
import { AppProvider } from "@/components/context";

export const metadata: Metadata = {
  title: "EcoOil - Solusi Minyak Jelantah Terpadu",
  description: "Sistem Terintegrasi Pengumpulan Minyak Jelantah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-zinc-50 flex flex-col text-zinc-900">
        <AppProvider>
          <Header />
          <div className="flex-1 flex flex-col" id="app-layout-wrapper">
            {children}
          </div>
        </AppProvider>
        <footer className="w-full border-t border-zinc-100 bg-white py-6" id="main-footer">
          <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-500">
            © 2026 EcoOil. Hak Cipta Dilindungi.
          </div>
        </footer>
      </body>
    </html>
  );
}
