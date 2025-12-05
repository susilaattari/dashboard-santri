import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("👤 Token:", token ? `Ada (Role: ${token.role})` : "Tidak ada");

  // User sudah login dan akses /login → redirect sesuai role
  if (token && path === "/login") {
    if (token.role === "WALISANTRI") {
      console.log("↪️ Redirect dari /login ke: /walisantri/dashboard");
      return NextResponse.redirect(new URL("/walisantri/dashboard", req.url));
    }
    console.log("↪️ Redirect dari /login ke: /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // User belum login dan bukan di /login atau api/auth
  if (!token && path !== "/login" && !path.startsWith("/api/auth")) {
    console.log("↪️ Redirect ke /login (belum login)");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Redirect dari homepage: WALISANTRI ke dashboard
  if (token && path === "/") {
    if (token.role === "WALISANTRI") {
      console.log("↪️ WALISANTRI redirect dari / ke: /walisantri/dashboard");
      return NextResponse.redirect(new URL("/dashboard/walisantri", req.url));
    }
    console.log("✅ Pass - ADMIN/GURU boleh akses /");
    return NextResponse.next();
  }

  // ✅ ROLE-BASED PROTECTION (REVISI)
  // ADMIN & GURU bisa akses semua route
  if (token?.role === "ADMIN" || token?.role === "GURU") {
    console.log("✅ Pass - ADMIN/GURU boleh akses semua route");
    return NextResponse.next();
  }

  // WALISANTRI hanya bisa akses /walisantri/*
  if (token?.role === "WALISANTRI" && !path.startsWith("/walisantri")) {
    console.log("🚫 WALISANTRI coba akses route lain:", path);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // SANTRI hanya bisa akses /santri/*
  if (token?.role === "SANTRI" && !path.startsWith("/santri")) {
    console.log("🚫 SANTRI coba akses route lain:", path);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  console.log("✅ Pass - lanjutkan request");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/guru/:path*",
    "/walisantri/:path*",
    "/santri/:path*",
  ],
};
