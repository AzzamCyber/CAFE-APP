'use client'

import { useEffect, useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { Download, Printer, Search, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    // 1. Ambil Data Order
    fetch('/api/admin/orders').then(res => res.json()).then(setOrders);
    
    // 2. Ambil Pengaturan (Logo, Nama, Alamat)
    fetch('/api/admin/settings').then(res => res.json()).then(setSettings);
  }, []);

  // Filter Search
  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  // 🖨️ FUNGSI PRINT STRUK PRO (58mm Thermal Style)
  const handlePrint = (order: any) => {
    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) return;

    const date = new Date(order.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute:'2-digit'
    });

    const itemsHtml = order.items.map((item: any) => `
      <tr>
        <td style="padding-bottom: 5px;">
          <div style="font-weight:bold;">${item.product.name}</div>
          <div style="font-size: 9px; color: #555;">${item.quantity} x ${formatRupiah(item.price)}</div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          ${formatRupiah(item.price * item.quantity)}
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Struk #${order.id.slice(-4)}</title>
          <style>
            @page { size: 58mm auto; margin: 0; }
            body { 
              font-family: 'Courier New', monospace; 
              width: 58mm; 
              margin: 0 auto; 
              padding: 10px; 
              color: #000;
              font-size: 10px;
              line-height: 1.2;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .logo { 
              width: 40px; 
              height: 40px; 
              object-fit: contain; 
              margin: 0 auto 5px auto; 
              display: block; 
              filter: grayscale(100%); /* Biar tajam di printer thermal */
            }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .header h2 { font-size: 14px; margin: 0 0 2px 0; text-transform: uppercase; }
            .header p { margin: 0; font-size: 9px; }
            table { width: 100%; border-collapse: collapse; }
            .total-row td { font-size: 12px; font-weight: bold; border-top: 1px dashed #000; padding-top: 5px; }
            .footer { margin-top: 15px; font-size: 8px; color: #444; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          
          <div class="center header">
            ${settings.logo ? `<img src="${settings.logo}" class="logo" />` : ''}
            <h2 class="bold">${settings.cafeName || 'CAFE SENJA'}</h2>
            <p>${settings.address || 'Jl. Kopi No. 1, Jakarta'}</p>
            <p>${settings.phone || '0812-3456-7890'}</p>
          </div>

          <div class="divider"></div>

          <div>
            ID: #${order.id.slice(-6).toUpperCase()}<br>
            Tgl: ${date}<br>
            Cust: ${order.customer.toUpperCase()} (Meja ${order.tableNo})
          </div>

          <div class="divider"></div>

          <table>
            ${itemsHtml}
          </table>

          <div class="divider"></div>

          <table>
            <tr class="total-row">
              <td>TOTAL</td>
              <td class="right">${formatRupiah(order.total)}</td>
            </tr>
            <tr>
              <td>Bayar</td>
              <td class="right">CASH</td>
            </tr>
          </table>

          <div class="center footer">
            <p>*** TERIMA KASIH ***</p>
            <p>Simpan struk ini sebagai bukti pembayaran</p>
            <br>
            <p>Password Wifi: kopi123</p>
            <p style="margin-top: 5px; font-size: 7px;">System by Natakenshi Developer</p>
          </div>

        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // 📊 FUNGSI EXPORT EXCEL
  const handleExport = () => {
    const data = filteredOrders.map(order => ({
      ID: order.id,
      Tanggal: new Date(order.createdAt).toLocaleDateString(),
      Pelanggan: order.customer,
      Meja: order.tableNo,
      Total: order.total,
      Status: order.status,
      Items: order.items.map((i: any) => `${i.product.name} (${i.quantity})`).join(", ")
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");
    XLSX.writeFile(workbook, "Laporan-Penjualan.xlsx");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileSpreadsheet className="text-blue-600"/> 
          Riwayat Transaksi
        </h1>
        <button 
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 font-bold shadow-md active:scale-95 transition-all"
        >
          <Download size={18} /> Export Excel
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-3 border border-gray-100">
        <Search className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Cari nama pelanggan atau ID struk..." 
          className="w-full outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
            <tr>
              <th className="p-4">ID Struk</th>
              <th className="p-4">Waktu</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Cetak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-xs text-gray-500">#{order.id.slice(-4).toUpperCase()}</td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4">
                  <p className="font-bold text-gray-800">{order.customer}</p>
                  <p className="text-xs text-gray-400">Meja {order.tableNo}</p>
                </td>
                <td className="p-4 font-bold text-gray-800">{formatRupiah(order.total)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    order.status === 'COMPLETED' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handlePrint(order)}
                    className="bg-gray-900 text-white p-2 rounded-lg hover:bg-black transition-colors shadow-md"
                    title="Print Struk"
                  >
                    <Printer size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
            <Search size={48} className="mb-4 opacity-20" />
            <p>Data transaksi tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}