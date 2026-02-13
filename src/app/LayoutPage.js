"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { LogOut, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function LayoutPage({ children, session }) {
  const pathname = usePathname();
  const hiddenPages = ["/login"];
  const isAuthPage = hiddenPages.includes(pathname);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownOpen && !e.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dropdownOpen]);

  return (
    <SessionProvider>
      {!isAuthPage ? (
        <div className="h-screen bg-slate-50 flex flex-col w-full overflow-hidden">
          {/* ===== NAVBAR ===== */}
          <nav className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-50">
            <div className="px-4 md:px-6 py-4">
              <div className="flex justify-between items-center ">
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition hidden md:flex"
                  >
                    <Menu size={22} />
                  </button>

                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">DM</span>
                  </div>

                  <h1 className="text-xl font-bold text-slate-900 hidden sm:block">
                    Dashboard Mutaba'ah
                  </h1>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-slate-600 hidden sm:block">
                    Halo,{" "}
                    <span className="font-semibold text-slate-900">
                      {session?.user?.name ?? "Selamat Datang"}
                    </span>
                  </p>

                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <span className="text-sm font-medium hidden sm:block">
                        {session?.user?.name ?? "Guest"}
                      </span>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                        <div className="p-3 border-b">
                          <p className="text-sm font-semibold">
                            {session?.user?.name ?? "Pengguna"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {session?.user?.email ?? "-"}
                          </p>
                        </div>

                        <div className="p-2">
                          {session ? (
                            <form action="/api/auth/signout" method="post">
                              <button
                                type="submit"
                                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                              >
                                <LogOut size={16} />
                                Logout
                              </button>
                            </form>
                          ) : (
                            <a
                              href="/login"
                              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                            >
                              <User size={16} />
                              Login
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* ===== SIDEBAR + CONTENT ===== */}
          {session ? (
            <Sidebar session={session} isOpen={sidebarOpen}>
              <div className="w-full h-full overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-50">
                <div className="min-h-full pb-24">{children}</div>
              </div>
            </Sidebar>
          ) : (
            <div className="flex-1 overflow-auto">{children}</div>
          )}
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50">{children}</div>
      )}
    </SessionProvider>
  );
}
