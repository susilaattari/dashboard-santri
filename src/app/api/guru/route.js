import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =====================
// GET: Ambil semua Guru
// =====================
export async function GET() {
  try {
    const gurus = await prisma.guru.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, data: gurus }, { status: 200 });
  } catch (error) {
    console.error("Error GET guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data guru" },
      { status: 500 }
    );
  }
}

// =====================
// POST: Tambah Guru
// =====================
export async function POST(req) {
  try {
    const body = await req.json();
    const { nama } = body;

    if (!nama) {
      return NextResponse.json(
        { success: false, message: "Nama wajib diisi" },
        { status: 400 }
      );
    }

    const guru = await prisma.guru.create({
      data: {
        nama,
      },
    });

    return NextResponse.json({ success: true, data: guru }, { status: 201 });
  } catch (error) {
    console.error("Error POST guru:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah guru" },
      { status: 500 }
    );
  }
}
