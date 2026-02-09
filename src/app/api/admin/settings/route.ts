import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  let setting = await prisma.setting.findUnique({ where: { id: "config" } });
  // Jika belum ada, buat default
  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "config", cafeName: "Cafe Senja", primaryColor: "#2563eb" }
    });
  }
  return NextResponse.json(setting);
}

export async function POST(request: Request) {
  const body = await request.json();
  const setting = await prisma.setting.upsert({
    where: { id: "config" },
    update: { ...body },
    create: { id: "config", ...body }
  });
  return NextResponse.json(setting);
}