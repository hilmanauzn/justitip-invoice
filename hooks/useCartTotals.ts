"use client";
import { useCartStore } from "@/store/useCartStore";
import { calculateCartTotals } from "@/utils/cartCalculations";

export function useCartTotals() {
  const items = useCartStore((state) => state.items);
  return calculateCartTotals(items);
}
