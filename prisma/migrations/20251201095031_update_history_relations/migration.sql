/*
  Warnings:

  - Added the required column `santri_id` to the `history_hafalan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history_hafalan` ADD COLUMN `santri_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `history_hafalan_santri_id_idx` ON `history_hafalan`(`santri_id`);

-- AddForeignKey
ALTER TABLE `history_hafalan` ADD CONSTRAINT `history_hafalan_santri_id_fkey` FOREIGN KEY (`santri_id`) REFERENCES `Santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
