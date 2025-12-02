const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
                role_id: user.role_id
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};