"use client";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function LayoutPage({ children, session }) {
  const pathname = usePathname();
  const hiddenPages = ["/login"];
  const isAuthPage = hiddenPages.includes(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <>
      <SessionProvider>
        {!isAuthPage ? (
          <div className="h-screen bg-slate-50 flex flex-col w-full overflow-hidden p-0">
            {/* === MODERN NAVBAR === */}
            <nav className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-[60] relative">
              <div className="max-w-full px-4 md:px-6 py-4">
                <div className="flex justify-between items-center">
                  {/* Left: Logo/Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">DM</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 hidden sm:block">
                      Dashboard Mutaba'ah
                    </h1>
                  </div>

                  {/* Right: User Menu */}
                  <div className="flex items-center gap-4">
                    {/* Welcome Text - Hidden on small screens */}
                    <p className="text-sm text-slate-600 hidden sm:block">
                      Halo,{" "}
                      <span className="font-semibold text-slate-900">
                        {session?.user?.name ?? "Selamat Datang"}
                      </span>
                    </p>

                    {/* User Dropdown */}
                    <div className="relative z-50 dropdown-container">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="User menu"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 hidden sm:block">
                          {session?.user?.name ?? "Silahkan Login dulu"}
                        </span>
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                          <div className="p-3 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-900">
                              {session?.user?.name ?? "Pengguna"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {session?.user?.email ?? "Email"}
                            </p>
                          </div>
                          <div className="p-2">
                            {session ? (
                              <form
                                action="/api/auth/signout"
                                method="post"
                                className="w-full"
                              >
                                <button
                                  type="submit"
                                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                                >
                                  <LogOut size={16} />
                                  Logout
                                </button>
                              </form>
                            ) : (
                              <a
                                href="/login"
                                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
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

            {/* === SIDEBAR + CONTENT === */}
            {session ? (
              <Sidebar session={session}>
                <div className="w-full h-full overflow-y-auto md:p-6 lg:p-10 p-1 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                  <div className="min-h-full pb-28">{children}</div>
                </div>
              </Sidebar>
            ) : (
              <div className="flex-1 overflow-auto">{children}</div>
            )}
          </div>
        ) : (
          <div className="min-h-screen bg-slate-50 w-full">{children}</div>
        )}
      </SessionProvider>
    </>
  );
}
