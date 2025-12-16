require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./src/config/database'); // Import koneksi DB

// path 
const path = require('path');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const informasiRoutes = require('./src/routes/informasiRoutes');
const suratRoutes = require('./src/routes/suratRoutes');
const pengaduanRoutes = require('./src/routes/pengaduanRoutes');
const userRoutes = require('./src/routes/userRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 1. SETUP FOLDER PUBLIC (Untuk File Upload & React Build) ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public'))); // Backup akses folder

// --- 2. ROUTING API ---
app.use('/api/auth', authRoutes);
app.use('/api/informasi', informasiRoutes);
app.use('/api/surat', suratRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- 3. ROUTE UTAMA (SERVE REACT APP) ---
// Jika route tidak dikenali sebagai API, kirimkan file React (Frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// path static untuk gambar
// app.use(express.urlencoded({ extended: true }));
// app.use('/public', express.static(path.join(__dirname, 'public')));

// // Routing API
// app.use('/api/auth', authRoutes);
// app.use('/api/informasi', informasiRoutes);
// app.use('/api/surat', suratRoutes);
// app.use('/api/pengaduan', pengaduanRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/dashboard', dashboardRoutes);


// // Test Route
// app.get('/', (req, res) => {
//   res.json({ message: 'API SIP Desa Ready 🚀' });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });