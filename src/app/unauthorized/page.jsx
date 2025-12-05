import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div
      className="w-full min-h-screen flex justify-center items-center px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/daqu-iamage.png')", // GANTI DENGAN GAMBAR KAMU
      }}
    >
      <div className="bg-white/70 backdrop-blur-md shadow-xl border border-white/30 rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Selamat Datang 👋
        </h1>

        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          di Dashboard Santri
        </h2>

        <p className="text-gray-700 mb-6">
          Untuk melanjutkan, Anda harus login terlebih dahulu.
        </p>

        <a
          href="/login"
          className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all shadow-md"
        >
          Login Sekarang
        </a>
      </div>
    </div>
  );
}
