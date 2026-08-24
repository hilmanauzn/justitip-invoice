"use client";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useUIStore } from "@/store/useUIStore";

export default function ReceiptModal() {
  const { isReceiptOpen, receiptImage, closeReceipt } = useUIStore();

  useLockBodyScroll(isReceiptOpen);

  if (!isReceiptOpen || !receiptImage) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = receiptImage;
    link.download = `receipt-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 overflow-hidden"
        onClick={closeReceipt}
      />
      <div className="relative bg-white rounded-xl max-w-md w-full max-h-[85vh] flex flex-col shadow-xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Struk Pesanan</h2>
          <button
            onClick={closeReceipt}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="overflow-auto p-4">
          <img
            src={receiptImage}
            alt="Receipt"
            className="w-full rounded-lg border border-gray-200"
          />
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleDownload}
            className="btn w-full py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600"
          >
            ⬇️ Unduh Struk
          </button>
        </div>
      </div>
    </div>
  );
}
