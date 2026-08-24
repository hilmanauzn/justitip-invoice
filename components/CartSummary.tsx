"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useCartTotals } from "@/hooks/useCartTotals";
import { formatPrice } from "@/utils/format";
import { CartItem } from "@/types";

export default function CartSummary() {
  const [isMounted, setIsMounted] = useState(false);
  const totals = useCartTotals();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted || totals.restaurants.length === 0) return null;

  // Kelompokkan item per restoran
  const itemsByRestaurant = items.reduce<Record<string, CartItem[]>>(
    (acc, item) => {
      if (!acc[item.idRestaurant]) acc[item.idRestaurant] = [];
      acc[item.idRestaurant].push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-3">
      <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        Ringkasan Biaya
      </h3>
      <div className="space-y-2">
        {totals.restaurants.map((r) => {
          const restItems = itemsByRestaurant[r.restaurantId] || [];
          return (
            <div
              key={r.restaurantId}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              {/* Nama restoran & warning kelipatan */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {r.restaurantName}
                </span>
                {r.hasMultipleWarning && (
                  <span className="text-[10px] text-amber-700 bg-amber-100 rounded-full px-2 py-0.5 ml-2">
                    ⚠️ Kelipatan {r.multiple} (saat ini {r.totalQuantity})
                  </span>
                )}
              </div>

              {/* Daftar item compact */}
              {restItems.length > 0 && (
                <ul className="space-y-1 mb-2">
                  {restItems.map((item, idx) => (
                    <li
                      key={`${item.cartItemId}-${idx}`}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-gray-600 truncate flex-1">
                        {item.name}{" "}
                        <span className="text-gray-400">x{item.quantity}</span>
                        {item.selectedAddon && (
                          <span className="text-gray-500">
                            {" "}
                            — {item.selectedAddon}
                          </span>
                        )}
                      </span>
                      <span className="text-gray-700 font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Ringkasan biaya per restoran */}
              <dl className="space-y-0.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="text-gray-700">{formatPrice(r.subtotal)}</dd>
                </div>
                {r.subtotalNonTaxable > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">
                      Non-Taxable (Paperbag/Box)
                    </dt>
                    <dd className="text-gray-700">
                      {formatPrice(r.subtotalNonTaxable)}
                    </dd>
                  </div>
                )}
                {r.jastipFee > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Fee Jastip</dt>
                    <dd className="text-gray-700">
                      {formatPrice(r.jastipFee)}
                    </dd>
                  </div>
                )}
                {r.taxServiceAmount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tax Service</dt>
                    <dd className="text-gray-700">
                      {formatPrice(r.taxServiceAmount)}
                    </dd>
                  </div>
                )}
                {r.taxChargeAmount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tax Charge</dt>
                    <dd className="text-gray-700">
                      {formatPrice(r.taxChargeAmount)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-1 mt-1">
                  <dt className="text-gray-800 font-medium">Total</dt>
                  <dd className="text-gray-800 font-semibold">
                    {formatPrice(r.total)}
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}

        {/* Total keseluruhan */}
        <div className="flex justify-between text-sm font-bold text-gray-900 bg-white rounded-lg p-3 border border-gray-200">
          <span>Total Keseluruhan</span>
          <span>{formatPrice(totals.totalAll)}</span>
        </div>
      </div>
    </div>
  );
}
