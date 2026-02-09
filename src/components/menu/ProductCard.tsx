'use client'

import Image from 'next/image';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, removeItem } = useCart();
  
  // Cek apakah produk ini sudah ada di keranjang
  const quantity = items.find((i) => i.id === product.id)?.quantity || 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      
      {/* Area Gambar dengan Efek Zoom */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            No Image
          </div>
        )}
        
        {/* Badge Quantity (Muncul jika sudah dipesan) */}
        {quantity > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {quantity}x di keranjang
          </div>
        )}
      </div>

      {/* Info Produk */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center mt-3">
          <span className="font-extrabold text-blue-600 text-sm">
            {formatRupiah(product.price)}
          </span>
          
          {/* Tombol Add Dinamis */}
          {quantity === 0 ? (
            <button 
              onClick={() => addItem({ ...product, quantity: 1 })}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md active:scale-95 transition-all"
            >
              <Plus size={18} />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button 
                onClick={() => removeItem(product.id)}
                className="bg-white text-red-500 p-1.5 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-sm min-w-[10px] text-center">{quantity}</span>
              <button 
                onClick={() => addItem({ ...product, quantity: 1 })}
                className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm hover:bg-blue-700"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}