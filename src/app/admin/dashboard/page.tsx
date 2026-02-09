'use client'

import { useEffect, useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { ShoppingBag, Users, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, activeOrders: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch('/api/admin/orders').then(res => res.json()).then(data => {
      // 1. Hitung Statistik
      const revenue = data.reduce((acc: number, curr: any) => acc + curr.total, 0);
      setStats({
        totalOrders: data.length,
        totalRevenue: revenue,
        activeOrders: data.filter((o: any) => o.status === 'PENDING').length
      });

      // 2. Olah Data untuk Grafik (Group by Day)
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      
      // Inisialisasi data kosong
      const groupedData = days.map(day => ({ name: day, total: 0, count: 0 }));

      data.forEach((order: any) => {
        const date = new Date(order.createdAt);
        const dayIndex = date.getDay(); // 0 = Minggu, 1 = Senin
        groupedData[dayIndex].total += order.total;
        groupedData[dayIndex].count += 1;
      });

      setChartData(groupedData as any);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Pendapatan" value={formatRupiah(stats.totalRevenue)} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Total Pesanan" value={stats.totalOrders.toString()} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard title="Pesanan Aktif" value={stats.activeOrders.toString()} icon={Activity} color="bg-orange-500" />
        <StatCard title="Traffic User" value={`${stats.totalOrders}`} icon={Users} color="bg-purple-500" />
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 text-gray-700">Grafik Pendapatan (Per Hari)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip formatter={(val: number) => formatRupiah(val)} />
                <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 text-gray-700">Jumlah Transaksi (Traffic)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${color} p-3 rounded-xl text-white shadow-lg shadow-gray-200`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase">{title}</p>
        <h4 className="text-xl font-bold text-gray-800">{value}</h4>
      </div>
    </div>
  )
}