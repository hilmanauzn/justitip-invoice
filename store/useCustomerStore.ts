import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CustomerState {
  customerName: string;
  isCustomerModalOpen: boolean;
  openCustomerModal: () => void;
  closeCustomerModal: () => void;
  setCustomerName: (name: string) => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customerName: "",
      isCustomerModalOpen: false,
      openCustomerModal: () => set({ isCustomerModalOpen: true }),
      closeCustomerModal: () => set({ isCustomerModalOpen: false }),
      setCustomerName: (name) => set({ customerName: name }),
    }),
    {
      name: "customer-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customerName: state.customerName, // hanya simpan nama
      }),
    },
  ),
);
