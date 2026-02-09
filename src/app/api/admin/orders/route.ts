import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
    include: {
      items: {
        include: { product: true }
      }
    }
  });
  
  return NextResponse.json(orders);
}

// Untuk Update Status (PATCH)
export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  
  await prisma.order.update({
    where: { id },
    data: { status }
  });

  return NextResponse.json({ success: true });
}