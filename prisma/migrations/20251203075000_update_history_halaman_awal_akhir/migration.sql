/*
  Warnings:

  - You are about to drop the column `halaman` on the `hafalansantri` table. All the data in the column will be lost.
  - You are about to drop the column `halaman` on the `history_hafalan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `hafalansantri` DROP COLUMN `halaman`,
    ADD COLUMN `halaman_akhir` INTEGER NULL,
    ADD COLUMN `halaman_awal` INTEGER NULL,
    ADD COLUMN `juz` INTEGER NULL;

-- AlterTable
ALTER TABLE `history_hafalan` DROP COLUMN `halaman`,
    ADD COLUMN `halaman_akhir` INTEGER NULL,
    ADD COLUMN `halaman_awal` INTEGER NULL,
    ADD COLUMN `juz` INTEGER NULL;
