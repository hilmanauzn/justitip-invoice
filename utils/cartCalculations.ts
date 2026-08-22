import { CartItem } from "@/types";
import { restaurantData } from "@/data";

export interface RestaurantBreakdown {
  restaurantId: string;
  restaurantName: string;
  subtotal: number;
  subtotalTaxable: number;
  subtotalNonTaxable: number;
  jastipFee: number;
  taxServiceAmount: number;
  taxChargeAmount: number;
  total: number;
  totalQuantity: number; // total semua item
  totalQuantityIncludeJastip: number; // total item includeJastip = true
  multiple: number;
  hasMultipleWarning: boolean;
}

export interface CartTotals {
  restaurants: RestaurantBreakdown[];
  subtotalAll: number;
  jastipFeeAll: number;
  taxServiceAll: number;
  taxChargeAll: number;
  totalAll: number;
  hasMultipleWarnings: boolean;
}

// Menggunakan regex untuk mendeteksi item bebas pajak
function isTaxExemptItem(item: CartItem): boolean {
  return /\b(?:paperbag|dus|box)\b/i.test(item.name);
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const grouped: Record<string, CartItem[]> = {};
  items.forEach((item) => {
    if (!grouped[item.idRestaurant]) grouped[item.idRestaurant] = [];
    grouped[item.idRestaurant].push(item);
  });

  const restaurants: RestaurantBreakdown[] = [];
  let subtotalAll = 0;
  let jastipFeeAll = 0;
  let taxServiceAll = 0;
  let taxChargeAll = 0;
  let totalAll = 0;
  let hasMultipleWarnings = false;

  Object.entries(grouped).forEach(([restId, restItems]) => {
    const restaurant = restaurantData.find((r) => r.id === restId);
    if (!restaurant) return;

    // Pisahkan item taxable dan non-taxable
    const taxableItems = restItems.filter((item) => !isTaxExemptItem(item));
    const nonTaxableItems = restItems.filter(isTaxExemptItem);

    const subtotalTaxable = taxableItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const subtotalNonTaxable = nonTaxableItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const subtotal = subtotalTaxable + subtotalNonTaxable;

    const totalQuantity = restItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalQuantityIncludeJastip = restItems
      .filter((item) => item.includeJastip)
      .reduce((sum, item) => sum + item.quantity, 0);

    // Hitung fee jastip
    let jastipFee = 0;
    let qtyNormalInclude = 0;
    let specialFeeTotal = 0;

    restItems.forEach((item) => {
      if (item.includeJastip) {
        if (item.jastipFeeSpecial) {
          // Item dengan jastip khusus dihitung per item
          specialFeeTotal += item.jastipFeeSpecial * item.quantity;
        } else {
          // Item tanpa jastip khusus dihitung per batch (kelipatan)
          qtyNormalInclude += item.quantity;
        }
      }
    });

    const multiple = restaurant.multiple;
    if (qtyNormalInclude > 0) {
      const batches = Math.ceil(qtyNormalInclude / multiple);
      jastipFee += batches * restaurant.jastipFee;
    }
    jastipFee += specialFeeTotal;

    // Perhitungan pajak HANYA dari subtotal taxable (tanpa jastip)
    const taxServiceAmount =
      subtotalTaxable * ((restaurant.taxService || 0) / 100);
    const taxChargeAmount =
      (subtotalTaxable + taxServiceAmount) *
      ((restaurant.taxCharge || 0) / 100);

    const total = subtotal + jastipFee + taxServiceAmount + taxChargeAmount;

    const hasMultipleWarning =
      multiple > 1 && totalQuantityIncludeJastip % multiple !== 0;
    if (hasMultipleWarning) hasMultipleWarnings = true;

    restaurants.push({
      restaurantId: restId,
      restaurantName: restaurant.name,
      subtotal,
      subtotalTaxable,
      subtotalNonTaxable,
      jastipFee,
      taxServiceAmount,
      taxChargeAmount,
      total,
      totalQuantity,
      multiple,
      hasMultipleWarning,
      totalQuantityIncludeJastip,
    });

    subtotalAll += subtotal;
    jastipFeeAll += jastipFee;
    taxServiceAll += taxServiceAmount;
    taxChargeAll += taxChargeAmount;
    totalAll += total;
  });

  return {
    restaurants,
    subtotalAll,
    jastipFeeAll,
    taxServiceAll,
    taxChargeAll,
    totalAll,
    hasMultipleWarnings,
  };
}
