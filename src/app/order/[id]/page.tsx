import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { CheckCircle2, Home } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { id } = await params;

  // Ambil data order dari database
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header Sukses */}
        <div className="bg-green-500 p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="font-bold text-2xl mb-1">Pesanan Berhasil!</h1>
          <p className="opacity-90">Dapur sedang menyiapkan menumu</p>
        </div>

        {/* Detail Struk */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
            <span>ID Pesanan</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">#{order.id.slice(-6).toUpperCase()}</span>
          </div>

          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} x {formatRupiah(item.price)}</p>
                </div>
                <span className="font-medium">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-200 py-4 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">{formatRupiah(order.total)}</span>
            </div>
          </div>

          {/* Status Tracker Sederhana */}
          <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <p className="text-sm text-blue-700 font-medium">Status: {order.status}</p>
          </div>

          <Link href="/" className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">
            <Home size={18} />
            Kembali ke Menu
          </Link>
        </div>
      </div>
    </main>
  );
}