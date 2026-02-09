import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Cek password (Sederhana dulu, belum hash bcrypt demi kemudahan tutorial)
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "Email atau Password salah" }, { status: 401 });
    }

    // Set Cookie manual agar dianggap login
    const cookieStore = await cookies();
    cookieStore.set("admin_session", user.id, { path: "/" });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}