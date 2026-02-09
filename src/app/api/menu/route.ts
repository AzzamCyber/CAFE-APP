import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: { isAvailable: true }, // Hanya ambil produk yang tersedia
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil menu" }, { status: 500 });
  }
}