import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Membersihkan database lama...')
  // Hapus data secara berurutan agar tidak error relasi
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.setting.deleteMany()

  console.log('⚙️  Membuat Konfigurasi Awal...')
  await prisma.setting.create({
    data: {
      id: "config", // ID statis
      cafeName: "Cafe Senja",
      description: "Tempat nongkrong paling asik",
      primaryColor: "#2563eb", // Biru
      secondaryColor: "#1e293b", // Gelap
      address: "Jl. Mawar No. 123, Jakarta",
      phone: "0812-3456-7890"
    }
  })

  console.log('👤 Membuat Akun Admin...')
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@cafe.com',
      password: 'admin', // Password belum di-hash (sesuai tutorial awal)
      role: 'ADMIN',
    },
  })

  console.log('🍔 Membuat Menu Makanan & Minuman...')
  // Kategori: Coffee
  await prisma.category.create({
    data: {
      name: 'Coffee Series',
      products: {
        create: [
          {
            name: 'Kopi Susu Gula Aren',
            price: 18000,
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1000',
            isAvailable: true,
          },
          {
            name: 'Americano Hot',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=1000',
            isAvailable: true,
          },
        ],
      },
    },
  })

  // Kategori: Makanan
  await prisma.category.create({
    data: {
      name: 'Main Course',
      products: {
        create: [
          {
            name: 'Nasi Goreng Spesial',
            price: 25000,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=1000',
            isAvailable: true,
          },
        ],
      },
    },
  })

  console.log('✅ SEEDING SELESAI! Silakan login.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })