"use client";
import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Juga nonaktifkan scroll pada elemen dengan overflow-y-auto
    const scrollables = document.querySelectorAll(".overflow-y-auto");
    const originalStyles = Array.from(scrollables).map(
      (el) => (el as HTMLElement).style.overflowY,
    );
    scrollables.forEach((el) => {
      (el as HTMLElement).style.overflowY = "hidden";
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      scrollables.forEach((el, i) => {
        (el as HTMLElement).style.overflowY = originalStyles[i] || "";
      });
    };
  }, [locked]);
}
