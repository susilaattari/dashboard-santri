"use client";

import { useState } from "react";
import {
  Menu,
  X,
  BookCheck,
  BookOpen,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";

export default function Sidebar({ children, session }) {
  const [open, setOpen] = useState(false);

  // MENU UNTUK GURU
  const menuGuru = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/", last: true },
    {
      name: "Data Hafalan",
      icon: BookOpen,
      href: "/guru/dashboard",
      last: true,
    },
    {
      name: "Progress Hafalan",
      icon: BookCheck,
      href: "/summary",
      last: false,
    },
  ];

  // MENU UNTUK WALISANTRI
  const menuWali = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/", last: true },
    {
      name: "Data Hafalan Anak",
      icon: BookOpen,
      href: "/walisantri/dashboard",
      last: false,
    },
  ];

  // MENU UNTUK ADMIN
  const menuAdmin = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/", last: true },
    {
      name: "Tambah Santri",
      icon: UserPlus,
      href: "/dashboard/tambah-santri",
      last: true,
    },
    { name: "Tambah Akun", icon: UserPlus, href: "/register", last: true },
    {
      name: "Progress Hafalan",
      icon: BookCheck,
      href: "/summary",
      last: false,
    },
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
      {/* === MOBILE BOTTOM MENU BUTTON === */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-30 transition-all duration-200 active:scale-95"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* === SIDEBAR DESKTOP === */}
      <div className="hidden md:block fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm p-6">
        {/* Header Sidebar */}
        <div className="flex justify-between items-center mb-8 mt-2">
          <h2 className="text-xl font-bold text-slate-900">
            {session?.user?.role === "WALISANTRI"
              ? "Wali Santri Panel"
              : session?.user?.role === "ADMIN"
              ? "Kordinator Panel"
              : "Guru Panel"}
          </h2>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium ${
                  item.last ? "border-b border-slate-200/50" : ""
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* === SIDEBAR MOBILE (BOTTOM SHEET) === */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 z-50
          transition-all duration-300 ease-in-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ maxHeight: "80vh" }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            {session?.user?.role === "WALISANTRI"
              ? "Wali Santri Panel"
              : session?.user?.role === "ADMIN"
              ? "Kordinator Panel"
              : "Guru Panel"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} className="text-slate-700" />
          </button>
        </div>

        {/* Menu - Scrollable */}
        <nav
          className="flex flex-col gap-2 p-6 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          {currentMenu.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium ${
                  item.last ? "border-b border-slate-200/50" : ""
                }`}
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
          className="fixed inset-0 bg-black/40 z-45 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="presentation"
          style={{ animation: "fadeIn 0.3s ease-in-out" }}
        ></div>
      )}

      {/* === MAIN CONTENT === */}
      <main className="flex-1 w-full md:h-screen min-h-screen p-2 md:p-6 mt-2 md:mt-8 md:ml-64">
        {children}
      </main>
    </div>
  );
}
