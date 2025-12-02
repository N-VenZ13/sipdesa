const db = require('../config/database');

const bcrypt = require('bcryptjs'); 


// 1. Ambil Semua User (Kecuali Password)
exports.getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT id, role_id, nik, name, email, phone, address, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. Tambah User Baru (Oleh Admin)
exports.createUser = async (req, res) => {
    const { nik, name, email, password, role_id, phone, address } = req.body;

    try {
        // Cek email/NIK duplikat
        const [exist] = await db.query('SELECT * FROM users WHERE email = ? OR nik = ?', [email, nik]);
        if (exist.length > 0) {
            return res.status(400).json({ message: 'Email atau NIK sudah terdaftar!' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert ke DB
        await db.query(
            'INSERT INTO users (role_id, nik, name, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [role_id || 2, nik, name, email, hashedPassword, phone, address]
        );

        res.status(201).json({ message: 'User berhasil ditambahkan!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat user' });
    }
};

// 2. Hapus User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    // Cegah Admin menghapus dirinya sendiri
    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'Anda tidak bisa menghapus akun sendiri!' });
    }

    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus user' });
    }
};

// 3. Edit User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nik, name, email, password, role_id, phone, address } = req.body;

    try {
        // Cek apakah user ada
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (user.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

        // Logic Update Password
        if (password) {
            // Jika admin mengisi password baru, hash ulang
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            await db.query(
                'UPDATE users SET nik=?, name=?, email=?, password=?, role_id=?, phone=?, address=? WHERE id=?',
                [nik, name, email, hashedPassword, role_id, phone, address, id]
            );
        } else {
            // Jika password kosong, jangan diupdate
            await db.query(
                'UPDATE users SET nik=?, name=?, email=?, role_id=?, phone=?, address=? WHERE id=?',
                [nik, name, email, role_id, phone, address, id]
            );
        }

        res.json({ message: 'Data user berhasil diperbarui!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal update user', error: error.message });
    }
};