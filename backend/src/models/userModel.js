const db = require('../config/database');

const User = {
    // Cari user berdasarkan email
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Buat user baru (Register)
    create: async (data) => {
        const { role_id, nik, name, email, password, phone } = data;
        const [result] = await db.query(
            'INSERT INTO users (role_id, nik, name, email, password, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [role_id, nik, name, email, password, phone]
        );
        return result;
    },
    
    // Cari user berdasarkan ID (untuk Profile nanti)
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, role_id, nik, name, email, phone, address FROM users WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = User;