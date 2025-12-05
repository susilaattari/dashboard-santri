// app/api/walisantri/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const walisantri = await prisma.walisantri.findMany({
      select: { id: true, nama: true, no_hp: true },
      orderBy: { id: "desc" },
    });
    return new Response(JSON.stringify({ success: true, data: walisantri }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Gagal mengambil data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
