// components/NextPageInfo.jsx
// Component untuk menampilkan info halaman berikutnya yang harus dihafal

import React, { useState, useEffect } from "react";

const NextPageInfo = ({ santriId, currentPage, onPageChange }) => {
  const [nextPageInfo, setNextPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (santriId) {
      fetchNextPage();
    }
  }, [santriId]);

  const fetchNextPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hafalan/next-page/${santriId}`);
      const data = await response.json();

      if (response.ok) {
        setNextPageInfo(data);

        // Auto-fill halaman berikutnya
        if (data.nextExpectedPage && onPageChange) {
          onPageChange(data.nextExpectedPage);
        }
      }
    } catch (error) {
      console.error("Error fetching next page:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-sm text-blue-700">Memuat info halaman...</span>
        </div>
      </div>
    );
  }

  if (!nextPageInfo) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-sm text-gray-800 mb-1">
            📖 Info Halaman
          </h4>

          {nextPageInfo.lastPage === 0 ? (
            <p className="text-sm text-gray-700">
              Santri ini belum memiliki hafalan. Mulai dari{" "}
              <span className="font-bold text-blue-600">halaman 1</span>
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Halaman terakhir yang dihafal:{" "}
                <span className="font-bold text-green-600">
                  {nextPageInfo.lastPage}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Halaman berikutnya:{" "}
                <span className="font-bold text-blue-600">
                  {nextPageInfo.nextExpectedPage}
                </span>
              </p>

              {nextPageInfo.totalPages > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {nextPageInfo.totalPages}/604 halaman (
                      {Math.round((nextPageInfo.totalPages / 604) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(nextPageInfo.totalPages / 604) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={fetchNextPage}
          className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          title="Refresh"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NextPageInfo;
