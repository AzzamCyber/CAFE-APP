'use client'

import { useEffect, useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { Clock, CheckCircle, Printer, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast'; // Notifikasi

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data Order & Settings
  const fetchData = async () => {
    try {
      const [resOrders, resSettings] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/settings')
      ]);
      
      const dataOrders = await resOrders.json();
      const dataSettings = await resSettings.json();

      // Hanya ambil status PENDING
      setOrders(dataOrders.filter((o: any) => o.status === 'PENDING'));
      setSettings(dataSettings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  // 🖨️ FUNGSI PRINT STRUK (UPDATED: SAMA PERSIS DENGAN HISTORY)
  const handlePrint = (order: any) => {
    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) return;

    // Format Waktu sesuai Order dibuat
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
          <title>Struk #${order.id.slice(-4)}</title>
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

  // ✅ FUNGSI PROSES SELESAI
  const handleComplete = async (id: string, shouldPrint: boolean, orderData: any) => {
    // 1. Loading Toast
    const toastId = toast.loading('Memproses pesanan...');

    try {
      // 2. Update Database
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ id, status: 'COMPLETED' })
      });

      // 3. Update UI Local
      setOrders(prev => prev.filter((o: any) => o.id !== id));

      // 4. Sukses Toast
      toast.success('Pesanan Siap Saji!', { id: toastId });

      // 5. Print Jika Diminta
      if (shouldPrint) {
        setTimeout(() => {
          handlePrint(orderData); // Memanggil fungsi print yang sudah diperbarui
          toast.success('Mencetak Struk...', { icon: '🖨️' });
        }, 500);
      }

    } catch (error) {
      toast.error('Gagal update status', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen p-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <ChefHat className="text-orange-500" size={32} />
            Kitchen Display
          </h1>
          <p className="text-gray-500 text-sm">Monitor pesanan masuk secara real-time</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-gray-700">
            {loading ? 'Menghubungkan...' : `${orders.length} Pesanan Pending`}
          </span>
        </div>
      </div>

      {/* GRID KARTU PESANAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden border-t-8 border-orange-500 flex flex-col h-full hover:scale-[1.02] transition-transform duration-300">
            
            {/* Header Kartu */}
            <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Meja</span>
                <p className="font-black text-2xl text-gray-800 leading-none">{order.tableNo}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 block">#{order.id.slice(-4).toUpperCase()}</span>
                <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-gray-200 text-gray-500 flex items-center gap-1 justify-end mt-1">
                  <Clock size={10} /> 
                  {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
            
            {/* List Item */}
            <div className="p-5 flex-1 overflow-y-auto max-h-[350px] bg-white">
              <ul className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-lg shrink-0 shadow-md">
                      {item.quantity}
                    </span>
                    <div>
                      <p className="font-bold text-lg text-gray-800 leading-snug">{item.product.name}</p>
                      {item.note && (
                        <p className="text-red-500 text-xs italic mt-1 bg-red-50 px-2 py-1 rounded inline-block font-medium">
                          Note: {item.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tombol Aksi */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleComplete(order.id, false, order)}
                className="bg-white border-2 border-green-600 text-green-700 py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors flex flex-col items-center justify-center"
              >
                <CheckCircle size={18} className="mb-1" />
                Selesai
              </button>

              <button 
                onClick={() => handleComplete(order.id, true, order)}
                className="bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle size={16} /> + <Printer size={16} />
                </div>
                Selesai & Print
              </button>
            </div>
          </div>
        ))}

        {/* Tampilan Jika Kosong */}
        {orders.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center h-[60vh] text-gray-400 opacity-60">
            <div className="bg-gray-100 p-8 rounded-full mb-6">
              <ChefHat size={80} className="text-gray-300" />
            </div>
            <h2 className="text-3xl font-black text-gray-300">DAPUR BERSIH</h2>
            <p className="text-gray-400 mt-2">Menunggu pesanan baru masuk...</p>
          </div>
        )}
      </div>
    </div>
  );
}