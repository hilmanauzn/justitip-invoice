"use client";
import { useState, useEffect } from "react";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useCartStore } from "@/store/useCartStore";

export default function CustomerModal() {
  const {
    isCustomerModalOpen,
    closeCustomerModal,
    setCustomerName,
    customerName,
    openCustomerModal,
  } = useCustomerStore();
  const [inputValue, setInputValue] = useState(customerName);

  // Buka modal otomatis jika nama kosong (termasuk setelah reset)
  // Dependency hanya customerName dan isCustomerModalOpen
  useEffect(() => {
    if (customerName === "" && !isCustomerModalOpen) {
      openCustomerModal();
    }
  }, [customerName, isCustomerModalOpen, openCustomerModal]);

  useLockBodyScroll(isCustomerModalOpen);

  // Sinkronkan inputValue saat modal dibuka atau customerName berubah
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(customerName);
  }, [customerName, isCustomerModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim().replace(/\s+/g, " ");
    if (trimmed) {
      const capitalized = trimmed
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // Jika nama berubah, kosongkan keranjang
      if (capitalized !== customerName) {
        useCartStore.getState().clearCart();
      }

      setCustomerName(capitalized);
      closeCustomerModal();
    }
  };

  if (!isCustomerModalOpen) return null;

  const isNameEmpty = customerName === "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/30 overflow-hidden"
        onClick={isNameEmpty ? undefined : closeCustomerModal}
        style={{ touchAction: "none" }}
      />
      <div className="relative bg-white rounded-xl max-w-sm w-full shadow-xl p-6 overscroll-contain">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Nama Customer</h2>
          {!isNameEmpty && (
            <button
              onClick={closeCustomerModal}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Tutup"
            >
              ✕
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Masukkan nama customer"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            autoFocus
          />
          <button
            type="submit"
            className="btn w-full py-2.5 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}
