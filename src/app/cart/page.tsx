'use client'

import { useCart } from '@/hooks/useCart';
import { formatRupiah } from '@/lib/utils';
import { ArrowLeft, Trash2, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, addItem, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleCheckout = async () => {
    if (!customerName) return alert('Nama pemesan wajib diisi!');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerName,
          tableNo: tableNo || 'Takeaway',
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await res.json();
      
      if (data.success) {
        clearCart(); // Kosongkan keranjang
        router.push(`/order/${data.orderId}`); // Pindah ke halaman sukses
      } else {
        alert('Gagal membuat pesanan');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <h2 className="text-xl font-bold text-gray-800">Keranjang Kosong</h2>
        <p className="text-gray-500 mb-6">Belum ada menu yang dipilih.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">
          Pesan Menu Dulu
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-bold text-lg">Konfirmasi Pesanan</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* List Item */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-blue-600 font-medium text-sm">
                  {formatRupiah(item.price)}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={() => removeItem(item.id)} className="text-red-500 bg-red-50 p-2 rounded-lg">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center bg-gray-100 rounded-lg">
                   {/* Logic sederhana minus: hapus jika 1, kurangi jika >1 */}
                  <span className="font-bold px-4">{item.quantity}</span>
                  <button onClick={() => addItem({...item, quantity: 1})} className="p-2 bg-white rounded-md shadow-sm m-1">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Data Diri */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800">Data Pemesan</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nama Pemesan (Wajib)</label>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Budi"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nomor Meja (Opsional)</label>
            <input 
              type="text" 
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              placeholder="Contoh: 12"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-blue-600"
            />
          </div>
        </div>

        {/* Ringkasan Pembayaran */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{formatRupiah(total())}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Pajak & Layanan (0%)</span>
            <span>Rp 0</span>
          </div>
          <div className="border-t border-dashed border-gray-300 my-2"></div>
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total Bayar</span>
            <span>{formatRupiah(total())}</span>
          </div>
        </div>
      </div>

      {/* Button Checkout */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100">
        <button 
          onClick={handleCheckout}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-400"
        >
          {isSubmitting ? 'Memproses...' : `Bayar Sekarang • ${formatRupiah(total())}`}
        </button>
      </div>
    </main>
  );
}