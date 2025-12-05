// app/walisantri/dashboard/page.js (Server Component)

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { calculateJuzProgressEnhanced } from "../../../utils/juzcalculation";
import WalisantriDashboard from "./WalisantriDashboard";

export default async function WalisantriDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "WALISANTRI") {
    redirect("/login");
  }

  // Ambil data walisantri
  const walisantri = await prisma.walisantri.findUnique({
    where: { user_id: session.user.id },
  });

  if (!walisantri) {
    redirect("/login");
  }

  // Ambil data santri dengan hafalan dan history
  const santriList = await prisma.santri.findMany({
    where: {
      walisantri_id: walisantri.id,
    },
    include: {
      walisantri: true,
      guru: true,
      hafalan: {
        where: {
          status: "LULUS",
        },
        include: {
          guru: true,
          history: {
            orderBy: {
              tanggal: "desc",
            },
          },
        },
        orderBy: {
          tanggal: "desc",
        },
      },
      history: {
        where: {
          status: "LULUS",
          jenis: "ZIYADAH",
        },
        orderBy: {
          tanggal: "asc",
        },
      },
    },
    orderBy: {
      nama: "asc",
    },
  });

  // Proses setiap santri dengan kalkulasi juz
  const santriWithJuzProgress = santriList.map((santri) => {
    // Hitung progress juz dari history yang LULUS & ZIYADAH
    const juzProgress = calculateJuzProgressEnhanced(santri.history);

    return {
      id: santri.id,
      nama: santri.nama,
      kelas: santri.kelas,
      tanggal_lahir: santri.tanggal_lahir,
      walisantri: santri.walisantri?.nama,
      guru: santri.guru?.nama,

      // Data hafalan untuk ditampilkan di card
      hafalan: santri.hafalan.map((h) => ({
        id: h.id,
        surah: h.surah,
        ayat_mulai: h.ayat_mulai,
        ayat_selesai: h.ayat_selesai,
        halaman_awal: h.halaman_awal,
        halaman_akhir: h.halaman_akhir,
        juz: h.juz,
        tanggal: h.tanggal,
        status: h.status,
        jenis: h.jenis,
        catatan: h.catatan,
        guru: h.guru
          ? {
              nama: h.guru.nama,
            }
          : null,
        history: h.history.map((hist) => ({
          id: hist.id,
          tanggal: hist.tanggal,
          status: hist.status,
          surah: hist.surah,
          ayat_mulai: hist.ayat_mulai,
          ayat_selesai: hist.ayat_selesai,
          halaman_awal: hist.halaman_awal,
          halaman_akhir: hist.halaman_akhir,
          juz: hist.juz,
          catatan: hist.catatan,
        })),
      })),

      // Progress juz dari utils calculation
      juzProgress: {
        summary: juzProgress.summary,
        completedJuz: juzProgress.completedJuz,
        inProgressJuz: juzProgress.inProgressJuz,
        detailPerJuz: juzProgress.detailPerJuz,
      },
    };
  });

  return (
    <WalisantriDashboard
      initialData={{
        santri: santriWithJuzProgress,
      }}
    />
  );
}
