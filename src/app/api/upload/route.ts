import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises"; // <--- Tambah 'mkdir' di sini
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Bersihkan nama file dari spasi dan karakter aneh
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    
    // Tentukan lokasi folder public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // ✅ FITUR BARU: Buat folder otomatis jika belum ada
    await mkdir(uploadDir, { recursive: true });

    // Simpan file
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}` 
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}