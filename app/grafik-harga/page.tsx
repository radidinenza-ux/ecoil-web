'use client';

import React, { useState } from "react";
import { TrendingUp, HelpCircle, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/context";

interface PricePoint {
  id: number;
  month: string;
  price: number;
}

export default function GrafikHargaPage() {
  const [activePoint, setActivePoint] = useState<number>(5); // Default to newest month
  const { gradePrices } = useApp();

  const priceA = gradePrices.find(p => p.id === "A")?.price || 2500;
  const priceB = gradePrices.find(p => p.id === "B")?.price || 2000;
  const priceC = gradePrices.find(p => p.id === "C")?.price || 1500;
const historicalData: PricePoint[] = [
{ id: 1, month: "Mei", price: 2000 },
  { id: 2, month: "Jun", price: 2055 },
  { id: 3, month: "Jul", price: 2100 },
  { id: 4, month: "Agu", price: 2000 },
  { id: 5, month: "Sep", price: 2150 },
  { id: 6, month: "Okt", price: 2250 }  
];
  

  const currentGradePrices = [
    {
      grade: "Grade A (Premium)",
      price: `Rp ${priceA.toLocaleString("id-ID")} / Liter`,
      criteria: "Kuning jernih, sisa remahan nihil, kadar air sangat rendah (< 1%)",
      accent: "text-emerald-700",
      border: "hover:border-emerald-300",
    },
    {
      grade: "Grade B (Standard)",
      price: `Rp ${priceB.toLocaleString("id-ID")} / Liter`,
      criteria: "Cokelat sedang kemerahan, disaring halus, kadar air (< 2%)",
      accent: "text-blue-700",
      border: "hover:border-blue-300",
    },
    {
      grade: "Grade C (Raw/Gosong)",
      price: `Rp ${priceC.toLocaleString("id-ID")} / Liter`,
      criteria: "Hitam pekat kecokelatan, belum disaring, endapan tebal",
      accent: "text-amber-700",
      border: "hover:border-amber-300",
    },
  ];

  // SVG dimensions for pricing trendline chart
  const width = 500;
  const height = 180;
  const padding = 35;

  const pricingValues = historicalData.map(d => d.price);
  const minPrice = Math.min(...pricingValues) - 200;
  const maxPrice = Math.max(...pricingValues) + 200;

  const pointsCoords = historicalData.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / (historicalData.length - 1);
    const y = height - padding - ((d.price - minPrice) * (height - padding * 2)) / (maxPrice - minPrice);
    return { x, y, ...d };
  });

  // Calculate polyline coordinates
  let pathString = "";
  if (pointsCoords.length > 0) {
    pathString = `M ${pointsCoords[0].x} ${pointsCoords[0].y} ` + 
      pointsCoords.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
  }

  return (
    <main className="flex-1 bg-zinc-50/50 py-12 px-6" id="harga-page">
      <div className="mx-auto max-w-4xl" id="harga-container">
        {/* Header */}
        <section className="text-center mb-12 animate-fade-in" id="harga-header">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-4" id="harga-title">
            Informasi Indeks <span className="text-emerald-600">Harga Terkini</span>
          </h1>
          <p className="text-md text-zinc-650 max-w-2xl mx-auto" id="harga-subtitle">
            EcoOil berkomitmen untuk selalu transparan. Kami memperbarui nilai indeks pembelian minyak jelantah saringan secara dinamis demi kenyamanan penyetor.
          </p>
        </section>

        {/* Chart Card */}
        <section className="bg-white rounded-2xl border border-zinc-150 shadow-xl p-6 sm:p-8 mb-10" id="chart-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8" id="chart-header-row">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 text-emerald-600" id="icon-trending" />
                <h2 className="text-lg font-bold text-zinc-900" id="chart-title">Indeks Tren Harga</h2>
              </div>
              <p className="text-xs text-zinc-400 font-mono">IDR per Liter • Update 23 Mei 2026</p>
            </div>

            {/* Price display based on hovered month dot */}
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl text-right ml-0 sm:ml-auto" id="price-focused-display">
              <span className="block text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Harga Ref ({historicalData[activePoint].month})
              </span>
              <span className="text-xl font-black text-emerald-700 font-mono">
                Rp {historicalData[activePoint].price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Sparkline SVG */}
          <div className="relative w-full aspect-[21/9] bg-zinc-50/50 rounded-xl border border-zinc-100 flex items-center justify-center p-2 mb-6" id="chart-viewport">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" id="svg-chart-elem">
              {/* Reference Grid lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f1f4" strokeWidth="1" strokeDasharray="3" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f1f4" strokeWidth="1" strokeDasharray="3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f1f4" strokeWidth="1" strokeDasharray="3" />

              {/* Glowing spline path */}
              <path d={pathString} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Selection Interactive Circles */}
              {pointsCoords.map((pt) => {
                const isActive = activePoint === pt.id;
                return (
                  <g key={pt.id} className="cursor-pointer" onClick={() => setActivePoint(pt.id)} onMouseEnter={() => setActivePoint(pt.id)}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? "7.5" : "5"}
                      fill={isActive ? "#10b981" : "#ffffff"}
                      stroke="#10b981"
                      strokeWidth={isActive ? "3.5" : "2"}
                      className="transition-all duration-150"
                    />
                    <text
                      x={pt.x}
                      y={height - 8}
                      textAnchor="middle"
                      className={`text-[9px] font-mono select-none font-bold ${
                        isActive ? "fill-emerald-800 font-black" : "fill-zinc-400"
                      }`}
                    >
                      {pt.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex gap-2 justify-center" id="chart-mobile-selector">
            {historicalData.map((d) => (
              <button
                key={d.id}
                onClick={() => setActivePoint(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  activePoint === d.id ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                {d.month}
              </button>
            ))}
          </div>
        </section>

        {/* Pricing Category Card List */}
        <section className="mb-12" id="grades-section">
          <h2 className="text-xl font-extrabold text-zinc-900 mb-6 border-b border-zinc-100 pb-3" id="grades-title">
            Klasifikasi & Standar Pembelian
          </h2>
          <div className="grid md:grid-cols-3 gap-6" id="grades-grid">
            {currentGradePrices.map((g, index) => (
              <div 
                key={index} 
                className={`border border-zinc-150 rounded-2xl p-6 bg-white transition-all cursor-default ${g.border}`} 
                id={`grade-card-${index}`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">{g.grade}</h3>
                <span className={`text-xl font-black block mb-3 font-mono ${g.accent}`}>{g.price}</span>
                <p className="text-xs text-zinc-500 leading-relaxed min-h-[40px]" id={`grade-crit-${index}`}>{g.criteria}</p>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2 text-[11px] font-bold text-zinc-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Sedia Ditakar Instan</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Area */}
        <section className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6 sm:p-8" id="faq-section">
          <h3 className="text-base font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-600" />
            <span>Tanya Jawab Seputar Pengumpulan</span>
          </h3>
          <div className="space-y-4" id="faq-list">
            <div className="bg-white p-4 rounded-xl border border-zinc-150 shadow-sm" id="faq-1">
              <h4 className="text-sm font-bold text-zinc-900 mb-1">Mengapa harga minyak jelantah fluktuatif?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Harga acuan minyak jelantah (Used Cooking Oil) bervariasi bergantung dengan korelasi harga CPO (Crude Palm Oil) pasar global beserta permintaan suplai pasar energi berkelanjutan.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-zinc-150 shadow-sm" id="faq-2">
              <h4 className="text-sm font-bold text-zinc-900 mb-1">Bagaimana cara memperoleh harga Grade A tertinggi?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Pastikan minyak disaring halus dari remahan sisa gorengan, tidak tercampur cairan lain/air, serta disimpan dalam botol plastik higienis tertutup rapat.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
