"use client";
import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import { useCartTotals } from "@/hooks/useCartTotals";
import CartSummary from "./CartSummary";
import ReceiptContent from "./ReceiptContent";
import { formatPrice } from "@/utils/format";
import html2canvas from "html2canvas";

export default function CartSummarySheet() {
  const { isSummaryOpen, closeSummary, openReceipt } = useUIStore();
  const { items } = useCartStore();
  const totals = useCartTotals();
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted || !isSummaryOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckout(true);

    // Simulasi proses checkout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate receipt image
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const image = canvas.toDataURL("image/png");
      openReceipt(image);
    }

    // clearCart();
    setIsCheckout(false);
    closeSummary();
  };

  const isDisabled = items.length === 0 || isCheckout;

  return (
    <>
      {/* Hidden receipt content untuk di-capture */}
      <div
        ref={receiptRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          zIndex: -100,
        }}
      >
        <ReceiptContent />
      </div>

      {/* Modal ringkasan */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30" onClick={closeSummary} />
        <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl max-h-[85vh] flex flex-col shadow-xl">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ringkasan Biaya</h2>
            <button
              onClick={closeSummary}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            <CartSummary />
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {totals.hasMultipleWarnings && (
              <p className="text-sm text-amber-600 mb-2">
                ⚠️ Beberapa pesanan tidak sesuai kelipatan.
              </p>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total Pembayaran</span>
              <span className="text-2xl font-extrabold text-orange-600">
                {formatPrice(totals.totalAll)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isDisabled}
              className={`btn w-full py-3.5 rounded-xl font-semibold text-white shadow-lg ${
                isDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-200"
              }`}
            >
              {isCheckout ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "🛎️ Buat Pesanan"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
