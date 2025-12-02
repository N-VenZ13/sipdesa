const Informasi = require('../models/informasiModel');

// 1. GET: Ambil semua data
exports.getAllInformasi = async (req, res) => {
    try {
        const data = await Informasi.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// 2. POST: Tambah data baru
exports.createInformasi = async (req, res) => {
    const { judul, konten, kategori } = req.body;
    
    // Validasi sederhana
    if (!judul || !konten) {
        return res.status(400).json({ message: 'Judul dan Konten wajib diisi!' });
    }

    // Buat Slug (URL friendly) dari Judul
    const slug = judul.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
        await Informasi.create({
            author_id: req.user.id, // Ambil ID dari token (hasil kerja Middleware tadi)
            judul,
            slug,
            konten,
            kategori: kategori || 'berita'
        });
        res.status(201).json({ message: 'Informasi berhasil diterbitkan!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menyimpan data', error });
    }
};

// 3. DELETE: Hapus data
exports.deleteInformasi = async (req, res) => {
    const { id } = req.params;
    try {
        await Informasi.delete(id);
        res.json({ message: 'Berita berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};