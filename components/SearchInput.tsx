"use client";
import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";

interface SearchInputProps {
  autoFocus?: boolean;
  onClose?: () => void;
  compact?: boolean;
}

export default function SearchInput({
  autoFocus = false,
  onClose,
  compact = false,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(
    () => useUIStore.getState().searchQuery,
  );
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastQuery = useRef(searchQuery);

  // Debounce 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);

  // Sinkronkan input jika searchQuery diubah dari luar (misal reset)
  useEffect(() => {
    if (searchQuery !== lastQuery.current && searchQuery !== inputValue) {
      setInputValue(searchQuery);
    }
    lastQuery.current = searchQuery;
  }, [searchQuery, inputValue]);

  // Fokus saat autoFocus true (saat popover muncul)
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  // Kembalikan fokus setelah kosong (opsional)
  useEffect(() => {
    if (inputValue === "" && document.activeElement !== inputRef.current) {
      inputRef.current?.focus();
    }
  }, [inputValue]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Cari menu..."
        className={`w-full pl-10 pr-10 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all duration-300 ${
          compact ? "py-1 text-xs" : "py-2"
        }`}
      />
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
        <svg
          className="w-5 h-5"
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
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Tutup pencarian"
        >
          ✕
        </button>
      )}
    </div>
  );
}
