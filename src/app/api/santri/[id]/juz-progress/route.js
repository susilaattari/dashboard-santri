import prisma from "@/lib/prisma";
import {
  calculateJuzProgressEnhanced,
  getJuzStatisticsEnhanced,
} from "@/utils/juzCalculation"; // Pastikan nama file sesuai

export async function GET(req, { params }) {
  const { id } = params;

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
      return Response.json(
        { message: "Santri tidak ditemukan" },
        { status: 404 }
      );
    }

    // Ambil hafalan LULUS dan ZIYADAH dari HistoryHafalan
    const hafalanList = await prisma.historyHafalan.findMany({
      where: {
        santri_id: parseInt(id),
        status: "LULUS",
        jenis: "ZIYADAH",
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    // Gunakan fungsi enhanced
    const juzProgress = calculateJuzProgressEnhanced(hafalanList);
    const juzStatistics = getJuzStatisticsEnhanced(hafalanList);

    return Response.json(
      {
        success: true,
        data: {
          santri: {
            id: santri.id,
            nama: santri.nama,
            kelas: santri.kelas,
            tanggal_lahir: santri.tanggal_lahir,
            guru: santri.guru?.nama || "Belum ditentukan",
            walisantri: santri.walisantri?.nama,
          },

          // Summary Progress
          summary: {
            totalJuz: juzProgress.summary.totalJuz,
            juzSelesai: juzProgress.summary.completedJuz,
            juzProgress: juzProgress.summary.inProgressJuz,
            juzBelumMulai: juzProgress.summary.notStartedJuz,
            totalHalaman: juzProgress.summary.totalHalamanDihafal,
            dariTotalHalaman: juzProgress.summary.totalHalamanAlQuran,
            persenTotal: juzProgress.summary.percentageTotal,
          },

          // Juz yang sudah selesai
          juzYangSelesai: juzProgress.completedJuz,

          // Juz yang sedang dalam progress
          juzDalamProgress: juzProgress.inProgressJuz,

          // Detail per Juz
          detailPerJuz: juzProgress.detailPerJuz,

          // Statistik lengkap
          statistics: juzStatistics,

          // Hafalan terakhir
          hafalanTerakhir: juzProgress.lastHafalan
            ? {
                tanggal: juzProgress.lastHafalan.tanggal,
                surah: juzProgress.lastHafalan.surah,
                halaman: `${juzProgress.lastHafalan.halaman_awal}${
                  juzProgress.lastHafalan.halaman_akhir &&
                  juzProgress.lastHafalan.halaman_akhir !==
                    juzProgress.lastHafalan.halaman_awal
                    ? ` - ${juzProgress.lastHafalan.halaman_akhir}`
                    : ""
                }`,
                ayat: `${juzProgress.lastHafalan.ayat_mulai} - ${juzProgress.lastHafalan.ayat_selesai}`,
                jenis: juzProgress.lastHafalan.jenis,
                status: juzProgress.lastHafalan.status,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching juz progress:", error);
    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
