// ========================================
// API Endpoint untuk Next Page Info
// ========================================
// File: app/api/hafalan/next-page/[santri_id]/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { santri_id } = params;

    // Ambil hafalan LULUS dan ZIYADAH
    const hafalan = await prisma.HafalanSantri.findMany({
      where: {
        santri_id: Number(santri_id),
        status: "LULUS",
        jenis: "ZIYADAH",
      },
      select: {
        halaman: true,
      },
      orderBy: {
        halaman: "asc",
      },
    });

    if (hafalan.length === 0) {
      return new Response(
        JSON.stringify({
          lastPage: 0,
          nextExpectedPage: 1,
          totalPages: 0,
          message: "Belum ada hafalan. Mulai dari halaman 1.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const halamanDihafal = [...new Set(hafalan.map((h) => h.halaman))].sort(
      (a, b) => a - b
    );
    const lastPage = halamanDihafal[halamanDihafal.length - 1];
    const nextExpectedPage = lastPage + 1;

    // Cek missing pages
    const missingPages = [];
    for (let i = 1; i < lastPage; i++) {
      if (!halamanDihafal.includes(i)) {
        missingPages.push(i);
      }
    }

    return new Response(
      JSON.stringify({
        lastPage,
        nextExpectedPage: nextExpectedPage <= 604 ? nextExpectedPage : null,
        totalPages: halamanDihafal.length,
        missingPages: missingPages.length > 0 ? missingPages : null,
        halamanDihafal: halamanDihafal,
        isComplete: lastPage === 604 && missingPages.length === 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error getting next page info:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
