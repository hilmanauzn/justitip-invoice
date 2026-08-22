"use client";
import { useState, useEffect, useRef } from "react";

interface QuantityControlProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (value: number) => void;
  width?: "full" | "fit";
}

export default function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  onChange,
  width,
}: QuantityControlProps) {
  const [inputValue, setInputValue] = useState<string>(String(quantity));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(String(quantity));
  }, [quantity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setInputValue(value);
  };

  const handleBlur = () => {
    if (inputValue === "") {
      setInputValue(String(quantity));
      return;
    }
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) {
      setInputValue(String(quantity));
    } else if (parsed <= 0) {
      onChange(0);
    } else {
      onChange(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      className={`${width === "full" ? "mt-1" : ""} flex items-center justify-center gap-2 bg-gray-100 rounded-lg p-1.5 w-fit`}
    >
      <button
        onClick={onDecrease}
        className="btn w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xl"
      >
        −
      </button>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${width === "full" ? "w-full" : "w-12"} text-center font-semibold text-gray-800 text-lg bg-transparent border-none focus:outline-none focus:ring-0`}
      />
      <button
        onClick={onIncrease}
        className="btn w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xl"
      >
        +
      </button>
    </div>
  );
}
