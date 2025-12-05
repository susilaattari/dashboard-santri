import React, { useState } from "react";
import { X, BookOpen, CheckCircle, Calendar, FileText } from "lucide-react";

const JuzDetailModal = ({ juzData, onClose }) => {
  if (!juzData) return null;

  const getStatusBadge = (status) => {
    const styles = {
      SELESAI: "bg-green-100 text-green-800 border-green-300",
      PROSES: "bg-yellow-100 text-yellow-800 border-yellow-300",
      BELUM_MULAI: "bg-gray-100 text-gray-800 border-gray-300",
    };

    const labels = {
      SELESAI: "Selesai",
      PROSES: "Sedang Proses",
      BELUM_MULAI: "Belum Dimulai",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Juz {juzData.juz}</h2>
              <p className="text-emerald-100">
                {juzData.startSurah} ({juzData.startAyat}) - {juzData.endSurah}{" "}
                ({juzData.endAyat})
              </p>
              <p className="text-sm text-emerald-100 mt-1">
                Halaman {juzData.startPage} - {juzData.endPage}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
          {/* Status & Progress */}
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Status Progress
                </h3>
                {getStatusBadge(juzData.status)}
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-600">
                  {juzData.percentage}%
                </div>
                <div className="text-sm text-gray-600">Selesai</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  juzData.status === "SELESAI"
                    ? "bg-green-500"
                    : juzData.status === "PROSES"
                    ? "bg-yellow-500"
                    : "bg-gray-300"
                }`}
                style={{ width: `${juzData.percentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{juzData.completedPages} halaman selesai</span>
              <span>{juzData.totalPages} total halaman</span>
            </div>
          </div>

          {/* Hafalan List */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Daftar Hafalan ({juzData.hafalanList?.length || 0})
            </h3>

            {!juzData.hafalanList || juzData.hafalanList.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Belum ada hafalan di juz ini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {juzData.hafalanList.map((hafalan, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Number Badge */}
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-bold">
                          {index + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">
                              {hafalan.surah}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Ayat {hafalan.ayatMulai} - {hafalan.ayatSelesai}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                            Hal. {hafalan.halaman}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(hafalan.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">
                              Lulus
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informasi Juz
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Halaman Awal:</span>
                <p className="text-blue-900 font-semibold">
                  {juzData.startPage}
                </p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">
                  Halaman Akhir:
                </span>
                <p className="text-blue-900 font-semibold">{juzData.endPage}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Surah Awal:</span>
                <p className="text-blue-900 font-semibold">
                  {juzData.startSurah} : {juzData.startAyat}
                </p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Surah Akhir:</span>
                <p className="text-blue-900 font-semibold">
                  {juzData.endSurah} : {juzData.endAyat}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo Component dengan Modal
const JuzProgressWithModal = () => {
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [juzList] = useState([
    {
      juz: 1,
      startPage: 1,
      endPage: 21,
      startSurah: "Al-Fatihah",
      startAyat: 1,
      endSurah: "Al-Baqarah",
      endAyat: 141,
      status: "SELESAI",
      percentage: 100,
      completedPages: 21,
      totalPages: 21,
      hafalanList: [
        {
          halaman: 1,
          surah: "Al-Fatihah",
          ayatMulai: 1,
          ayatSelesai: 7,
          tanggal: "2024-11-15",
        },
        {
          halaman: 2,
          surah: "Al-Baqarah",
          ayatMulai: 1,
          ayatSelesai: 5,
          tanggal: "2024-11-16",
        },
        {
          halaman: 21,
          surah: "Al-Baqarah",
          ayatMulai: 136,
          ayatSelesai: 141,
          tanggal: "2024-12-05",
        },
      ],
    },
    {
      juz: 2,
      startPage: 22,
      endPage: 41,
      startSurah: "Al-Baqarah",
      startAyat: 142,
      endSurah: "Al-Baqarah",
      endAyat: 252,
      status: "PROSES",
      percentage: 65,
      completedPages: 13,
      totalPages: 20,
      hafalanList: [
        {
          halaman: 22,
          surah: "Al-Baqarah",
          ayatMulai: 142,
          ayatSelesai: 150,
          tanggal: "2024-12-06",
        },
      ],
    },
    {
      juz: 3,
      startPage: 42,
      endPage: 61,
      startSurah: "Al-Baqarah",
      startAyat: 253,
      endSurah: "Ali 'Imran",
      endAyat: 92,
      status: "BELUM_MULAI",
      percentage: 0,
      completedPages: 0,
      totalPages: 20,
      hafalanList: [],
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Klik Juz untuk Detail
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {juzList.map((juz) => (
              <button
                key={juz.juz}
                onClick={() => setSelectedJuz(juz)}
                className={`relative rounded-xl p-4 transition-all duration-300 hover:scale-105 border-2 ${
                  juz.status === "SELESAI"
                    ? "bg-green-50 border-green-300 hover:shadow-lg hover:shadow-green-200"
                    : juz.status === "PROSES"
                    ? "bg-yellow-50 border-yellow-300 hover:shadow-lg hover:shadow-yellow-200"
                    : "bg-gray-50 border-gray-200 hover:shadow-lg"
                }`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${
                    juz.status === "SELESAI"
                      ? "text-green-600"
                      : juz.status === "PROSES"
                      ? "text-yellow-600"
                      : "text-gray-400"
                  }`}
                >
                  {juz.juz}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      juz.status === "SELESAI"
                        ? "bg-green-500"
                        : juz.status === "PROSES"
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                    style={{ width: `${juz.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  {juz.percentage}%
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedJuz && (
          <JuzDetailModal
            juzData={selectedJuz}
            onClose={() => setSelectedJuz(null)}
          />
        )}
      </div>
    </div>
  );
};

export default JuzProgressWithModal;
