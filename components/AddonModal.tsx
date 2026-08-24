"use client";
import { useState } from "react";
import { useAddonStore } from "@/store/useAddonstore";
import { useCartStore } from "@/store/useCartStore";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export default function AddonModal() {
  const { isAddonOpen, selectedItem, closeAddonModal } = useAddonStore();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedAddon, setSelectedAddon] = useState<string>("");
  useLockBodyScroll(isAddonOpen);

  if (!isAddonOpen || !selectedItem) return null;

  const handleConfirm = () => {
    if (selectedAddon) {
      addItem(selectedItem, selectedAddon);
      closeAddonModal();
      setSelectedAddon("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/30 overflow-hidden"
        onClick={closeAddonModal}
      />
      <div className="relative bg-white rounded-xl max-w-sm w-full shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Pilih Addon</h2>
          <button
            onClick={closeAddonModal}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-2">{selectedItem.name}</p>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedItem.addon?.map((addon) => (
            <button
              key={addon}
              onClick={() => setSelectedAddon(addon)}
              className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                selectedAddon === addon
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {addon}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedAddon}
          className="btn w-full mt-4 py-2.5 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
        >
          Tambah ke Pesanan
        </button>
      </div>
    </div>
  );
}
