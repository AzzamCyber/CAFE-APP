import { Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma"; // Direct DB access karena ini Server Component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cafe App",
  description: "Aplikasi Cafe Modern",
  manifest: "/manifest.json",
};

// Ambil setting dari DB
async function getSettings() {
  let setting = await prisma.setting.findUnique({ where: { id: "config" } });
  // Default fallback
  if (!setting) {
    setting = {
      id: "config", cafeName: "Cafe Senja", description: "", logo: null,
      primaryColor: "#2563eb", secondaryColor: "#1e293b",
      address: "", phone: "", updatedAt: new Date()
    };
  }
  return setting;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="id">
      <body 
        className={inter.className}
        // INJECT WARNA DINAMIS DI SINI
        style={{
          '--primary': settings.primaryColor,
          '--secondary': settings.secondaryColor,
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}