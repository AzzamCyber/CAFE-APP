import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, tableNo, items } = body;

    // Hitung total di server (lebih aman)
    const total = items.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity);
    }, 0);

    // Simpan ke Database (Prisma)
    const order = await prisma.order.create({
      data: {
        customer,
        tableNo,
        total,
        status: 'PENDING', // Status awal pesanan
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
    
  } catch (error) {
    console.error("Order Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}