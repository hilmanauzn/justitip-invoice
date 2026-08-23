"use client";
import { useRef, useState, useEffect, ReactNode } from "react";

interface AccordionSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  itemCount: number;
  badges?: ReactNode;
  children: ReactNode;
}

export default function AccordionSection({
  isOpen,
  onToggle,
  title,
  itemCount,
  badges,
  children,
}: AccordionSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [children, isOpen]);

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
      <button
        onClick={onToggle} // langsung panggil onToggle tanpa scroll
        className="sticky top-0 z-10 w-full p-4 bg-white border-b border-gray-200 rounded-t-xl hover:bg-gray-50 transition-colors"
      >
        {/* konten header sama seperti sebelumnya */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h2
              className="text-lg sm:text-xl font-bold text-gray-800 truncate"
              title={title}
            >
              {title}
            </h2>
            <span className="flex-shrink-0 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
              {itemCount} item
            </span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {badges && (
          <div className="flex flex-wrap gap-2 mt-2 text-left">{badges}</div>
        )}
      </button>

      <div
        style={{
          maxHeight,
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.35s ease-in-out, opacity 0.3s ease-in-out",
        }}
        className="overflow-hidden"
      >
        <div ref={contentRef}>
          <div className="border-t border-gray-200 p-4 sm:p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
