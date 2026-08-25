"use client";
import { MenuItem } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useAddonStore } from "@/store/useAddonstore";
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
  const openAddonModal = useAddonStore((state) => state.openAddonModal);

  // Total kuantitas semua varian item ini (termasuk addon berbeda)
  const totalQuantity = items
    .filter((i) => i.id === item.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const totalQuantityForRestaurant = items
    .filter((i) => i.idRestaurant === item.idRestaurant && i.includeJastip)
    .reduce((sum, i) => sum + i.quantity, 0);

  const hasMultipleWarning =
    totalQuantity > 0 &&
    restaurantMultiple > 1 &&
    totalQuantityForRestaurant % restaurantMultiple !== 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // Badge jastip (sama seperti sebelumnya)
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
        Jastip Khusus: {formatPrice(item.jastipFeeSpecial)}
      </span>
    );
  } else {
    const jastipText =
      restaurantMultiple > 1
        ? `Jastip: ${formatPrice(restaurantJastipFee)}/${restaurantMultiple} item`
        : `Jastip: ${formatPrice(restaurantJastipFee)}/item`;
    jastipBadge = (
      <span className="text-xs font-medium text-green-600 bg-green-100 rounded-full px-2 py-0.5">
        {jastipText}
      </span>
    );
  }

  // Handler untuk tombol −
  const handleDecrease = () => {
    // Cari varian item ini yang quantity > 0, pilih yang pertama
    const existingItem = items.find((i) => i.id === item.id && i.quantity > 0);
    if (existingItem) {
      updateQuantity(existingItem.cartItemId, existingItem.quantity - 1);
    }
  };

  // Handler untuk tombol +
  const handleIncrease = () => {
    if (item.addon && item.addon.length > 0) {
      openAddonModal(item);
    } else {
      addItem(item);
    }
  };

  return (
    <div
      className={`menu-card bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300 ${
        totalQuantity > 0 ? "ring-2 ring-orange-500" : "border-gray-100"
      }`}
    >
      {/* ... gambar & konten sama ... */}
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

          {/* Tampilkan counter jika sudah dipilih, selain itu tombol tambah */}
          {totalQuantity === 0 ? (
            <button
              onClick={handleIncrease}
              disabled={!item.available}
              className={`btn mt-3 w-full py-2.5 rounded-lg font-medium text-white ${
                item.available
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {item.available
                ? item.addon && item.addon.length > 0
                  ? "➕ Pilih Addon"
                  : "➕ Tambah ke Pesanan"
                : "Tidak Tersedia"}
            </button>
          ) : (
            <>
              <QuantityControl
                quantity={totalQuantity}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                width="full"
                onChange={(value) => {
                  // Tidak digunakan di menu card, hanya untuk input manual
                  const existingItem = items.find(
                    (i) => i.id === item.id && i.quantity > 0,
                  );
                  if (existingItem) {
                    updateQuantity(existingItem.cartItemId, value);
                  }
                }}
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
