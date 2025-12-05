-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'WALISANTRI', 'GURU') NOT NULL DEFAULT 'WALISANTRI',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Walisantri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` TEXT NOT NULL,
    `no_hp` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Walisantri_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guru` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Guru_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Santri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATETIME(3) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `guru_id` INTEGER NOT NULL DEFAULT 1,
    `walisantri_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_hafalan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hafalan_id` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `surah` VARCHAR(191) NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `ayat_mulai` INTEGER NULL,
    `ayat_selesai` INTEGER NULL,
    `halaman` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL,
    `catatan` TEXT NULL,
    `guru_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `history_hafalan_hafalan_id_idx`(`hafalan_id`),
    INDEX `history_hafalan_guru_id_idx`(`guru_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HafalanSantri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `santri_id` INTEGER NOT NULL,
    `guru_id` INTEGER NOT NULL DEFAULT 1,
    `halaman` INTEGER NOT NULL DEFAULT 0,
    `tanggal` DATETIME(3) NOT NULL,
    `jenis` ENUM('ZIYADAH', 'MUROJA', 'TASMI') NOT NULL,
    `surah` VARCHAR(191) NOT NULL,
    `ayat_mulai` INTEGER NOT NULL,
    `ayat_selesai` INTEGER NOT NULL,
    `catatan` TEXT NULL,
    `status` ENUM('LULUS', 'MENGULANG', 'BELUM_HAFALAN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Walisantri` ADD CONSTRAINT `Walisantri_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guru` ADD CONSTRAINT `Guru_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Santri` ADD CONSTRAINT `Santri_guru_id_fkey` FOREIGN KEY (`guru_id`) REFERENCES `Guru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Santri` ADD CONSTRAINT `Santri_walisantri_id_fkey` FOREIGN KEY (`walisantri_id`) REFERENCES `Walisantri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_hafalan` ADD CONSTRAINT `history_hafalan_hafalan_id_fkey` FOREIGN KEY (`hafalan_id`) REFERENCES `HafalanSantri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_hafalan` ADD CONSTRAINT `history_hafalan_guru_id_fkey` FOREIGN KEY (`guru_id`) REFERENCES `Guru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HafalanSantri` ADD CONSTRAINT `HafalanSantri_santri_id_fkey` FOREIGN KEY (`santri_id`) REFERENCES `Santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HafalanSantri` ADD CONSTRAINT `HafalanSantri_guru_id_fkey` FOREIGN KEY (`guru_id`) REFERENCES `Guru`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
