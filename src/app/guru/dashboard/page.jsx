import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import TambahHafalanForm from "@/components/layoutComponents/TambahHafalanForm";
import prisma from "@/lib/prisma";

export default async function GuruDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  if (session.user.role == "WALISANTRI") {
    redirect("/walisantri/dashboard");
  }
  // Ambil semua santri untuk dropdown
  const santriList = await prisma.santri.findMany({
    where: {
      guru_id: session.user.guru_id,
    },
    include: {
      walisantri: true,
    },
    orderBy: {
      nama: "asc",
    },
  });

  return (
    <main className="w-full px-4 py-6">
      <div className="bg-white rounded-lg shadow p-6">
        <TambahHafalanForm santriList={santriList} />
      </div>
    </main>
  );
}
