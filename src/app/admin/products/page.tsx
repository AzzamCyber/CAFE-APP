'use client'

import { useEffect, useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // State untuk Kategori
  const [form, setForm] = useState({ name: '', price: '', image: '', categoryId: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Data Produk & Kategori
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resProducts, resCat] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/categories') // <--- FETCH KATEGORI ASLI
        ]);
        
        const dataProducts = await resProducts.json();
        const dataCat = await resCat.json();

        setProducts(dataProducts);
        setCategories(dataCat);
      } catch (err) {
        console.error("Gagal load data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if(data.url) setForm({ ...form, image: data.url });
    } catch (e) {
      alert("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.categoryId) return alert("Pilih kategori dulu!");

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) throw new Error("Gagal simpan");
      
      alert('Produk berhasil ditambahkan!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan produk. Pastikan semua data terisi.');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Hapus produk ini?')) return;
    await fetch('/api/admin/products', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Menu</h1>

      {/* FORM TAMBAH PRODUK */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
        <h3 className="font-bold mb-4 text-gray-800">Tambah Menu Baru</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Menu</label>
              <input required placeholder="Contoh: Kopi Susu" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors" 
                onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Harga</label>
              <input required type="number" placeholder="Contoh: 15000" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors" 
                onChange={e => setForm({...form, price: e.target.value})} />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kategori</label>
              {/* DROPDOWN DINAMIS YANG SUDAH DIPERBAIKI */}
              <select 
                className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors" 
                onChange={e => setForm({...form, categoryId: e.target.value})} 
                required
                defaultValue=""
              >
                <option value="" disabled>-- Pilih Kategori --</option>
                {categories.length > 0 ? (
                  categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading Kategori...</option>
                )}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Foto Produk</label>
            <div className="flex flex-col gap-4">
              <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden relative border border-dashed border-gray-300 flex items-center justify-center group">
                {form.image ? (
                  <Image src={form.image} fill className="object-cover" alt="preview"/>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-gray-300 mb-2" size={32}/>
                    <p className="text-xs text-gray-400">Preview Gambar</p>
                  </div>
                )}
              </div>
              
              <label className={`cursor-pointer w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${uploading ? 'bg-gray-200 text-gray-500' : 'bg-gray-900 text-white hover:bg-black'}`}>
                <Upload size={16} /> 
                {uploading ? 'Mengupload...' : 'Pilih File Gambar'}
                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={uploading} />
              </label>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex justify-center gap-2 shadow-lg shadow-blue-200 mt-2">
              <Plus size={20} /> Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* LIST PRODUK */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-48 bg-gray-100">
              {product.image ? (
                <Image src={product.image} fill className="object-cover" alt={product.name}/>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">No Image</div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                {product.category?.name || 'Uncategorized'}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
              <div className="flex justify-between items-center mt-2">
                <p className="text-blue-600 font-bold">{formatRupiah(product.price)}</p>
                <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}