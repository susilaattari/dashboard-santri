"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import {
  Menu,
  X,
  Home,
  Users,
  BookCheck,
  BookOpen,
  UserPlus,
  GraduationCap,
  UsersRound,
  ClipboardList,
  LayoutDashboard,
  Baby,
} from "lucide-react";

export default function Sidebar({ children, session }) {
  const [open, setOpen] = useState(false);

  // MENU UNTUK GURU
  const menuGuru = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Data Hafalan", icon: BookOpen, href: "/guru/dashboard" },
    { name: "Progress Hafalan", icon: BookCheck, href: "/summary" },
  ];

  // MENU UNTUK WALISANTRI
  const menuWali = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      name: "Data Hafalan Anak",
      icon: BookOpen,
      href: "/walisantri/dashboard",
    },
  ];

  // MENU UNTUK ADMIN
  const menuAdmin = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Tambah Santri", icon: UserPlus, href: "/dashboard/tambah-santri" },
    { name: "Tambah Akun", icon: UserPlus, href: "/register" },
    { name: "Data Guru", icon: GraduationCap, href: "/admin/guru" },
    { name: "Data Santri", icon: UsersRound, href: "/admin/santri" },
    { name: "Kelola Hafalan", icon: ClipboardList, href: "/admin/hafalan" },
  ];

  // Pilih menu berdasarkan role
  const getMenuByRole = () => {
    if (session?.user?.role === "GURU") return menuGuru;
    if (session?.user?.role === "WALISANTRI") return menuWali;
    if (session?.user?.role === "ADMIN") return menuAdmin;
    return [];
  };

  const currentMenu = getMenuByRole();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* === MOBILE TOP BAR === */}
      <div className="md:hidden w-full fixed top-0 left-0 h-16 flex items-center px-4 bg-white border-b border-slate-200 shadow-sm z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-slate-700" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-slate-900">Dashboard</h1>
      </div>

      {/* === SIDEBAR === */}
      <div
        className={`fixed md:fixed top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-screen w-64 bg-white border-r border-slate-200 shadow-sm p-6 z-40 md:z-auto
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header Sidebar */}
        <div className="flex justify-between items-center mb-8 mt-2">
          <h2 className="text-xl font-bold text-slate-900">
            {session?.role === "WALISANTRI"
              ? "Wali Santri Panel"
              : "Guru Panel"}
          </h2>

          {/* Tombol Close di Mobile */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} className="text-slate-700" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* === OVERLAY (Mobile) === */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
          role="presentation"
        ></div>
      )}

      {/* === MAIN CONTENT === */}
      <main className="flex-1 w-full md:h-screen min-h-screen p-4 md:p-6 mt-16 md:mt-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}
