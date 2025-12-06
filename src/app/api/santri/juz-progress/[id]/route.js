// pages/api/santri/[id]/juz-progress.js
import prisma from "@/lib/prisma";
import {
  calculateJuzProgress,
  getJuzStatistics,
} from "../../../../../utils/juzcalculation";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    // Ambil data santri
    const santri = await prisma.santri.findUnique({
      where: { id: parseInt(id) },
      include: {
        walisantri: {
          include: {
            user: true,
          },
        },
        guru: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!santri) {
      return res.status(404).json({ message: "Santri tidak ditemukan" });
    }

    // Ambil semua hafalan santri yang LULUS dan ZIYADAH
    const hafalanList = await prisma.HafalanSantri.findMany({
      where: {
        santri_id: parseInt(id),
        status: "LULUS",
        jenis: "ZIYADAH",
      },

      orderBy: {
        tanggal: "asc",
      },
    });

    // Hitung progress juz
    const juzProgress = calculateJuzProgress(hafalanList);
    const juzStatistics = getJuzStatistics(hafalanList);

    // Response
    return res.status(200).json({
      success: true,
      data: {
        santri: {
          id: santri.id,
          nama: santri.nama,
          kelas: santri.kelas,
          guru: santri.guru?.nama,
          walisantri: santri.walisantri?.nama,
        },
        progress: {
          juzSelesai: juzProgress.juzCount,
          totalJuz: 30,
          persenTotal: juzProgress.percentageTotal,
          totalHalaman: juzProgress.totalHalaman,
          dariTotalHalaman: juzProgress.totalPages,
          juzYangSelesai: juzProgress.completedJuz,
        },
        statistics: juzStatistics,
        detailJuz: juzProgress.progress,
        hafalanTerakhir: juzProgress.lastHafalan,
      },
    });
  } catch (error) {
    console.error("Error fetching juz progress:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
}
