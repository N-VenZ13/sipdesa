// File: backend/fix_admin.js
const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

const updatePassword = async () => {
    try {
        const passwordPlain = '123456';
        // Enkripsi password
        const hashedPassword = await bcrypt.hash(passwordPlain, 10);
        
        console.log('🔑 Hash baru generated:', hashedPassword);

        // Update User Admin
        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE email = ?', 
            [hashedPassword, 'admin@desa.id']
        );

        // Update User Warga (Budi) sekalian
        await db.query(
            'UPDATE users SET password = ? WHERE email = ?', 
            [hashedPassword, 'budi@warga.com']
        );

        console.log('✅ Password Admin & User berhasil di-reset menjadi: 123456');
        process.exit();
    } catch (error) {
        console.error('❌ Gagal update:', error);
        process.exit(1);
    }
};

updatePassword();