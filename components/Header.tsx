"use client";
import { useCartStore } from "@/store/useCartStore";
import { useCustomerStore } from "@/store/useCustomerStore";
import SearchInput from "./SearchInput";
import ResetButton from "./ResetButton";

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const customerName = useCustomerStore((state) => state.customerName);
  const openCustomerModal = useCustomerStore(
    (state) => state.openCustomerModal,
  );

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Kiri: Nama customer */}
        <button
          onClick={openCustomerModal}
          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
        >
          <span className="text-2xl">👤</span>
          <div className="text-left">
            <p className="text-sm text-gray-500">Customer</p>
            <h1 className="text-lg font-bold text-gray-800 truncate max-w-[180px] sm:max-w-xs">
              {customerName || "Klik untuk isi nama"}
            </h1>
          </div>
        </button>

        {/* Tengah: Search (desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchInput />
        </div>

        {/* Kanan: Reset + badge pesanan */}
        <div className="flex items-center gap-2">
          <ResetButton />
          <div className="hidden md:flex items-center gap-2">
            <span className="text-gray-600">Pesanan:</span>
            <span className="bg-orange-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md relative">
              {totalItems} item
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
