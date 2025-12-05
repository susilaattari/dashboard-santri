// app/api/walisantri/santri/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { calculateJuzProgressEnhanced } from "../../../../../utils/juzcalculation";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    // ✅ Validasi session
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Validasi role
    if (session.user.role !== "WALISANTRI") {
      return NextResponse.json(
        { success: false, message: "Access denied. Walisantri only." },
        { status: 403 }
      );
    }

    const walisantriId = session.user.walisantri_id;
    const santriId = params.id;

    if (!walisantriId || !santriId) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching santri detail:", santriId);

    // ========================================
    // QUERY SANTRI
    // ========================================
    const santri = await prisma.santri.findFirst({
      where: {
        id: Number(santriId),
        walisantri_id: Number(walisantriId), // ✅ Pastikan santri ini milik walisantri yang login
      },
      include: {
        walisantri: true,
        guru: true,
        history: {
          where: {
            status: "LULUS",
            jenis: "ZIYADAH",
          },
          orderBy: {
            tanggal: "desc",
          },
        },
      },
    });

    // ✅ Validasi kepemilikan
    if (!santri) {
      return NextResponse.json(
        {
          success: false,
          message: "Santri tidak ditemukan atau bukan anak Anda",
        },
        { status: 404 }
      );
    }

    console.log("✅ Santri found:", santri.nama);

    // ========================================
    // CALCULATE PROGRESS
    // ========================================
    const hafalanList = santri.history || [];
    const progress = calculateJuzProgressEnhanced(hafalanList);

    // ========================================
    // JUZ PROGRESS DETAIL (1-30)
    // ========================================
    const juzStructure = [
      { juz: 1, startPage: 1, endPage: 21, totalPages: 21 },
      { juz: 2, startPage: 22, endPage: 41, totalPages: 20 },
      { juz: 3, startPage: 42, endPage: 61, totalPages: 20 },
      { juz: 4, startPage: 62, endPage: 81, totalPages: 20 },
      { juz: 5, startPage: 82, endPage: 101, totalPages: 20 },
      { juz: 6, startPage: 102, endPage: 121, totalPages: 20 },
      { juz: 7, startPage: 122, endPage: 141, totalPages: 20 },
      { juz: 8, startPage: 142, endPage: 161, totalPages: 20 },
      { juz: 9, startPage: 162, endPage: 181, totalPages: 20 },
      { juz: 10, startPage: 182, endPage: 201, totalPages: 20 },
      { juz: 11, startPage: 202, endPage: 221, totalPages: 20 },
      { juz: 12, startPage: 222, endPage: 241, totalPages: 20 },
      { juz: 13, startPage: 242, endPage: 261, totalPages: 20 },
      { juz: 14, startPage: 262, endPage: 281, totalPages: 20 },
      { juz: 15, startPage: 282, endPage: 301, totalPages: 20 },
      { juz: 16, startPage: 302, endPage: 321, totalPages: 20 },
      { juz: 17, startPage: 322, endPage: 341, totalPages: 20 },
      { juz: 18, startPage: 342, endPage: 361, totalPages: 20 },
      { juz: 19, startPage: 362, endPage: 381, totalPages: 20 },
      { juz: 20, startPage: 382, endPage: 401, totalPages: 20 },
      { juz: 21, startPage: 402, endPage: 421, totalPages: 20 },
      { juz: 22, startPage: 422, endPage: 441, totalPages: 20 },
      { juz: 23, startPage: 442, endPage: 461, totalPages: 20 },
      { juz: 24, startPage: 462, endPage: 481, totalPages: 20 },
      { juz: 25, startPage: 482, endPage: 501, totalPages: 20 },
      { juz: 26, startPage: 502, endPage: 521, totalPages: 20 },
      { juz: 27, startPage: 522, endPage: 541, totalPages: 20 },
      { juz: 28, startPage: 542, endPage: 561, totalPages: 20 },
      { juz: 29, startPage: 562, endPage: 581, totalPages: 20 },
      { juz: 30, startPage: 582, endPage: 604, totalPages: 23 },
    ];

    const juzProgress = juzStructure.map((juzInfo) => {
      const isCompleted = progress.completedJuz.includes(juzInfo.juz);

      let pagesCompleted = 0;
      let percentage = 0;

      if (isCompleted) {
        pagesCompleted = juzInfo.totalPages;
        percentage = 100;
      } else {
        const inProgress = progress.inProgressJuz.find(
          (j) => j.juz === juzInfo.juz
        );
        if (inProgress) {
          pagesCompleted = juzInfo.totalPages - inProgress.remainingPages;
          percentage = inProgress.percentage;
        }
      }

      return {
        juz: juzInfo.juz,
        isCompleted,
        pagesCompleted,
        totalPages: juzInfo.totalPages,
        percentage,
      };
    });

    // ========================================
    // RESPONSE
    // ========================================
    return NextResponse.json({
      success: true,
      data: {
        santri: {
          id: santri.id,
          nama: santri.nama,
          kelas: santri.kelas,
          tanggal_lahir: santri.tanggal_lahir,
          guru: santri.guru?.nama || "-",
          juzSelesai: progress.summary.completedJuz,
          persenTotal: progress.summary.percentageTotal,
          totalHalaman: progress.summary.totalHalamanDihafal,
        },
        juzProgress,
        history: hafalanList.map((h) => ({
          tanggal: h.tanggal,
          surah: h.surah,
          halaman_awal: h.halaman_awal,
          halaman_akhir: h.halaman_akhir,
          ayat_mulai: h.ayat_mulai,
          ayat_selesai: h.ayat_selesai,
          status: h.status,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching santri detail:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
