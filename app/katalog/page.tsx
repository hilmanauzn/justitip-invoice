"use client";

import dynamic from "next/dynamic";

const KatalogFlipbook = dynamic(() => import("./KatalogClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <p>Memuat katalog...</p>
    </div>
  ),
});

export default function KatalogPage() {
  return <KatalogFlipbook />;
}
