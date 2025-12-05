export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id } = params;

    // Cek apakah hafalan ada
    const hafalan = await prisma.hafalanSantri.findUnique({
      where: { id: Number(id) },
    });

    if (!hafalan) {
      return new Response(
        JSON.stringify({ error: "Data hafalan tidak ditemukan" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Cek permission
    if (session.user.role === "GURU") {
      if (hafalan.guru_id !== session.user.guru_id) {
        return new Response(
          JSON.stringify({ error: "Forbidden - Bukan data Anda" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else if (session.user.role === "WALISANTRI") {
      const santri = await prisma.santri.findUnique({
        where: { id: hafalan.santri_id },
      });

      if (santri.walisantri_id !== session.user.walisantri_id) {
        return new Response(
          JSON.stringify({ error: "Forbidden - Bukan santri Anda" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Ambil history
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
    });

    return new Response(JSON.stringify(history), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return new Response(
      JSON.stringify({
        error: "Terjadi kesalahan",
        detail:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
