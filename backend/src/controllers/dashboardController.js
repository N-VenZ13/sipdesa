const db = require('../config/database');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Query Statistik Angka (Parallel)
        const [totalSurat] = await db.query('SELECT COUNT(*) as total FROM pengajuan_surat');
        const [suratPending] = await db.query('SELECT COUNT(*) as total FROM pengajuan_surat WHERE status = "diajukan" OR status = "diproses"');
        const [suratSelesai] = await db.query('SELECT COUNT(*) as total FROM pengajuan_surat WHERE status = "selesai"');
        const [totalPengaduan] = await db.query('SELECT COUNT(*) as total FROM pengaduan WHERE status = "pending"');
        const [totalWarga] = await db.query('SELECT COUNT(*) as total FROM users WHERE role_id = 2');

        // 2. Query Aktivitas Terbaru (Surat & Pengaduan)
        // Ambil 5 surat terakhir
        const [recentSurat] = await db.query(`
            SELECT p.id, u.name as user_name, l.nama_surat as title, p.created_at, 'surat' as type 
            FROM pengajuan_surat p
            JOIN users u ON p.user_id = u.id
            JOIN layanan_surat l ON p.layanan_id = l.id
            ORDER BY p.created_at DESC LIMIT 5
        `);

        // Ambil 5 pengaduan terakhir
        const [recentAduan] = await db.query(`
            SELECT p.id, u.name as user_name, p.judul_laporan as title, p.created_at, 'aduan' as type
            FROM pengaduan p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC LIMIT 5
        `);

        // 3. Gabungkan dan Sortir Aktivitas
        const allActivities = [...recentSurat, ...recentAduan]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Urutkan dari yang paling baru
            .slice(0, 5); // Ambil 5 teratas saja

        // 4. Kirim Response
        res.json({
            stats: {
                surat_masuk: totalSurat[0].total,
                surat_pending: suratPending[0].total, // Yang perlu dikerjakan
                surat_selesai: suratSelesai[0].total,
                pengaduan_pending: totalPengaduan[0].total,
                warga_total: totalWarga[0].total
            },
            recent_activities: allActivities
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data dashboard' });
    }
};