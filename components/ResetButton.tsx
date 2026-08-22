"use client";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { useCustomerStore } from "@/store/useCustomerStore";

export default function ResetButton() {
  const clearCart = useCartStore((state) => state.clearCart);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);
  const setSearchExpanded = useUIStore((state) => state.setSearchExpanded);
  const setCustomerName = useCustomerStore((state) => state.setCustomerName);

  const handleReset = () => {
    if (confirm("Reset semua data pesanan?")) {
      clearCart();
      setSearchQuery("");
      setSearchExpanded(false);
      setCustomerName("");
    }
  };

  return (
    <button
      onClick={handleReset}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
      title="Reset semua data"
      aria-label="Reset semua data"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
}
