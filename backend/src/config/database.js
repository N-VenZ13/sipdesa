const mysql = require('mysql2');
require('dotenv').config();

// Buat pool koneksi (lebih efisien daripada single connection)
const db = mysql.createPool({
    host: process.env.DB_HOST, // dari .env
    user: process.env.DB_USER, // dari .env
    password: process.env.DB_PASSWORD, // dari .env
    database: process.env.DB_NAME, // sip_desa_db
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Cek koneksi saat aplikasi mulai
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database');
        connection.release();
    }
});

// Export versi promise agar bisa pakai async/await
module.exports = db.promise();