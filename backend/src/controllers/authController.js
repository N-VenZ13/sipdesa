const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); 

// 1. Logic REGISTER
exports.register = async (req, res) => {
    const { nik, name, email, password, phone } = req.body;

    try {
        // Cek apakah email sudah ada
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar!' });
        }

        // Hash Password (enkripsi)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke database (Default role_id = 2 untuk Warga)
        await User.create({
            role_id: 2, 
            nik,
            name,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

// 2. Logic LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cek user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Email tidak ditemukan' });
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        // Buat Token JWT
        const payload = {
            id: user.id,
            role_id: user.role_id,
            name: user.name
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                nik: user.nik,          
                phone: user.phone,      
                address: user.address   
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

exports.register = async (req, res) => {
    const { nik, name, email, password, phone, address } = req.body;

    try {
        // Validasi input dasar
        if (!nik || !name || !email || !password) {
            return res.status(400).json({ message: 'NIK, Nama, Email, dan Password wajib diisi!' });
        }

        // Cek apakah Email ATAU NIK sudah terdaftar
        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE email = ? OR nik = ?', 
            [email, nik]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email atau NIK sudah terdaftar!' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke database (Default role_id = 2 untuk Warga)
        await db.query(
            'INSERT INTO users (role_id, nik, name, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [2, nik, name, email, hashedPassword, phone || null, address || null]
        );

        res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};