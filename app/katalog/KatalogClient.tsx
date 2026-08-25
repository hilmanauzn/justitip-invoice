"use client";
import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import Link from "next/link";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function KatalogFlipbook() {
  const [pages, setPages] = useState<string[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const flipBookRef = useRef<unknown>(null);

  // Deteksi ukuran viewport
  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Hitung ukuran flipbook
  const isMobile = viewport.width > 0 && viewport.width < 640;
  const flipbookWidth = isMobile
    ? viewport.width - 16
    : Math.min(600, viewport.width - 48);
  const flipbookHeight = isMobile
    ? viewport.height - 100
    : Math.min(750, viewport.height - 160);

  // Load PDF dengan skala dinamis
  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const pdf = await pdfjsLib.getDocument("/katalog.pdf").promise;
        setNumPages(pdf.numPages);
        const pageImages: string[] = [];

        const scale = Math.min(3, Math.max(1, (flipbookWidth / 200) * 2));

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const viewportPdf = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.width = viewportPdf.width;
          canvas.height = viewportPdf.height;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await page.render({ canvasContext: context, viewport: viewportPdf })
            .promise;
          pageImages.push(canvas.toDataURL("image/png"));
        }
        setPages(pageImages);
      } catch (err: unknown) {
        console.error("Gagal memuat PDF:", err);
        setError(
          "Gagal memuat PDF. Pastikan file berada di public/katalog.pdf",
        );
      } finally {
        setLoading(false);
      }
    };

    if (flipbookWidth > 0) {
      loadPdf();
    }
  }, [flipbookWidth]);

  const handlePageChange = (e: { data: any }) => {
    const page = e.data;
    setCurrentPage(page);
    setInputPage(String(page));
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nextPage = () => flipBookRef.current?.pageFlip().flipNext();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const prevPage = () => flipBookRef.current?.pageFlip().flipPrev();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = e.target.value.replace(/\D/g, "") || "1";
    const pageNum = parseInt(val, 10) - 1;
    if (isNaN(pageNum) || pageNum < 0 || pageNum > numPages) {
      setInputPage(String(currentPage));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const api = flipBookRef.current?.pageFlip?.();

    if (api) {
      // Coba method turnToPage terlebih dahulu
      if (typeof api.turnToPage === "function") {
        api.turnToPage(pageNum);
      } else if (typeof api.turnTo === "function") {
        api.turnTo(pageNum);
      } else if (typeof api.flip === "function") {
        // Jika hanya ada flip(delta), gunakan delta
        const delta = pageNum - currentPage;
        if (delta !== 0) {
          api.flip(delta);
        }
      }
    }

    setCurrentPage(pageNum);
    setInputPage(String(pageNum));
  };

  if (loading || viewport.width === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Memuat katalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-gray-900 text-white">
      {/* Header dengan tombol back */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">📖 Katalog Produk</h1>
        </div>
        <span className="text-sm text-gray-300 hidden sm:inline">
          {currentPage} / {numPages}
        </span>
      </div>

      {/* Area flipbook */}
      <div className="flex-1 flex items-center justify-center bg-gray-800 p-2 sm:p-4 overflow-hidden">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <HTMLFlipBook
          key={pages.length}
          ref={flipBookRef}
          width={flipbookWidth}
          height={flipbookHeight}
          size="stretch"
          usePortrait={true}
          minWidth={flipbookWidth * 0.8}
          maxWidth={flipbookWidth}
          minHeight={flipbookHeight * 0.8}
          maxHeight={flipbookHeight}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={true}
          onFlip={handlePageChange}
          className="mx-auto"
        >
          {pages.map((page, index) => (
            <div
              key={index}
              className="bg-white"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={page}
                alt={`Halaman ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Footer navigasi */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-gray-800 border-t border-gray-700">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm disabled:opacity-50"
          disabled={currentPage <= 1}
        >
          ← Sebelumnya
        </button>

        <form className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={parseInt(inputPage) + 1}
            onChange={handleInputChange}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="w-12 text-center bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Nomor halaman"
          />
          <span className="text-sm text-gray-400">/ {numPages}</span>
        </form>

        <button
          onClick={nextPage}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm disabled:opacity-50"
          disabled={currentPage >= numPages}
        >
          Berikutnya →
        </button>
      </div>
    </div>
  );
}
