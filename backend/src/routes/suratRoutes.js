const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { ajukanSurat, getAllSurat, getMySurat, updateStatusSurat } = require('../controllers/suratController');

router.use(verifyToken); // Semua harus login

// Warga: Ajukan Surat (Upload File 'syarat')
router.post('/ajukan', upload.single('syarat'), ajukanSurat);

// Warga: Lihat Riwayat
router.get('/riwayat', getMySurat);

// Admin: Lihat Semua Surat Masuk
router.get('/admin/list', getAllSurat);

// Admin: Update Status (Bisa upload file 'surat_jadi' jika selesai)
router.put('/admin/verifikasi/:id', upload.single('surat_jadi'), updateStatusSurat);

module.exports = router;