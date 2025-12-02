const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getAllInformasi, createInformasi, deleteInformasi } = require('../controllers/informasiController');

// Semua route di bawah ini diproteksi oleh Satpam (verifyToken)
router.use(verifyToken); 

router.get('/', getAllInformasi);         // GET /api/informasi
router.post('/', createInformasi);        // POST /api/informasi
router.delete('/:id', deleteInformasi);   // DELETE /api/informasi/:id

module.exports = router;