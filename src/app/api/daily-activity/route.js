export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const guruId = searchParams.get("guruId");
    const walisantriId = searchParams.get("walisantriId");
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Build where clause untuk santri
    let santriWhere = {};
    if (guruId) santriWhere.guru_id = parseInt(guruId);
    if (walisantriId) santriWhere.walisantri_id = parseInt(walisantriId);

    // Ambil santri yang sesuai filter
    const santriIds = await prisma.santri.findMany({
      where: santriWhere,
      select: { id: true },
    });

    const santriIdList = santriIds.map((s) => s.id);

    if (santriIdList.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          date,
          ziyadah: 0,
          muroja: 0,
          lulus: 0,
          belumLulus: 0,
          total: 0,
          details: [],
        },
      });
    }

    // Get start and end of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Query hafalan hari ini
    const todayHafalan = await prisma.history.findMany({
      where: {
        santri_id: { in: santriIdList },
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        santri: {
          select: {
            id: true,
            nama: true,
            kelas: true,
          },
        },
      },
      orderBy: {
        tanggal: "desc",
      },
    });

    // Hitung statistik
    const ziyadah = todayHafalan.filter((h) => h.jenis === "ZIYADAH").length;
    const muroja = todayHafalan.filter((h) => h.jenis === "MUROJA'AH").length;
    const lulus = todayHafalan.filter((h) => h.status === "LULUS").length;
    const belumLulus = todayHafalan.filter(
      (h) => h.status === "BELUM_LULUS"
    ).length;

    // Format detail
    const details = todayHafalan.map((h) => ({
      id: h.id,
      santri: {
        id: h.santri.id,
        nama: h.santri.nama,
        kelas: h.santri.kelas,
      },
      surah: h.surah,
      halaman: h.halaman_akhir
        ? `${h.halaman_awal}-${h.halaman_akhir}`
        : `${h.halaman_awal}`,
      ayat: `${h.ayat_mulai}-${h.ayat_selesai}`,
      jenis: h.jenis,
      status: h.status,
      tanggal: h.tanggal,
    }));

    return NextResponse.json({
      success: true,
      data: {
        date,
        ziyadah,
        muroja,
        lulus,
        belumLulus,
        total: todayHafalan.length,
        details,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching daily activity:", error);
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
