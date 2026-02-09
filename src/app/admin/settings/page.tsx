'use client'

import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const [config, setConfig] = useState({
    cafeName: "",
    primaryColor: "#2563eb",
    logo: "",
    address: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then(res => res.json()).then(setConfig);
  }, []);

  // Handle Upload Logo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setConfig(prev => ({ ...prev, logo: data.url }));
      }
    } catch (err) {
      alert("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify(config)
    });
    alert("Pengaturan Berhasil Disimpan!");
    setLoading(false);
    window.location.reload(); // Reload agar warna tema terupdate
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Konfigurasi Cafe</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
            {config.logo ? (
              <Image src={config.logo} alt="Logo" fill className="object-cover" />
            ) : (
              <span className="text-xs text-gray-400">No Logo</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo (Struk & Web)</label>
            <label className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 w-fit">
              <Upload size={16} />
              {uploading ? "Mengupload..." : "Pilih Gambar"}
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Cafe</label>
          <input 
            type="text" 
            value={config.cafeName}
            onChange={(e) => setConfig({...config, cafeName: e.target.value})}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Warna Tema Website</label>
          <div className="flex gap-4 items-center border p-2 rounded-xl">
            <input 
              type="color" 
              value={config.primaryColor}
              onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
              className="h-10 w-16 cursor-pointer rounded"
            />
            <span className="font-mono text-gray-600 uppercase">{config.primaryColor}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp</label>
            <input type="text" value={config.phone || ""} onChange={(e) => setConfig({...config, phone: e.target.value})} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Singkat</label>
            <input type="text" value={config.address || ""} onChange={(e) => setConfig({...config, address: e.target.value})} className="w-full p-3 border rounded-xl" />
          </div>
        </div>

        <button 
          disabled={loading} type="submit" 
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Save size={20} />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}