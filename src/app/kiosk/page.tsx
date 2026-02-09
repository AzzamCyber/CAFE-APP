'use client'

import { useEffect, useState, useRef } from 'react';
import { useCart } from '@/hooks/useCart'; // Pastikan path hook ini benar
import { formatRupiah } from '@/lib/utils';
import { ShoppingBag, ChevronLeft, Trash2, CreditCard, ChefHat, User, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// --- KOMPONEN VIRTUAL NUMPAD (Agar mudah input angka di touchscreen) ---
const VirtualNumpad = ({ onInput, onDelete }: { onInput: (v: string) => void, onDelete: () => void }) => (
  <div className="grid grid-cols-3 gap-2 mt-2">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
      <button key={num} onClick={() => onInput(num.toString())} className="py-4 bg-gray-100 rounded-xl text-xl font-bold active:bg-gray-200">
        {num}
      </button>
    ))}
    <button className="py-4 bg-gray-100 rounded-xl text-xl font-bold" disabled></button>
    <button onClick={() => onInput('0')} className="py-4 bg-gray-100 rounded-xl text-xl font-bold active:bg-gray-200">0</button>
    <button onClick={onDelete} className="py-4 bg-red-100 text-red-600 rounded-xl flex items-center justify-center active:bg-red-200">
      <ChevronLeft />
    </button>
  </div>
);

