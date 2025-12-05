"use client";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function TambahSantri() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gurus, setGurus] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [walisantris, setWalisantris] = useState([]);
  const [santriData, setSantriData] = useState({
    nama: "",
    tanggal_lahir: "",
    kelas: "",
    walisantri_id: "",
    guru_id: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    // Jika bukan guru → redirect
    if (session?.user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);

  // Ambil data wali santri saat mount
  useEffect(() => {
    async function fetchWalisantri() {
      try {
        const res = await fetch("/api/walisantri");
        const data = await res.json();
        console.log("Wali Santri Data:", data);
        if (res.ok) {
          setWalisantris(data.data || []);
        } else {
          console.error("Gagal mengambil data wali santri");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchWalisantri();
  }, []);

  useEffect(() => {
    async function fetchGuru() {
      try {
        const res = await fetch("/api/guru");
        const data = await res.json();
        if (res.ok) {
          setGurus(data.data || []);
        }
      } catch (error) {
        console.error("Gagal fetch guru:", error);
      }
    }

    fetchGuru();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSantriData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!santriData.walisantri_id) {
      setMessage({ type: "error", text: "Silakan pilih wali santri" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/santri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(santriData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Santri berhasil ditambahkan!" });
        setSantriData({
          nama: "",
          tanggal_lahir: "",
          kelas: "",
          walisantri_id: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal menambahkan santri",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      {" "}
      <div className="max-w-2xl mx-auto pt-8">
        {" "}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {" "}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tambah Data Santri
          </h1>{" "}
          <p className="text-gray-600 mb-6">
            Isi data santri dan pilih wali santri yang sudah terdaftar
          </p>
          ```
          {/* Message Alert */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}
          {/* Form Santri */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Santri <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={santriData.nama}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Nama lengkap santri"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={santriData.tanggal_lahir}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guru Pembimbing <span className="text-red-500">*</span>
              </label>
              <select
                name="guru_id"
                value={santriData.guru_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Pilih Guru</option>
                {gurus.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                name="kelas"
                value={santriData.kelas}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Pilih Kelas</option>
                <option value="1A">Kelas 1A</option>
                <option value="1B">Kelas 1B</option>
                <option value="2A">Kelas 2A</option>
                <option value="2B">Kelas 2B</option>
                <option value="3A">Kelas 3A</option>
                <option value="3B">Kelas 3B</option>
                <option value="4A">Kelas 4A</option>
                <option value="4B">Kelas 4B</option>
                <option value="5A">Kelas 5A</option>
                <option value="5B">Kelas 5B</option>
                <option value="6A">Kelas 6A</option>
                <option value="6B">Kelas 6B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wali Santri <span className="text-red-500">*</span>
              </label>
              <select
                name="walisantri_id"
                value={santriData.walisantri_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Pilih Wali Santri</option>
                {walisantris.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nama} - {w.no_hp}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
                </>
              ) : (
                "Simpan Santri"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
