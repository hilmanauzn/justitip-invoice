import { create } from "zustand";

interface CustomerState {
  customerName: string;
  isCustomerModalOpen: boolean;
  openCustomerModal: () => void;
  closeCustomerModal: () => void;
  setCustomerName: (name: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customerName: "",
  isCustomerModalOpen: false,
  openCustomerModal: () => set({ isCustomerModalOpen: true }),
  closeCustomerModal: () => set({ isCustomerModalOpen: false }),
  setCustomerName: (name) => set({ customerName: name }),
}));
