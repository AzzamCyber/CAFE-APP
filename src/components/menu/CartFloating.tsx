'use client'

import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/lib/utils';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import Link from 'next/link'; // <--- Tambah ini
import { useEffect, useState } from 'react';

export default function CartFloating() {
  const { items, total } = useCart();
  const [mounted, setMounted] = useState(false);

  // Mencegah error hydration (beda server vs client)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50 bg-gradient-to-t from-white via-white to-transparent pb-6">
      <div className="max-w-md mx-auto">
        {/* Ganti button jadi Link ke /cart */}
        <Link 
          href="/cart"
          className="w-full bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between active:scale-98 transition-transform cursor-pointer border border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <ShoppingBag size={24} className="text-yellow-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-medium">Total Pesanan</p>
              <p className="font-bold text-lg leading-none">
                {items.reduce((acc, item) => acc + item.quantity, 0)} Item
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-lg">
              {formatRupiah(total())}
            </span>
            <ChevronRight className="animate-pulse" />
          </div>
        </Link>
      </div>
    </div>
  );
}