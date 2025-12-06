import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import HistoryHafalanClient from "@/components/HistoryHafalanClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HistoryHafalanPage({ params, searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "GURU") {
    redirect("/login");
  }

  const { id } = params;
  const page = parseInt(searchParams?.page || "1");
  const itemsPerPage = 4; // Jumlah data per halaman

  console.log("Hafalan ID:", id);

  // Ambil data hafalan utama
  const hafalan = await prisma.HafalanSantri.findUnique({
    where: { id: Number(id) },
    include: {
      santri: {
        select: {
          id: true,
          nama: true,
          kelas: true,
        },
      },
      guru: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });

  if (!hafalan) {
    redirect("/guru/dashboard");
  }

  // Cek permission
  if (hafalan.guru_id !== session.user.guru_id) {
    redirect("/guru/hafalan");
  }

  // Hitung total data history
  const totalItems = await prisma.historyHafalan.count({
    where: { hafalan_id: Number(id) },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ambil history dengan pagination
  const history = await prisma.historyHafalan.findMany({
    where: { hafalan_id: Number(id) },
    include: {
      guru: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  return (
    <div className="container mx-auto px-6 mb-20 ">
      <HistoryHafalanClient
        hafalan={JSON.parse(JSON.stringify(hafalan))}
        history={JSON.parse(JSON.stringify(history))}
        pagination={{
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage,
        }}
      />
    </div>
  );
}
