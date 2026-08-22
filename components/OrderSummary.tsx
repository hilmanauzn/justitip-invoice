"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useCartTotals } from "@/hooks/useCartTotals";
import { formatPrice } from "@/utils/format";
import { useUIStore } from "@/store/useUIStore";

export default function OrderSummary() {
  const [isMounted, setIsMounted] = useState(false);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const { items } = useCartStore();
  const totals = useCartTotals();
  const { openSummary } = useUIStore();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isDisabled = items.length === 0;

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Total Pembayaran</span>
        <span className="text-2xl font-extrabold text-orange-600">
          {formatPrice(totalPrice)}
        </span>
      </div>
      {totals.hasMultipleWarnings && (
        <p className="text-sm text-amber-600 mb-2">
          ⚠️ Beberapa pesanan tidak sesuai kelipatan.
        </p>
      )}
      <button
        onClick={openSummary}
        disabled={isDisabled}
        className={`btn w-full py-3.5 rounded-xl font-semibold text-white shadow-lg ${
          isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-200"
        }`}
      >
        Lihat Rincian Biaya
      </button>
    </div>
  );
}
