"use client";
import { useState, useEffect } from "react";

export function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const updateInset = () => {
      if (window.visualViewport) {
        const keyboardHeight =
          window.innerHeight - window.visualViewport.height;
        setInset(Math.max(0, keyboardHeight));
      }
    };

    updateInset();

    // Fallback untuk deteksi keyboard lebih awal
    const handleFocusIn = () => {
      setTimeout(updateInset, 50); // sedikit delay agar keyboard mulai muncul
    };
    const handleFocusOut = () => {
      setTimeout(updateInset, 50);
    };

    window.visualViewport?.addEventListener("resize", updateInset);
    window.visualViewport?.addEventListener("scroll", updateInset);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateInset);
      window.visualViewport?.removeEventListener("scroll", updateInset);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return inset;
}
