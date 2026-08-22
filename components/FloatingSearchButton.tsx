"use client";
import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import SearchInput from "./SearchInput";

export default function FloatingSearchButton() {
  const isSearchExpanded = useUIStore((state) => state.isSearchExpanded);
  const toggleSearchExpanded = useUIStore(
    (state) => state.toggleSearchExpanded,
  );
  const setSearchExpanded = useUIStore((state) => state.setSearchExpanded);

  // Tutup popover saat ada scroll di area mana pun
  useEffect(() => {
    if (!isSearchExpanded) return;

    const handleScroll = () => {
      setSearchExpanded(false);
    };

    // Gunakan capture true untuk menangkap scroll pada elemen overflow-y-auto
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, [isSearchExpanded, setSearchExpanded]);

  return (
    <div className="md:hidden fixed bottom-24 right-4 z-40 flex flex-col items-end">
      {/* Popover search */}
      {isSearchExpanded && (
        <div className="search-pop-in mb-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <SearchInput autoFocus onClose={() => setSearchExpanded(false)} />
        </div>
      )}

      {/* Tombol toggle */}
      <button
        onClick={toggleSearchExpanded}
        className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        aria-label="Cari menu"
      >
        {isSearchExpanded ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
