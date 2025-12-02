const db = require('../config/database');

const Informasi = {
    // Ambil semua berita (terbaru di atas)
    getAll: async () => {
        const query = `
            SELECT i.*, u.name as author_name 
            FROM informasi_publik i
            JOIN users u ON i.author_id = u.id
            ORDER BY i.created_at DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    // Tambah berita baru
    create: async (data) => {
        const { author_id, judul, slug, konten, kategori } = data;
        const query = `
            INSERT INTO informasi_publik (author_id, judul, slug, konten, kategori)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [author_id, judul, slug, konten, kategori]);
        return result;
    },

    // Hapus berita
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM informasi_publik WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Informasi;