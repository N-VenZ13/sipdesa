const jwt = require('jsonwebtoken');

// Fungsi untuk mengecek Token
const verifyToken = (req, res, next) => {
    // 1. Ambil token dari Header (Authorization: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Ambil kode setelah kata 'Bearer'

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak! Anda belum login.' });
    }

    try {
        // 2. Cek keaslian token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Simpan data user ke dalam request agar bisa dipakai di Controller nanti
        req.user = decoded; 
        
        next(); // Lanjut ke fungsi berikutnya (Controller)
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid atau kadaluwarsa.' });
    }
};

module.exports = verifyToken;