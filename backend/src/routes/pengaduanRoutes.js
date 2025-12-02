const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { 
    buatPengaduan, 
    getRiwayatSaya, 
    getAllPengaduan, 
    getDetailPengaduan,
    tanggapiPengaduan 
} = require('../controllers/pengaduanController');

router.use(verifyToken);

// --- ROUTES WARGA ---
// Upload 'bukti' (nama field di frontend nanti harus 'bukti')
router.post('/', upload.single('bukti'), buatPengaduan);
router.get('/riwayat', getRiwayatSaya);

// --- ROUTES ADMIN ---
router.get('/admin', getAllPengaduan);
router.get('/:id', getDetailPengaduan); // Lihat detail + chat
router.post('/:id/tanggapi', tanggapiPengaduan);

module.exports = router;