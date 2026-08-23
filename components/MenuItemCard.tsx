"use client";
import { MenuItem } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import QuantityControl from "./QuantityControl";

interface MenuItemCardProps {
  item: MenuItem;
  restaurantJastipFee: number;
  restaurantMultiple: number;
}

export default function MenuItemCard({
  item,
  restaurantJastipFee,
  restaurantMultiple,
}: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const items = useCartStore((state) => state.items);
  const quantity = useCartStore(
    (state) => state.items.find((i) => i.id === item.id)?.quantity || 0,
  );

  const totalQuantityForRestaurant = items
    .filter((i) => i.idRestaurant === item.idRestaurant)
    .reduce((sum, i) => sum + i.quantity, 0);

  const hasMultipleWarning =
    quantity > 0 &&
    restaurantMultiple > 1 &&
    totalQuantityForRestaurant % restaurantMultiple !== 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // Badge jastip
  let jastipBadge = null;
  if (!item.includeJastip) {
    jastipBadge = (
      <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">
        Tanpa Jastip
      </span>
    );
  } else if (item.jastipFeeSpecial) {
    jastipBadge = (
      <span className="text-xs font-medium text-purple-600 bg-purple-100 rounded-full px-2 py-0.5">
        Jastip Khusus: {formatPrice(item.jastipFeeSpecial)}/item
      </span>
    );
  } else {
    const jastipText =
      restaurantMultiple > 1
        ? `Jastip: ${formatPrice(restaurantJastipFee)}/kelipatan ${restaurantMultiple} item`
        : `Jastip: ${formatPrice(restaurantJastipFee)}/item`;
    jastipBadge = (
      <span className="text-xs font-medium text-green-600 bg-green-100 rounded-full px-2 py-0.5">
        {jastipText}
      </span>
    );
  }

  return (
    <div
      className={`menu-card bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300 ${
        quantity > 0 ? "ring-2 ring-orange-500" : "border-gray-100"
      }`}
    >
      {item.image ? (
        <div className="h-32 bg-gray-200">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
          <span className="text-4xl">🍲</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-1 mb-1">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 truncate">
            🍽️ {item.category}
          </span>
          {jastipBadge}
        </div>
        <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-orange-600">
              {formatPrice(item.price)}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                item.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.available ? "Tersedia" : "Habis"}
            </span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={() => addItem(item)}
              disabled={!item.available}
              className={`btn mt-3 w-full py-2.5 px-1 rounded-lg font-medium text-white ${
                item.available
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {item.available ? "➕ Tambah ke Pesanan" : "Tidak Tersedia"}
            </button>
          ) : (
            <>
              <QuantityControl
                quantity={quantity}
                width="full"
                onDecrease={() => updateQuantity(item.id, quantity - 1)}
                onIncrease={() => addItem(item)}
                onChange={(value) => updateQuantity(item.id, value)}
              />
              {hasMultipleWarning && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  ⚠️ Kelipatan {restaurantMultiple} (saat ini{" "}
                  {totalQuantityForRestaurant})
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
