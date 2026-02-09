'use client'

import { useEffect, useState, useRef } from 'react';
import { ChefHat, Bell, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QueuePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [readyOrders, setReadyOrders] = useState<any[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<any[]>([]);
  const [time, setTime] = useState(new Date());
  
  // Ref untuk Audio & Logic
  const prevReadyCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update Jam Realtime
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      
      // Filter Logic
      const preparing = data.filter((o: any) => o.status === 'PENDING');
      const ready = data.filter((o: any) => o.status === 'COMPLETED').slice(0, 6); // Ambil 6 terakhir

      setPreparingOrders(preparing);
      setReadyOrders(ready);

      // 🔔 Sound Effect Logic
      if (ready.length > prevReadyCount.current) {
        playSound();
      }
      prevReadyCount.current = ready.length;

    } catch (err) {
      console.error(err);
    }
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log("User interaction needed"));
    }
  };

  useEffect(() => {
    // Audio Notification (Suara 'Ting' Bandara/Mall)
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden relative selection:bg-none">
      
      {/* BACKGROUND MESH GRADIENT (Agar tidak flat hitam) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
            <ChefHat size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-widest text-white uppercase leading-none">Status Pesanan</h1>
            <p className="text-sm text-gray-400 font-medium tracking-wide mt-1">Silakan ambil pesanan saat nomor Anda muncul</p>
          </div>
        </div>
        
        {/* JAM DIGITAL MODERN */}
        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
          <Clock className="text-blue-400 animate-pulse" size={20} />
          <span className="text-2xl font-mono font-bold tracking-widest text-blue-100">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-10 grid grid-cols-12 gap-8 p-8 h-[calc(100vh-180px)]">
        
        {/* KOLOM KIRI: SEDANG DISIAPKAN (40% Width) */}
        <div className="col-span-5 bg-white/5 rounded-[2.5rem] border border-white/10 p-6 backdrop-blur-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
            <h2 className="text-2xl font-bold text-yellow-400 uppercase tracking-widest">Sedang Disiapkan</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 content-start overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {preparingOrders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1 block tracking-wider">Meja</span>
                  <span className="text-5xl font-black text-white font-mono">{order.tableNo}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {preparingOrders.length === 0 && (
              <div className="col-span-2 text-center text-gray-600 py-20">
                <p className="text-lg">Tidak ada antrian di dapur</p>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: SIAP DIAMBIL (60% Width - HIGHLIGHT) */}
        <div className="col-span-7 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-[2.5rem] border border-green-500/30 p-8 backdrop-blur-md flex flex-col shadow-2xl shadow-green-900/20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Bell className="text-green-400 animate-swing" size={40} />
            <h2 className="text-4xl font-black text-white uppercase tracking-[0.2em] drop-shadow-lg">
              SIAP DIAMBIL
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6 flex-1 content-start">
            <AnimatePresence>
              {readyOrders.map((order) => (
                <motion.div 
                  key={order.id}
                  layout
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-green-500 text-black p-8 rounded-3xl text-center shadow-lg shadow-green-500/40 relative overflow-hidden group"
                >
                  {/* Shine Effect */}
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out"></div>
                  
                  <span className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 block">Nomor Meja</span>
                  <span className="text-7xl font-black font-mono tracking-tighter">{order.tableNo}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {readyOrders.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center h-64 text-green-200/50">
                <Bell size={64} className="mb-4 opacity-50" />
                <p className="text-2xl font-light">Menunggu pesanan selesai...</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* FOOTER MARQUEE */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md py-3 border-t border-white/10 z-20">
        <div className="overflow-hidden whitespace-nowrap">
          <motion.div 
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="inline-block text-lg font-mono text-gray-300 tracking-wider"
          >
            Silakan ambil pesanan Anda di kasir. Mohon tunjukkan struk pembayaran. Terima Kasih telah menunggu!  ☕  Selamat Menikmati!
          </motion.div>
        </div>
      </div>

    </div>
  );
}