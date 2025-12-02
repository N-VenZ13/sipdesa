const Pengaduan = require('../models/pengaduanModel');

// 1. User: Buat Pengaduan
exports.buatPengaduan = async (req, res) => {
    try {
        const { judul, isi } = req.body;
        const foto = req.file ? req.file.path : null; // Foto opsional

        if (!judul || !isi) {
            return res.status(400).json({ message: 'Judul dan Isi laporan wajib diisi!' });
        }

        await Pengaduan.create({
            user_id: req.user.id,
            judul_laporan: judul,
            isi_laporan: isi,
            foto_bukti: foto
        });

        res.status(201).json({ message: 'Laporan berhasil dikirim!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengirim laporan' });
    }
};

// 2. User: Lihat Riwayat
exports.getRiwayatSaya = async (req, res) => {
    try {
        const data = await Pengaduan.findByUserId(req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error mengambil data' });
    }
};

// 3. Admin: Lihat Semua Laporan
exports.getAllPengaduan = async (req, res) => {
    try {
        const data = await Pengaduan.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};

// 4. Admin: Lihat Detail & Balasan
exports.getDetailPengaduan = async (req, res) => {
    try {
        const data = await Pengaduan.getByIdWithRespon(req.params.id);
        if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};

// 5. Admin: Kirim Tindak Lanjut (Balasan)
exports.tanggapiPengaduan = async (req, res) => {
    try {
        const { id } = req.params; // ID Pengaduan
        const { respon, status } = req.body;

        await Pengaduan.addTindakLanjut({
            pengaduan_id: id,
            admin_id: req.user.id,
            respon,
            status_baru: status // 'ditindak' atau 'selesai'
        });

        res.json({ message: 'Tanggapan berhasil dikirim!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menanggapi laporan' });
    }
};