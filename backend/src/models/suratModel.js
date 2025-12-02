const db = require('../config/database');

const Surat = {
    // 1. Buat Pengajuan Baru (Warga)
    create: async (data) => {
        const { user_id, layanan_id, data_request, file_persyaratan } = data;
        const query = `
            INSERT INTO pengajuan_surat (user_id, layanan_id, data_request, file_persyaratan, status)
            VALUES (?, ?, ?, ?, 'diajukan')
        `;
        // data_request kita simpan sebagai JSON String
        const [result] = await db.query(query, [user_id, layanan_id, JSON.stringify(data_request), file_persyaratan]);
        return result;
    },

    // 2. Ambil Semua Surat (Untuk Admin)
    findAll: async () => {
        const query = `
            SELECT p.*, u.name as pemohon, u.nik, l.nama_surat, l.kode_surat
            FROM pengajuan_surat p
            JOIN users u ON p.user_id = u.id
            JOIN layanan_surat l ON p.layanan_id = l.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    // 3. Ambil Surat Milik User Tertentu (Untuk Riwayat Warga)
    findByUserId: async (userId) => {
        const query = `
            SELECT p.*, l.nama_surat 
            FROM pengajuan_surat p
            JOIN layanan_surat l ON p.layanan_id = l.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },

    // 4. Update Status (Untuk Admin: Setujui/Tolak)
    updateStatus: async (id, status, keterangan, nomor_surat, file_hasil) => {
        const query = `
            UPDATE pengajuan_surat 
            SET status = ?, keterangan_admin = ?, nomor_surat = ?, file_hasil = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [status, keterangan, nomor_surat, file_hasil, id]);
        return result;
    }
};

module.exports = Surat;