const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getAllUsers, deleteUser, createUser, updateUser } = require('../controllers/userController');

// Middleware: Harus Login
router.use(verifyToken);

// Hanya Admin yang boleh akses (Tambahan cek role sederhana di logic controller/frontend nanti)
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;