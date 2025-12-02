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

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// path static untuk gambar
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routing API
app.use('/api/auth', authRoutes);
app.use('/api/informasi', informasiRoutes);
app.use('/api/surat', suratRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'API SIP Desa Ready 🚀' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});