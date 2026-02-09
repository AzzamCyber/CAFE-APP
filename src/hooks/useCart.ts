import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find((item) => item.id === newItem.id);
    
    // Jika barang sudah ada, tambah quantity-nya saja
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    
    // Jika barang belum ada, masukkan ke list
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
}));