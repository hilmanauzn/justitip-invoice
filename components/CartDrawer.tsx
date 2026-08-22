"use client";
import CartContent from "./CartContent";
import OrderSummary from "./OrderSummary";
import { useUIStore } from "@/store/useUIStore";

export default function CartDrawer() {
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const closeCart = useUIStore((state) => state.closeCart);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black/50 overflow-hidden ${
          isCartOpen ? "block" : "hidden"
        }`}
        onClick={closeCart}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isCartOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Keranjang</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        <CartContent />
        <OrderSummary />
      </div>
    </>
  );
}
