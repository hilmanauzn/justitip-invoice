"use client";
import { useCartStore } from "@/store/useCartStore";
import { useAddonStore } from "@/store/useAddonstore";
import QuantityControl from "./QuantityControl";
import { restaurantData } from "@/data";

export default function CartContent() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const addItem = useCartStore((state) => state.addItem);
  const openAddonModal = useAddonStore((state) => state.openAddonModal);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getJastipInfo = (item: (typeof items)[0]) => {
    if (!item.includeJastip) {
      return { text: "Tanpa Jastip", color: "text-blue-600" };
    }
    if (item.jastipFeeSpecial) {
      return {
        text: `Jastip Khusus ${formatPrice(item.jastipFeeSpecial)}/item`,
        color: "text-purple-600",
      };
    }
    const restaurant = restaurantData.find((r) => r.id === item.idRestaurant);
    if (restaurant) {
      let text = `Jastip ${formatPrice(restaurant.jastipFee)}/item`;
      if (restaurant.multiple > 1) {
        text = `Jastip ${formatPrice(restaurant.jastipFee)}/kelipatan ${restaurant.multiple} item`;
      }
      return { text, color: "text-green-600" };
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {items.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-4xl mb-2">🍽️</p>
          <p className="font-medium text-gray-600">Belum ada item dipilih</p>
          <p className="text-sm mt-1">Silakan pilih menu untuk mulai memesan</p>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {items.map((item) => {
              const restaurant = restaurantData.find(
                (r) => r.id === item.idRestaurant,
              );
              const jastipInfo = getJastipInfo(item);

              const totalQuantityForRestaurant = items
                .filter((i) => i.idRestaurant === item.idRestaurant)
                .reduce((sum, i) => sum + i.quantity, 0);

              const multiple = restaurant?.multiple ?? 1;
              const hasMultipleWarning =
                multiple > 1 && totalQuantityForRestaurant % multiple !== 0;

              return (
                <li
                  key={item.cartItemId}
                  className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      {item.selectedAddon && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Addon: {item.selectedAddon}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 flex-shrink-0"
                      aria-label="Hapus item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5 text-xs text-gray-500">
                    {restaurant && (
                      <>
                        <span className="truncate">🏪 {restaurant.name}</span>
                        <span className="text-gray-300">|</span>
                      </>
                    )}
                    <span>🍽️ {item.category}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">
                      {formatPrice(item.price)} / porsi
                    </span>
                    {jastipInfo && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className={jastipInfo.color}>
                          {jastipInfo.text}
                        </span>
                      </>
                    )}
                  </div>

                  {hasMultipleWarning && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      ⚠️ Kelipatan {multiple} (saat ini{" "}
                      {totalQuantityForRestaurant})
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <QuantityControl
                      quantity={item.quantity}
                      onDecrease={() =>
                        updateQuantity(item.cartItemId, item.quantity - 1)
                      }
                      onIncrease={() => {
                        if (item.addon && item.addon.length > 0) {
                          openAddonModal(item);
                        } else {
                          addItem(item);
                        }
                      }}
                      onChange={(value) =>
                        updateQuantity(item.cartItemId, value)
                      }
                    />
                    <p className="font-bold text-orange-600 text-base">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            onClick={clearCart}
            className="btn w-full mt-3 bg-white border border-red-200 text-red-500 hover:bg-red-50 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            Kosongkan Keranjang
          </button>
        </>
      )}
    </div>
  );
}
