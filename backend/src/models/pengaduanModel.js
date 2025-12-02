const db = require('../config/database');

const Pengaduan = {
    // 1. Warga Buat Laporan
    create: async (data) => {
        const { user_id, judul_laporan, isi_laporan, foto_bukti } = data;
        const query = `
            INSERT INTO pengaduan (user_id, judul_laporan, isi_laporan, foto_bukti, status)
            VALUES (?, ?, ?, ?, 'pending')
        `;
        const [result] = await db.query(query, [user_id, judul_laporan, isi_laporan, foto_bukti]);
        return result;
    },

    // 2. Ambil Riwayat User (Warga)
    findByUserId: async (userId) => {
        const query = `
            SELECT * FROM pengaduan 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },

    // 3. Ambil Semua (Admin) - Join dengan Tabel User untuk tahu pelapornya
    getAll: async () => {
        const query = `
            SELECT p.*, u.name as pelapor, u.nik 
            FROM pengaduan p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    // 4. Ambil Detail + Tindak Lanjut (Responses)
    getByIdWithRespon: async (id) => {
        // Ambil data pengaduan
        const [pengaduan] = await db.query(`
            SELECT p.*, u.name as pelapor 
            FROM pengaduan p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?
        `, [id]);

        if (pengaduan.length === 0) return null;

        // Ambil data tindak lanjut (balasan admin)
        const [tindakLanjut] = await db.query(`
            SELECT t.*, u.name as admin_name 
            FROM tindak_lanjut_pengaduan t
            JOIN users u ON t.admin_id = u.id
            WHERE t.pengaduan_id = ?
            ORDER BY t.tgl_tindak_lanjut ASC
        `, [id]);

        return { ...pengaduan[0], responses: tindakLanjut };
    },

    // 5. Admin Menjawab (Tindak Lanjut)
    addTindakLanjut: async (data) => {
        const { pengaduan_id, admin_id, respon, status_baru } = data;
        
        // a. Simpan pesan balasan
        await db.query(`
            INSERT INTO tindak_lanjut_pengaduan (pengaduan_id, admin_id, respon)
            VALUES (?, ?, ?)
        `, [pengaduan_id, admin_id, respon]);

        // b. Update status pengaduan utama
        await db.query(`
            UPDATE pengaduan SET status = ? WHERE id = ?
        `, [status_baru, pengaduan_id]);

        return true;
    }
};

module.exports = Pengaduan;