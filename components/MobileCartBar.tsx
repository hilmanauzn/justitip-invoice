"use client";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";

export default function MobileCartBar() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const openCart = useUIStore((state) => state.openCart);
  const inset = useKeyboardInset();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = getTotalPrice();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  if (totalItems === 0) {
    return (
      <div
        className="md:hidden fixed left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 shadow-lg"
        style={{ bottom: `${inset}px` }}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">Belum ada pesanan</p>
          <button
            onClick={openCart}
            className="btn bg-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium"
          >
            🛒 Keranjang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="md:hidden fixed left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 shadow-lg transition-all duration-200"
      style={{ bottom: `${inset}px` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {totalItems} item
            </p>
            <p className="text-xs text-gray-500">
              Total: {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
        <button
          onClick={openCart}
          className="btn bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:bg-orange-600"
        >
          Lihat Pesanan
        </button>
      </div>
    </div>
  );
}
