import { create } from "zustand";
import { MenuItem } from "@/types";

interface AddonState {
  isAddonOpen: boolean;
  selectedItem: MenuItem | null;
  openAddonModal: (item: MenuItem) => void;
  closeAddonModal: () => void;
}

export const useAddonStore = create<AddonState>((set) => ({
  isAddonOpen: false,
  selectedItem: null,
  openAddonModal: (item) => set({ isAddonOpen: true, selectedItem: item }),
  closeAddonModal: () => set({ isAddonOpen: false, selectedItem: null }),
}));
