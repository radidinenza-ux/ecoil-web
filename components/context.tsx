'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "USER" | "ADMIN";

export interface User {
  email: string;
  name: string;
  role: Role;
}

export interface Deposit {
  id: string;
  email: string;
  liters: number;
  grade: "A" | "B" | "C";
  pricePerLiter: number;
  totalEarnings: number;
  date: string;
  status: "Menunggu Penjemputan" | "Dijadwalkan" | "Selesai";
  address?: string;
}

export interface GradePrice {
  id: "A" | "B" | "C";
  name: string;
  price: number;
  description: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  deposits: Deposit[];
  gradePrices: GradePrice[];
  login: (email: string, role: Role, name: string) => boolean;
  logout: () => void;
  addPickupRequest: (liters: number, address: string) => void;
  adminAddDeposit: (email: string, liters: number, grade: "A" | "B" | "C") => boolean;
  adminUpdatePrice: (gradeId: "A" | "B" | "C", newPrice: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_GRADE_PRICES: GradePrice[] = [
  { id: "A", name: "Grade A (Premium)", price: 3000, description: "Kuning jernih, sisa remahan nihil, kadar air sangat rendah (< 1%)" },
  { id: "B", name: "Grade B (Standard)", price: 2000, description: "Cokelat sedang kemerahan, disaring halus, kadar air (< 2%)" },
  { id: "C", name: "Grade C (Raw/Gosong)", price: 1000, description: "Hitam pekat kecokelatan, belum disaring, endapan tebal" },
];

const DEFAULT_DEPOSITS: Deposit[] = [
  {
    id: "dep-1",
    email: "user@ecooil.id",
    liters: 12,
    grade: "A",
    pricePerLiter: 3000,
    totalEarnings: 36000,
    date: "2026-05-10",
    status: "Selesai",
    address: "Jl. Sudirman No. 12, Jakarta"
  },
  {
    id: "dep-2",
    email: "user@ecooil.id",
    liters: 5,
    grade: "B",
    pricePerLiter: 2000,
    totalEarnings: 10000,
    date: "2026-05-18",
    status: "Selesai",
    address: "Jl. Sudirman No. 12, Jakarta"
  },
  {
    id: "dep-3",
    email: "radidinenza@gmail.com",
    liters: 25,
    grade: "A",
    pricePerLiter: 3000,
    totalEarnings: 75000,
    date: "2026-05-20",
    status: "Selesai",
    address: "Kecamatan Menteng, Jakarta Pusat"
  },
  {
    id: "dep-4",
    email: "user@ecooil.id",
    liters: 8,
    grade: "C",
    pricePerLiter: 1000,
    totalEarnings: 8000,
    date: "2026-05-22",
    status: "Selesai",
    address: "Jl. Sudirman No. 12, Jakarta"
  },
  {
    id: "dep-5",
    email: "radidinenza@gmail.com",
    liters: 40,
    grade: "B",
    pricePerLiter: 2000,
    totalEarnings: 80000,
    date: "2026-05-23",
    status: "Selesai",
    address: "Kecamatan Menteng, Jakarta Pusat"
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [gradePrices, setGradePrices] = useState<GradePrice[]>([]);

  // Load from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("ecooil_current_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedUsers = localStorage.getItem("ecooil_users_v4");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers: User[] = [
        { email: "admin@ecooil.id", name: "Chief Operational Admin", role: "ADMIN" },
        { email: "user@ecooil.id", name: "Budi Santoso", role: "USER" },
        { email: "radidinenza@gmail.com", name: "Pak Radidi Nenza", role: "ADMIN" }, // Bootstrapped admin
      ];
      setUsers(defaultUsers);
      localStorage.setItem("ecooil_users_v4", JSON.stringify(defaultUsers));
    }

    const storedPrices = localStorage.getItem("ecooil_prices_v4");
    if (storedPrices) {
      setGradePrices(JSON.parse(storedPrices));
    } else {
      setGradePrices(DEFAULT_GRADE_PRICES);
      localStorage.setItem("ecooil_prices_v4", JSON.stringify(DEFAULT_GRADE_PRICES));
    }

    const storedDeposits = localStorage.getItem("ecooil_deposits_v4");
    if (storedDeposits) {
      setDeposits(JSON.parse(storedDeposits));
    } else {
      setDeposits(DEFAULT_DEPOSITS);
      localStorage.setItem("ecooil_deposits_v4", JSON.stringify(DEFAULT_DEPOSITS));
    }
  }, []);

  const login = (email: string, role: Role, name: string): boolean => {
    const formattedEmail = email.trim().toLowerCase();
    
    // Auto-detect or look up existing user
    let existingUser = users.find(u => u.email.toLowerCase() === formattedEmail);
    
    if (!existingUser) {
      // Create user on the fly as standard client persistence
      existingUser = {
        email: formattedEmail,
        name: name || formattedEmail.split("@")[0],
        role: role // respect parameter block
      };
      
      const updatedUsers = [...users, existingUser];
      setUsers(updatedUsers);
      localStorage.setItem("ecooil_users_v4", JSON.stringify(updatedUsers));
    }

    setCurrentUser(existingUser);
    localStorage.setItem("ecooil_current_user", JSON.stringify(existingUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("ecooil_current_user");
  };

  const addPickupRequest = (liters: number, address: string) => {
    if (!currentUser) return;
    const gradeBPrice = gradePrices.find(p => p.id === "B")?.price || 2000;
    const newDep: Deposit = {
      id: `dep-${Date.now()}`,
      email: currentUser.email,
      liters,
      grade: "B", // Pickup defaults to B until graded by Admin
      pricePerLiter: gradeBPrice,
      totalEarnings: liters * gradeBPrice,
      date: new Date().toISOString().split("T")[0],
      status: "Menunggu Penjemputan",
      address,
    };

    const updated = [newDep, ...deposits];
    setDeposits(updated);
    localStorage.setItem("ecooil_deposits_v4", JSON.stringify(updated));
  };

  const adminAddDeposit = (email: string, liters: number, grade: "A" | "B" | "C"): boolean => {
    const userEmail = email.trim().toLowerCase();
    const rate = gradePrices.find(p => p.id === grade)?.price || 1000;
    
    const newDep: Deposit = {
      id: `dep-${Date.now()}`,
      email: userEmail,
      liters,
      grade,
      pricePerLiter: rate,
      totalEarnings: liters * rate,
      date: new Date().toISOString().split("T")[0],
      status: "Selesai",
    };

    // Ensure user exists
    if (!users.some(u => u.email.toLowerCase() === userEmail)) {
      const newUser: User = {
        email: userEmail,
        name: userEmail.split("@")[0],
        role: "USER"
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("ecooil_users_v4", JSON.stringify(updatedUsers));
    }

    const updated = [newDep, ...deposits];
    setDeposits(updated);
    localStorage.setItem("ecooil_deposits_v4", JSON.stringify(updated));
    return true;
  };

  const adminUpdatePrice = (gradeId: "A" | "B" | "C", newPrice: number) => {
    const updatedPrices = gradePrices.map(p => 
      p.id === gradeId ? { ...p, price: newPrice } : p
    );
    setGradePrices(updatedPrices);
    localStorage.setItem("ecooil_prices_v4", JSON.stringify(updatedPrices));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      deposits,
      gradePrices,
      login,
      logout,
      addPickupRequest,
      adminAddDeposit,
      adminUpdatePrice
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
