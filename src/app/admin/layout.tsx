'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, History, Settings, LogOut, UtensilsCrossed, 
  Coffee, ChefHat 
} from "lucide-react";
import { Toaster } from 'react-hot-toast'; // <--- IMPORT INI

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // ... (Kode logic router & logout biarkan sama seperti sebelumnya) ...
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Dapur (Realtime)", href: "/admin/kitchen", icon: ChefHat },
    { name: "Manajemen Menu", href: "/admin/products", icon: Coffee },
    { name: "Riwayat Order", href: "/admin/history", icon: History },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* --- PASANG TOASTER DISINI AGAR GLOBAL --- */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Sidebar (Sama seperti sebelumnya) */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/50">
            <UtensilsCrossed size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-colors mb-4"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
          <div className="text-center pt-4 border-t border-gray-800/50">
            <p className="text-[10px] text-gray-500 tracking-wider">DESIGN & DEVELOPER BY</p>
            <p className="text-xs font-bold text-gray-300 mt-1">NATAKENSHI DEVELOPER</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
}