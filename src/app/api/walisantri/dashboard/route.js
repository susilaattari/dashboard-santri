// app/api/walisantri/dashboard/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { calculateJuzProgressEnhanced } from "../../../../utils/juzcalculation";

export async function GET(req) {
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

    if (!walisantriId) {
      return NextResponse.json(
        { success: false, message: "Walisantri ID tidak ditemukan" },
        { status: 400 }
      );
    }

    console.log("📊 Fetching data for walisantri_id:", walisantriId);

    // ========================================
    // QUERY SANTRI BERDASARKAN WALISANTRI
    // ========================================
    const santriList = await prisma.santri.findMany({
      where: {
        walisantri_id: Number(walisantriId),
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
      orderBy: {
        nama: "asc",
      },
    });

    console.log("👨‍👩‍👧 Total anak ditemukan:", santriList.length);

    // ========================================
    // PROCESS SETIAP ANAK
    // ========================================
    const childrenWithProgress = santriList.map((santri) => {
      const hafalanList = santri.history || [];
      const progress = calculateJuzProgressEnhanced(hafalanList);

      // Hitung juz terakhir yang dihafal
      const allActiveJuz = [
        ...progress.completedJuz,
        ...progress.inProgressJuz.map((j) => j.juz),
      ].sort((a, b) => b - a);

      const juzTerakhir = allActiveJuz.length > 0 ? allActiveJuz[0] : 0;

      return {
        id: santri.id,
        nama: santri.nama,
        kelas: santri.kelas,
        tanggal_lahir: santri.tanggal_lahir,
        guru: santri.guru?.nama || "-",
        guru_id: santri.guru_id,

        // Progress summary
        juzSelesai: progress.summary.completedJuz,
        juzProgress: progress.summary.inProgressJuz,
        persenTotal: progress.summary.percentageTotal,
        totalHalaman: progress.summary.totalHalamanDihafal,

        // Juz terakhir
        juzTerakhir,

        // Hafalan terakhir
        hafalanTerakhir: progress.lastHafalan
          ? {
              tanggal: progress.lastHafalan.tanggal,
              surah: progress.lastHafalan.surah,
              halaman: progress.lastHafalan.halaman_akhir
                ? `${progress.lastHafalan.halaman_awal}-${progress.lastHafalan.halaman_akhir}`
                : `${progress.lastHafalan.halaman_awal}`,
              ayat: `${progress.lastHafalan.ayat_mulai}-${progress.lastHafalan.ayat_selesai}`,
            }
          : null,

        // Juz dalam progress (top 3)
        juzDalamProgress: progress.inProgressJuz.slice(0, 3).map((j) => ({
          juz: j.juz,
          percentage: j.percentage,
          remainingPages: j.remainingPages,
        })),
      };
    });

    // ========================================
    // STATISTIK KESELURUHAN
    // ========================================
    const totalAnak = childrenWithProgress.length;

    const avgJuz =
      totalAnak > 0
        ? (
            childrenWithProgress.reduce((sum, c) => sum + c.juzSelesai, 0) /
            totalAnak
          ).toFixed(1)
        : "0.0";

    const maxJuzChild = childrenWithProgress.reduce(
      (max, c) => (c.juzSelesai > max.juzSelesai ? c : max),
      { juzSelesai: 0, nama: "-" }
    );

    // Hafalan bulan ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let halamanBulanIni = 0;

    for (const child of santriList) {
      const hafalanBulanIni = child.history.filter(
        (h) => new Date(h.tanggal) >= startOfMonth
      );
      halamanBulanIni += hafalanBulanIni.reduce((sum, h) => {
        const halAwal = h.halaman_awal || 0;
        const halAkhir = h.halaman_akhir || halAwal;
        return sum + (halAkhir - halAwal + 1);
      }, 0);
    }

    // ========================================
    // AKTIVITAS TERBARU (10 terakhir)
    // ========================================
    const recentActivities = [];

    for (const child of santriList) {
      const recentHafalan = child.history.slice(0, 5); // 5 terakhir per anak
      for (const h of recentHafalan) {
        recentActivities.push({
          santriNama: child.nama,
          description: `Menyelesaikan ${h.surah} (Hal ${h.halaman_awal}${
            h.halaman_akhir ? `-${h.halaman_akhir}` : ""
          })`,
          timestamp: new Date(h.tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          date: new Date(h.tanggal),
        });
      }
    }

    // Sort by date desc dan ambil 10 terakhir
    recentActivities.sort((a, b) => b.date - a.date);
    const top10Activities = recentActivities.slice(0, 10).map((a) => ({
      santriNama: a.santriNama,
      description: a.description,
      timestamp: a.timestamp,
    }));

    // ========================================
    // RESPONSE
    // ========================================
    console.log("✅ Data berhasil diproses");

    return NextResponse.json({
      success: true,
      data: {
        children: childrenWithProgress,
        statistics: {
          totalAnak,
          avgJuz: parseFloat(avgJuz),
          maxJuz: maxJuzChild.juzSelesai,
          topSantri: maxJuzChild.nama,
          halamanBulanIni,
        },
        recentActivities: top10Activities,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching walisantri dashboard:", error);
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
