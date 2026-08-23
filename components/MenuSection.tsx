"use client";
import { useState } from "react";
import { menuData, restaurantData } from "@/data";
import MenuItemCard from "./MenuItemCard";
import AccordionSection from "./AccordionSection";
import { useUIStore } from "@/store/useUIStore";

export default function MenuSection() {
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setIsScrolled = useUIStore((state) => state.setIsScrolled);
  const [scrollTimeout, setScrollTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const restaurantIds = [...new Set(menuData.map((item) => item.idRestaurant))];
  const [openRestaurantIds, setOpenRestaurantIds] = useState<string[]>(
    restaurantIds.length > 0 ? [restaurantIds[0]] : [],
  );

  const toggleRestaurant = (id: string) => {
    setOpenRestaurantIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // Filter jika ada query
  const filteredMenu = searchQuery.trim()
    ? menuData.filter((item) => {
        const restaurant = restaurantData.find(
          (r) => r.id === item.idRestaurant,
        );
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (restaurant?.name.toLowerCase().includes(query) ?? false)
        );
      })
    : null;

  const handleScroll = () => {
    setIsScrolled(true);
    if (scrollTimeout) clearTimeout(scrollTimeout);
    const newTimeout = setTimeout(() => {
      setIsScrolled(false);
    }, 200);
    setScrollTimeout(newTimeout);
  };

  if (filteredMenu) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto" onScroll={handleScroll}>
        {/* Sticky header hasil pencarian – offset mengikuti tinggi header utama */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Hasil Pencarian: {searchQuery}
          </h2>
        </div>

        {/* Konten hasil pencarian */}
        <div className="p-4 sm:p-6 pb-32 md:pb-6">
          {filteredMenu.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              Tidak ada menu yang cocok.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenu.map((item, idx) => {
                const restaurant = restaurantData.find(
                  (r) => r.id === item.idRestaurant,
                );
                return (
                  <MenuItemCard
                    key={`${item.id}-${idx}`}
                    item={item}
                    restaurantJastipFee={restaurant?.jastipFee ?? 0}
                    restaurantMultiple={restaurant?.multiple ?? 1}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tampilan accordion normal
  return (
    <div className="flex-1 min-h-0 overflow-y-auto" onScroll={handleScroll}>
      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 pb-24 md:pb-6">
        {restaurantIds.map((restId) => {
          const restaurant = restaurantData.find((r) => r.id === restId);
          const restaurantItems = menuData.filter(
            (item) => item.idRestaurant === restId,
          );
          const categories = [
            ...new Set(restaurantItems.map((item) => item.category)),
          ];
          const isOpen = openRestaurantIds.includes(restId);

          const jastipFee = restaurant?.jastipFee ?? 0;
          const multiple = restaurant?.multiple ?? 1;
          const jastipInfo = `Jastip: ${formatPrice(jastipFee)}${multiple > 1 ? ` / ${multiple} item` : ""}`;

          return (
            <AccordionSection
              key={restId}
              isOpen={isOpen}
              onToggle={() => toggleRestaurant(restId)}
              title={restaurant?.name || restId}
              itemCount={restaurantItems.length}
              badges={
                <>
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
                    🚚 Jastip: {formatPrice(jastipFee)}
                  </span>
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                    📦 Kelipatan: {multiple}
                  </span>
                  {(restaurant?.taxService ?? 0) > 0 && (
                    <span className="text-xs font-medium text-blue-700 bg-blue-100 rounded-full px-2 py-0.5">
                      🧾 Tax Service: {restaurant?.taxService}%
                    </span>
                  )}
                  {(restaurant?.taxCharge ?? 0) > 0 && (
                    <span className="text-xs font-medium text-purple-700 bg-purple-100 rounded-full px-2 py-0.5">
                      💰 Tax Charge: {restaurant?.taxCharge}%
                    </span>
                  )}
                </>
              }
            >
              <div className="space-y-8">
                {categories.map((category) => {
                  const categoryItems = restaurantItems.filter(
                    (item) => item.category === category,
                  );
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-base font-semibold text-gray-700">
                          {category}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                          {categoryItems.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categoryItems.map((item, idx) => (
                          <MenuItemCard
                            key={`${item.id}-${idx}`}
                            item={item}
                            restaurantJastipFee={jastipFee}
                            restaurantMultiple={multiple}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionSection>
          );
        })}
      </div>
      <div className="h-16 md:h-0" />
    </div>
  );
}
