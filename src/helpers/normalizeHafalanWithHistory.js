export function normalizeHafalanWithHistory(hafalanList) {
  const merged = [];

  hafalanList.forEach((h) => {
    // Masukkan hafalan utama jika valid
    if (h.status === "LULUS" && h.jenis === "ZIYADAH") {
      merged.push(h);
    }

    // Masukkan semua history valid
    if (Array.isArray(h.history)) {
      h.history.forEach((his) => {
        if (his.status === "LULUS" && his.jenis === "ZIYADAH") {
          merged.push({
            ...his,
            halaman: his.halaman, // pastikan halaman ikut
          });
        }
      });
    }
  });

  return merged;
}
