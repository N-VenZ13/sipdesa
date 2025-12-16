-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2025 at 04:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sip_desa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `informasi_publik`
--

CREATE TABLE `informasi_publik` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `kategori` enum('berita','pengumuman','layanan') DEFAULT 'berita',
  `judul` varchar(200) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `konten` text NOT NULL,
  `gambar_thumbnail` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `informasi_publik`
--

INSERT INTO `informasi_publik` (`id`, `author_id`, `kategori`, `judul`, `slug`, `konten`, `gambar_thumbnail`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 'pengumuman', 'Jadwal Pelayanan Kantor Desa', 'jadwal-pelayanan-kantor-desa', 'Pelayanan dibuka setiap hari Senin - Jumat pukul 08.00 - 15.00 WIB.', NULL, 1, '2025-11-27 04:24:49', '2025-11-27 04:24:49'),
(3, 1, 'berita', 'Jadwal Posyandu Kampung II', 'jadwal-posyandu-kampung-ii', 'Bagi yang mau datang ke posyandu harap catat tanggalnya pada 12 januari 2026', NULL, 1, '2025-12-16 15:21:11', '2025-12-16 15:21:11');

-- --------------------------------------------------------

--
-- Table structure for table `layanan_surat`
--

CREATE TABLE `layanan_surat` (
  `id` int(11) NOT NULL,
  `kode_surat` varchar(20) NOT NULL,
  `nama_surat` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `persyaratan` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `layanan_surat`
--

INSERT INTO `layanan_surat` (`id`, `kode_surat`, `nama_surat`, `deskripsi`, `persyaratan`, `is_active`, `created_at`) VALUES
(1, 'SKD', 'Surat Keterangan Domisili', 'Surat untuk menerangkan domisili tempat tinggal.', 'KTP, KK', 1, '2025-11-27 04:24:41'),
(2, 'SKU', 'Surat Keterangan Usaha', 'Surat untuk keperluan izin usaha mikro.', 'KTP, Bukti Usaha', 1, '2025-11-27 04:24:41'),
(3, 'SKTM', 'Surat Keterangan Tidak Mampu', 'Surat untuk keperluan bantuan sosial/sekolah.', 'KTP, KK, Foto Rumah', 1, '2025-11-27 04:24:41');

-- --------------------------------------------------------

--
-- Table structure for table `logs_aktivitas`
--

CREATE TABLE `logs_aktivitas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan`
--

CREATE TABLE `pengaduan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `judul_laporan` varchar(150) NOT NULL,
  `isi_laporan` text NOT NULL,
  `foto_bukti` varchar(255) DEFAULT NULL,
  `status` enum('pending','ditindak','selesai') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengaduan`
--

INSERT INTO `pengaduan` (`id`, `user_id`, `judul_laporan`, `isi_laporan`, `foto_bukti`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'Lampu jalan mati', 'Di depan Poskamling RT 2 mohon segera di perbaiki', 'public\\uploads\\1764639355917-80492860.png', 'selesai', '2025-12-02 01:35:55', '2025-12-02 01:37:47'),
(2, 3, 'Lembu Telepas Pak kades', 'Ada Lembu Liar masuk rumah pak kemas, mohon di bantu', NULL, 'ditindak', '2025-12-03 10:12:36', '2025-12-03 10:14:08'),
(3, 3, 'Kucing terlepas pak kades', 'di rumah pak mamat lepas tolong ditindak secepatnya', 'public\\uploads\\1764821536906-150184865.png', 'pending', '2025-12-04 04:12:16', '2025-12-04 04:12:16');

-- --------------------------------------------------------

--
-- Table structure for table `pengajuan_surat`
--

CREATE TABLE `pengajuan_surat` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `layanan_id` int(11) NOT NULL,
  `nomor_surat` varchar(100) DEFAULT NULL,
  `status` enum('diajukan','diproses','selesai','ditolak') DEFAULT 'diajukan',
  `data_request` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_request`)),
  `file_persyaratan` varchar(255) DEFAULT NULL,
  `file_hasil` varchar(255) DEFAULT NULL,
  `keterangan_admin` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengajuan_surat`
--

INSERT INTO `pengajuan_surat` (`id`, `user_id`, `layanan_id`, `nomor_surat`, `status`, `data_request`, `file_persyaratan`, `file_hasil`, `keterangan_admin`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '470/001/DS/2023', 'selesai', '{\"keperluan\":\"Syarat masukk anak sekolah\",\"keterangan_tambahan\":\"\"}', 'public\\uploads\\1764637719660-667355056.pdf', NULL, 'Surat telah terbit', '2025-12-02 01:08:39', '2025-12-02 01:09:32'),
(2, 2, 2, '123', 'selesai', '{\"keperluan\":\"persyaratan bang\",\"keterangan_tambahan\":\"\"}', 'public\\uploads\\1764645460569-271803017.pdf', NULL, 'Surat diterbitkan', '2025-12-02 03:17:40', '2025-12-02 03:17:58'),
(3, 3, 3, '12345676543212345678', 'selesai', '{\"keperluan\":\"Persyaratan Beasiswa\",\"keterangan_tambahan\":\"Untuk anak saya Kuliah\"}', 'public\\uploads\\1764756809588-209320441.png', NULL, 'Surat diterbitkan', '2025-12-03 10:13:29', '2025-12-03 10:26:37'),
(4, 3, 3, NULL, 'diajukan', '{\"keperluan\":\"Persyaratan beasiswa anak\",\"keterangan_tambahan\":\"\"}', 'public\\uploads\\1764821411467-562800759.pdf', NULL, NULL, '2025-12-04 04:10:11', '2025-12-04 04:10:11');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `created_at`) VALUES
(1, 'admin', '2025-11-27 04:24:41'),
(2, 'user', '2025-11-27 04:24:41');

