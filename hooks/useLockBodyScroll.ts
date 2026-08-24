"use client";
import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const originalStyle = document.body.style.cssText;

    // Kunci body dengan fixed dan set top negatif agar posisi scroll tidak hilang
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    // Matikan scroll pada elemen dengan overflow-y-auto
    const scrollables = document.querySelectorAll(".overflow-y-auto");
    const originalOverflowY: string[] = [];
    scrollables.forEach((el) => {
      const htmlEl = el as HTMLElement;
      originalOverflowY.push(htmlEl.style.overflowY);
      htmlEl.style.overflowY = "hidden";
    });

    return () => {
      document.body.style.cssText = originalStyle;
      scrollables.forEach((el, i) => {
        (el as HTMLElement).style.overflowY = originalOverflowY[i] || "";
      });
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
