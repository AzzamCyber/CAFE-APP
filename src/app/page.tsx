'use client'

import { useEffect, useState } from 'react';
import ProductCard from '@/components/menu/ProductCard';
import CartFloating from '@/components/menu/CartFloating';
import { Search, MapPin, Phone, Instagram, Clock, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// --- KOMPONEN FOOTER DINAMIS ---
const Footer = ({ settings }: { settings: any }) => (
  <footer className="bg-secondary text-white pt-16 pb-8 px-6 mt-12 rounded-t-[2.5rem] shadow-inner shadow-black/20">
    <div className="max-w-md mx-auto text-center">
      {/* Logo di Footer */}
      {settings?.logo && (
        <div className="w-16 h-16 mx-auto mb-4 relative rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
          <Image src={settings.logo} alt="Logo Footer" fill className="object-cover" />
        </div>
      )}

      <h3 className="font-black text-2xl tracking-tight mb-2">
        {settings?.cafeName || 'Cafe Senja'}
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 leading-relaxed px-4">
        {settings?.description || 'Nikmati kopi terbaik dengan suasana yang menenangkan.'}
      </p>

      {/* Info Kontak Dinamis */}
      <div className="flex flex-col gap-3 text-sm text-gray-300 mb-8 items-center">
        {settings?.address && (
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
            <MapPin size={14} className="text-blue-400" /> 
            <span>{settings.address}</span>
          </div>
        )}
        {settings?.phone && (
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
            <Phone size={14} className="text-green-400" /> 
            <span>{settings.phone}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-700/50 pt-8">
        <p className="text-[10px] text-gray-500 tracking-widest uppercase font-semibold">
          DESIGN & DEVELOPER BY <br />
          <span className="text-white text-xs mt-1 inline-block font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NATAKENSHI DEVELOPER
          </span>
        </p>
      </div>
    </div>
  </footer>
);

// --- KOMPONEN LOADING SKELETON ---
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3].map(i => <div key={i} className="h-10 w-24 bg-gray-200 rounded-full shrink-0" />)}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-gray-100 rounded-2xl h-56 w-full" />
      ))}
    </div>
  </div>
);

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSettings, resMenu] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch('/api/menu')
        ]);
        
        const dataSettings = await resSettings.json();
        const dataMenu = await resMenu.json();

        setSettings(dataSettings);
        setCategories(dataMenu);
      } catch (error) {
        console.error("Gagal load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Search Logic
  const filteredCategories = categories.map(cat => ({
    ...cat,
    products: cat.products.filter((p: any) => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.products.length > 0);

  // Filter Kategori (Pills)
  const displayCategories = activeCategory === 'all' 
    ? filteredCategories 
    : filteredCategories.filter(cat => cat.name === activeCategory);

  return (
    <main className="min-h-screen bg-[#F8F9FA] font-sans flex flex-col selection:bg-blue-100">
      
      {/* 1. Header Sticky Glassmorphism */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <header className="px-6 py-4 flex justify-between items-center">
          <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="flex flex-col"
          >
            <p className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mb-0.5 flex items-center gap-1">
              <ChefHat size={12} className="text-orange-500" /> 
              Selamat Datang
            </p>
            <h1 className="font-black text-xl text-gray-900 tracking-tight leading-none" style={{ color: settings?.primaryColor }}>
              {settings?.cafeName || 'Loading...'}
            </h1>
          </motion.div>
          
          {/* Logo Header */}
          {settings?.logo && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm relative bg-white"
            >
               <Image src={settings.logo} alt="Logo Header" fill className="object-cover" />
            </motion.div>
          )}
        </header>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="bg-gray-100 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200 shadow-sm border border-transparent focus-within:border-blue-200">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari kopi, snack, makanan..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 font-medium text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-32">
        
        {/* 2. Banner Promo (Hanya muncul jika tidak search) */}
        <AnimatePresence>
          {!searchTerm && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/20 isolate">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                      🔥 HOT PROMO
                    </span>
                  </div>
                  <h2 className="font-black text-2xl mb-1 tracking-tight">Diskon 20%</h2>
                  <p className="text-blue-100 text-xs font-medium max-w-[70%]">
                    Khusus Dine-In hari ini untuk semua menu Coffee Series.
                  </p>
                </div>
                
                {/* Elemen Dekorasi Abstrak */}
                <div className="absolute -right-8 -bottom-12 w-40 h-40 bg-white rounded-full blur-3xl opacity-20"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full blur-3xl opacity-30 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Category Pills (Horizontal Scroll) */}
        {!loading && !searchTerm && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === 'all' 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              Semua Menu
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                    : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* 4. Daftar Menu */}
        <div className="space-y-8 mt-4">
          {loading ? (
            <LoadingSkeleton />
          ) : displayCategories.length > 0 ? (
            displayCategories.map((category, idx) => (
              <motion.section 
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-black text-gray-800 tracking-tight">
                    {category.name}
                  </h2>
                  <div className="h-[2px] flex-1 bg-gray-100 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {category.products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </motion.section>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Menu tidak ditemukan</h3>
              <p className="text-gray-400 text-sm max-w-[200px]">
                Coba cari dengan kata kunci lain
              </p>
            </div>
          )}
        </div>
      </div>

      <CartFloating />
      <Footer settings={settings} />
    </main>
  );
}