-- --------------------------------------------------------

--
-- Table structure for table `tindak_lanjut_pengaduan`
--

CREATE TABLE `tindak_lanjut_pengaduan` (
  `id` int(11) NOT NULL,
  `pengaduan_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `respon` text NOT NULL,
  `tgl_tindak_lanjut` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tindak_lanjut_pengaduan`
--

INSERT INTO `tindak_lanjut_pengaduan` (`id`, `pengaduan_id`, `admin_id`, `respon`, `tgl_tindak_lanjut`) VALUES
(1, 1, 1, 'Terima kasih laporannya Pak Budi. Petugas akan segera memperbaiki besok pagi.', '2025-12-02 01:36:37'),
(2, 1, 1, 'okey baik jalanan sudah di perbaiki', '2025-12-02 01:37:17'),
(3, 1, 1, 'sudah kan pak budi', '2025-12-02 01:37:32'),
(4, 1, 1, 'sudah di seleikan ', '2025-12-02 01:37:47'),
(5, 2, 1, 'Okey sebentar Bombe Datang', '2025-12-03 10:14:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `nik` varchar(16) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `nik`, `name`, `email`, `password`, `phone`, `address`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, '3201000000000001', 'Admin Desa', 'admin@desa.id', '$2b$10$D/NR949nZIIelUmCVui7O.PQeVf.s9RpBuE8d/KLiCDzY9O90hTQK', '081234567890', 'Kantor Desa', 1, '2025-11-27 04:24:41', '2025-12-01 12:11:14'),
(2, 2, '3201000000000002', 'Budi Warga', 'budi@warga.com', '$2b$10$D/NR949nZIIelUmCVui7O.PQeVf.s9RpBuE8d/KLiCDzY9O90hTQK', '089876543210', 'Jl. Mawar No. 10', 1, '2025-11-27 04:24:41', '2025-12-01 12:11:14'),
(3, 2, '123456765432', 'noven', 'noven@gmail.com', '$2b$10$myml4Z95f3OV5GxhLQfgvuLdHJIOLr9DIr4yGNWlhsKUfx99Q9GTW', '083827302201', 'bandar lampunggg', 1, '2025-12-02 15:21:47', '2025-12-02 15:27:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `informasi_publik`
--
ALTER TABLE `informasi_publik`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `layanan_surat`
--
ALTER TABLE `layanan_surat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_surat` (`kode_surat`);

--
-- Indexes for table `logs_aktivitas`
--
ALTER TABLE `logs_aktivitas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pengajuan_surat`
--
ALTER TABLE `pengajuan_surat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `layanan_id` (`layanan_id`),
  ADD KEY `idx_pengajuan_status` (`status`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `tindak_lanjut_pengaduan`
--
ALTER TABLE `tindak_lanjut_pengaduan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengaduan_id` (`pengaduan_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik` (`nik`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_role` (`role_id`),
  ADD KEY `idx_user_email` (`email`),
  ADD KEY `idx_user_nik` (`nik`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `informasi_publik`
--
ALTER TABLE `informasi_publik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `layanan_surat`
--
ALTER TABLE `layanan_surat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `logs_aktivitas`
--
ALTER TABLE `logs_aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaduan`
--
ALTER TABLE `pengaduan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pengajuan_surat`
--
ALTER TABLE `pengajuan_surat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tindak_lanjut_pengaduan`
--
ALTER TABLE `tindak_lanjut_pengaduan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `informasi_publik`
--
ALTER TABLE `informasi_publik`
  ADD CONSTRAINT `informasi_publik_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD CONSTRAINT `pengaduan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengajuan_surat`
--
ALTER TABLE `pengajuan_surat`
  ADD CONSTRAINT `pengajuan_surat_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengajuan_surat_ibfk_2` FOREIGN KEY (`layanan_id`) REFERENCES `layanan_surat` (`id`);

--
-- Constraints for table `tindak_lanjut_pengaduan`
--
ALTER TABLE `tindak_lanjut_pengaduan`
  ADD CONSTRAINT `tindak_lanjut_pengaduan_ibfk_1` FOREIGN KEY (`pengaduan_id`) REFERENCES `pengaduan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tindak_lanjut_pengaduan_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
