import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, image, categoryId, description } = body;

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      image,
      categoryId,
      description,
      isAvailable: true
    }
  });
  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}