export default function KioskPage() {
  const router = useRouter();
  const { items, addItem, removeItem, total, clearCart } = useCart();
  
  // State Halaman
  const [view, setView] = useState<'WELCOME' | 'MENU' | 'CHECKOUT' | 'SUCCESS'>('WELCOME');
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  // State Checkout
  const [customerName, setCustomerName] = useState("Pelanggan Kiosk");
  const [tableNo, setTableNo] = useState("");
  const [activeInput, setActiveInput] = useState<'TABLE'>('TABLE'); // Fokus input keypad
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto Reset Timer (Jika ditinggal pelanggan)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (view !== 'WELCOME') {
        setView('WELCOME');
        clearCart();
        setTableNo("");
      }
    }, 60000); // 60 Detik idle = Reset
  };

  useEffect(() => {
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    return () => {
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [view]);

  // Load Data
  useEffect(() => {
    const init = async () => {
      const [resCat, resSet] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/admin/settings')
      ]);
      const cats = await resCat.json();
      const sets = await resSet.json();
      setCategories(cats);
      if (cats.length > 0) setActiveCategory(cats[0].name);
      setSettings(sets);
    };
    init();
  }, []);

  // Filter Produk
  const currentCategory = categories.find(c => c.name === activeCategory);

  // Handler Checkout
  const handleCheckout = async () => {
    if (!tableNo) return alert("Mohon masukkan nomor meja!");
    setIsProcessing(true);

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: `Kiosk - ${customerName}`,
          tableNo: tableNo,
          items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price }))
        })
      });
      setView('SUCCESS');
      setTimeout(() => {
        clearCart();
        setTableNo("");
        setView('WELCOME');
      }, 5000); // Tampil sukses 5 detik lalu reset
    } catch (e) {
      alert("Gagal memproses pesanan");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeypadInput = (val: string) => {
    if (activeInput === 'TABLE') setTableNo(prev => (prev + val).slice(0, 3));
  };
  
  const handleKeypadDelete = () => {
    if (activeInput === 'TABLE') setTableNo(prev => prev.slice(0, -1));
  };

  // --- VIEW 1: WELCOME SCREEN (SCREENSAVER) ---
  if (view === 'WELCOME') {
    return (
      <div 
        onClick={() => setView('MENU')}
        className="h-screen w-screen bg-black text-white relative overflow-hidden cursor-pointer"
      >
        {/* Background Image / Video Loop */}
        <div className="absolute inset-0 opacity-60">
           <Image 
             src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80" 
             fill 
             className="object-cover" 
             alt="Background"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-10 animate-pulse">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full mb-8 border border-white/20">
            <ChefHat size={80} />
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tight">PESAN DI SINI</h1>
          <p className="text-2xl font-light opacity-90">Sentuh layar untuk mulai memesan</p>
          
          <div className="mt-12 bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg shadow-orange-500/40 animate-bounce">
            Mulai Pesanan
          </div>
        </div>
        
        {/* Branding Footer */}
        <div className="absolute bottom-8 left-0 w-full text-center opacity-50 text-sm">
          Powered by {settings?.cafeName || 'Cafe System'}
        </div>
      </div>
    );
  }

  // --- VIEW 4: SUCCESS ---
  if (view === 'SUCCESS') {
    return (
      <div className="h-screen bg-green-600 flex flex-col items-center justify-center text-white text-center p-8">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="bg-white text-green-600 p-8 rounded-full mb-8 shadow-2xl"
        >
          <ChefHat size={100} />
        </motion.div>
        <h1 className="text-5xl font-black mb-4">PESANAN DITERIMA!</h1>
        <p className="text-2xl opacity-90 mb-8">Mohon tunggu di meja <span className="font-bold underline">No. {tableNo}</span></p>
        <p className="animate-pulse text-sm mt-10">Layar akan kembali otomatis...</p>
      </div>
    );
  }

  // --- VIEW 2 & 3: MENU & CHECKOUT (MAIN INTERFACE) ---
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
      
      {/* SIDEBAR KATEGORI (KIRI) */}
      <aside className="w-1/4 bg-white border-r border-gray-200 flex flex-col h-full z-20 shadow-xl">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => setView('WELCOME')} className="p-2 bg-gray-100 rounded-lg">
            <ChevronLeft />
          </button>
          <h2 className="font-bold text-xl text-gray-800">Menu</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`w-full p-6 text-left rounded-2xl transition-all text-lg font-bold flex justify-between items-center ${
                activeCategory === cat.name 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
              {activeCategory === cat.name && <div className="w-3 h-3 bg-white rounded-full" />}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT (TENGAH) */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-100 p-6 relative">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
          {currentCategory?.products.map((product: any) => {
            const qty = items.find(i => i.id === product.id)?.quantity || 0;
            return (
              <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm flex flex-col h-full border border-gray-100 active:scale-95 transition-transform">
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-gray-200">
                  {product.image && <Image src={product.image} fill className="object-cover" alt={product.name} />}
                </div>
                <h3 className="font-bold text-xl text-gray-800 leading-tight mb-1">{product.name}</h3>
                <p className="text-blue-600 font-bold text-lg mb-4">{formatRupiah(product.price)}</p>
                
                <div className="mt-auto">
                  {qty === 0 ? (
                    <button 
                      onClick={() => addItem({...product, quantity: 1})}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black"
                    >
                      TAMBAH
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 rounded-xl p-2">
                      <button onClick={() => removeItem(product.id)} className="w-12 h-12 bg-white rounded-lg shadow text-xl font-bold text-red-500">-</button>
                      <span className="text-2xl font-bold">{qty}</span>
                      <button onClick={() => addItem({...product, quantity: 1})} className="w-12 h-12 bg-blue-600 text-white rounded-lg shadow text-xl font-bold">+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* CART DRAWER / BOTTOM BAR (KANAN / BAWAH) */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }}
            className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-50 rounded-t-[2rem] border-t border-gray-200"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 relative">
                  <ShoppingBag size={32} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {items.reduce((a,b) => a + b.quantity, 0)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 font-bold uppercase text-sm">Total Pembayaran</p>
                  <p className="text-3xl font-black text-gray-900">{formatRupiah(total())}</p>
                </div>
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={clearCart}
                   className="px-8 py-4 bg-red-100 text-red-600 rounded-2xl font-bold text-lg hover:bg-red-200"
                 >
                   Batal
                 </button>
                 <button 
                   onClick={() => setView('CHECKOUT')}
                   className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 shadow-lg shadow-blue-300 animate-pulse"
                 >
                   BAYAR SEKARANG
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CHECKOUT */}
      {view === 'CHECKOUT' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex h-[80vh]"
          >
            {/* Kiri: Ringkasan */}
            <div className="w-1/2 bg-gray-50 p-8 border-r border-gray-200 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag /> Ringkasan Order
              </h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="font-bold text-lg">{item.name}</p>
                      <p className="text-gray-500">{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                    <p className="font-bold text-lg">{formatRupiah(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-2xl font-black">
                  <span>TOTAL</span>
                  <span className="text-blue-600">{formatRupiah(total())}</span>
                </div>
              </div>
            </div>

            {/* Kanan: Input & Numpad */}
            <div className="w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Detail Pesanan</h2>
                <button onClick={() => setView('MENU')} className="text-gray-400 font-bold hover:text-gray-600">Tutup</button>
              </div>

              {/* Form Input (Readonly, diisi via Numpad) */}
              <div className="space-y-6 flex-1">
                {/* Meja */}
                <div 
                  onClick={() => setActiveInput('TABLE')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-colors ${activeInput === 'TABLE' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <label className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Hash size={16} /> Nomor Meja (Wajib)
                  </label>
                  <div className="text-4xl font-black text-gray-900 h-12 flex items-center">
                    {tableNo || <span className="text-gray-300">00</span>}
                    {activeInput === 'TABLE' && <span className="w-1 h-8 bg-blue-500 ml-2 animate-pulse"/>}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-yellow-50 p-4 rounded-xl text-yellow-800 text-sm flex gap-3 items-center">
                   <CreditCard size={20} />
                   Silakan lakukan pembayaran di kasir setelah struk keluar.
                </div>
              </div>

              {/* Virtual Keypad */}
              <div>
                <VirtualNumpad onInput={handleKeypadInput} onDelete={handleKeypadDelete} />
                
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full mt-6 py-5 bg-green-600 text-white rounded-2xl font-black text-xl hover:bg-green-700 shadow-xl shadow-green-200 active:scale-95 transition-all disabled:bg-gray-400"
                >
                  {isProcessing ? 'MEMPROSES...' : 'CETAK STRUK ORDER'}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}