import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Avatar / Logo */}
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-5xl mb-3">
          🍽️
        </div>

        {/* Nama brand */}
        <h1 className="text-2xl font-extrabold text-white drop-shadow-md">
          Justitip
        </h1>
        <p className="text-white/90 text-sm mt-1 text-center">
          Jastip Bandung & Jakarta
        </p>

        {/* Daftar tautan */}
        <div className="w-full mt-8 space-y-4">
          <Link
            href="/pos"
            className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="text-3xl">🛒</span>
            <div>
              <h2 className="font-bold text-gray-800">Point of Sales</h2>
              <p className="text-sm text-gray-500">Buat dan kelola pesanan</p>
            </div>
            <span className="ml-auto text-gray-400">›</span>
          </Link>

          <Link
            href="/katalog"
            className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="font-bold text-gray-800">Katalog Interaktif</h2>
              <p className="text-sm text-gray-500">
                Lihat produk dengan flipbook
              </p>
            </div>
            <span className="ml-auto text-gray-400">›</span>
          </Link>

          {/* Tambahkan link lain di sini jika perlu */}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-10 text-white/80 text-sm text-center">
          © {new Date().getFullYear()} RestoPOS
        </footer>
      </div>
    </div>
  );
}
