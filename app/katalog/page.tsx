"use client";
import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function KatalogFlipbook() {
  const [pages, setPages] = useState<string[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const flipBookRef = useRef<any>(null);

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

        // Skala dihitung berdasarkan lebar flipbook dan devicePixelRatio
        // Agar kualitas tajam, gunakan 2x devicePixelRatio, maksimal 3x
        const scale = Math.min(3, Math.max(1, (flipbookWidth / 200) * 2));

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const viewportPdf = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.width = viewportPdf.width;
          canvas.height = viewportPdf.height;
          await page.render({ canvasContext: context, viewport: viewportPdf })
            .promise;
          pageImages.push(canvas.toDataURL("image/png"));
        }
        setPages(pageImages);
      } catch (err: any) {
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
  }, [flipbookWidth]); // ulangi jika lebar flipbook berubah

  const handlePageChange = (e: any) => {
    setCurrentPage(e.data as number);
  };

  const nextPage = () => flipBookRef.current?.pageFlip().flipNext();
  const prevPage = () => flipBookRef.current?.pageFlip().flipPrev();

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
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-lg font-semibold">📖 Katalog Produk</h1>
        <span className="text-sm text-gray-300">
          {currentPage} / {numPages}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-800 p-2 sm:p-4 overflow-hidden">
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

      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-gray-800 border-t border-gray-700">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          ← Sebelumnya
        </button>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          Berikutnya →
        </button>
      </div>
    </div>
  );
}
