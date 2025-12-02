const Surat = require('../models/suratModel');

// 1. Warga Mengajukan Surat
exports.ajukanSurat = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File persyaratan wajib diupload!' });
        }

        const data = {
            user_id: req.user.id, // Dari token
            layanan_id: req.body.layanan_id,
            data_request: JSON.parse(req.body.data_request || '{}'), // Form isian dinamis
            file_persyaratan: req.file.path // Path file upload dari Multer
        };

        await Surat.create(data);
        res.status(201).json({ message: 'Surat berhasil diajukan! Tunggu konfirmasi admin.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengajukan surat', error });
    }
};

// 2. Admin Melihat Daftar Surat Masuk
exports.getAllSurat = async (req, res) => {
    try {
        const data = await Surat.findAll();
        // Parse JSON data_request agar rapi saat dikirim ke frontend
        const parsedData = data.map(item => ({
            ...item,
            data_request: typeof item.data_request === 'string' ? JSON.parse(item.data_request) : item.data_request
        }));
        res.json(parsedData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 3. Warga Melihat Riwayat Sendiri
exports.getMySurat = async (req, res) => {
    try {
        const data = await Surat.findByUserId(req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 4. Admin Update Status (Setujui/Tolak)
exports.updateStatusSurat = async (req, res) => {
    const { id } = req.params;
    const { status, keterangan, nomor_surat } = req.body;
    
    // Jika ada file surat balasan dari admin (opsional)
    const file_hasil = req.file ? req.file.path : null;

    try {
        await Surat.updateStatus(id, status, keterangan, nomor_surat, file_hasil);
        res.json({ message: `Status surat berhasil diubah menjadi ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Gagal update status' });
    }
};