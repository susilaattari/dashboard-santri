const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Jumlah nomor halaman yang ditampilkan

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Info */}
        <div className="text-sm text-gray-700">
          Menampilkan{" "}
          <span className="font-medium">
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
          </span>{" "}
          -{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          dari <span className="font-medium">{totalItems}</span> data
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {currentPage > 3 && totalPages > 5 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="px-3 py-2 text-gray-500">...</span>
                )}
              </>
            )}

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages - 2 && totalPages > 5 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-3 py-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        {/* Items per page selector */}
        <select
          value={itemsPerPage}
          onChange={(e) => onPageChange(1, Number(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>5 per halaman</option>
          <option value={10}>10 per halaman</option>
          <option value={25}>25 per halaman</option>
          <option value={50}>50 per halaman</option>
          <option value={100}>100 per halaman</option>
        </select>
      </div>
    </div>
  );
};
export default Pagination;
