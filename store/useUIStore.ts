import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  isSummaryOpen: boolean;
  isReceiptOpen: boolean;
  receiptImage: string | null;
  searchQuery: string;
  isSearchExpanded: boolean;
  isScrolled: boolean;
  setSearchQuery: (query: string) => void;
  setSearchExpanded: (expanded: boolean) => void;
  toggleSearchExpanded: () => void;
  setIsScrolled: (scrolled: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  openSummary: () => void;
  closeSummary: () => void;
  openReceipt: (image: string) => void;
  closeReceipt: () => void;
  isProgrammaticScroll: boolean;
  setProgrammaticScroll: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isSummaryOpen: false,
  isReceiptOpen: false,
  receiptImage: null,
  searchQuery: "",
  isSearchExpanded: false,
  isScrolled: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchExpanded: (expanded) => set({ isSearchExpanded: expanded }),
  toggleSearchExpanded: () =>
    set((state) => ({ isSearchExpanded: !state.isSearchExpanded })),
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openSummary: () => set({ isSummaryOpen: true }),
  closeSummary: () => set({ isSummaryOpen: false }),
  openReceipt: (image) => set({ isReceiptOpen: true, receiptImage: image }),
  closeReceipt: () => set({ isReceiptOpen: false, receiptImage: null }),
  isProgrammaticScroll: false,
  setProgrammaticScroll: (v) => set({ isProgrammaticScroll: v }),
}));
