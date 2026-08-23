import { create } from "zustand";
import { CartItem, MenuItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem, selectedAddon?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item, selectedAddon) =>
    set((state) => {
      const normalizedAddon = selectedAddon || undefined;

      // Cari item yang sama id + addon
      const existing = state.items.find(
        (i) => i.id === item.id && i.selectedAddon === normalizedAddon,
      );

      if (existing) {
        // Tambah kuantitas entri yang sama
        return {
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }

      // Buat cartItemId unik untuk item yang memiliki addon
      const cartItemId =
        item.addon && item.addon.length > 0
          ? `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
          : item.id; // untuk item tanpa addon gunakan id item

      return {
        items: [
          ...state.items,
          {
            ...item,
            cartItemId,
            quantity: 1,
            selectedAddon: normalizedAddon,
          },
        ],
      };
    }),

  removeItem: (cartItemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.cartItemId !== cartItemId),
    })),

  updateQuantity: (cartItemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity } : i,
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}));
