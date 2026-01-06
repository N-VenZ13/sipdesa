import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { FaUserPlus, FaIdCard, FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi Sederhana
    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Konfirmasi password tidak cocok!', 'error');
      return;
    }
    if (formData.nik.length !== 16) {
      Swal.fire('Error', 'NIK harus 16 digit!', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Kirim data ke Backend
      await api.post('/auth/register', {
        nik: formData.nik,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        text: 'Silakan login dengan akun baru Anda.',
        confirmButtonText: 'Ke Halaman Login'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mendaftar',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">Buat Akun Baru</h2>
          <p className="text-gray-500">Silakan lengkapi data diri Anda untuk mendaftar layanan.</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* NIK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaIdCard />
              </div>
              <input 
                type="text" name="nik" maxLength="16" required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="16 digit NIK sesuai KTP"
                value={formData.nik} onChange={handleChange}
              />
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser />
              </div>
              <input 
                type="text" name="name" required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nama sesuai KTP"
                value={formData.name} onChange={handleChange}
              />
            </div>
          </div>

          {/* Email & No HP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" name="email" required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="contoh@email.com"
                  value={formData.email} onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaPhone />
                </div>
                <input 
                  type="text" name="phone"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0812..."
                  value={formData.phone} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input 
                  type="password" name="password" required minLength="6"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Min 6 karakter"
                  value={formData.password} onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ulangi Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input 
                  type="password" name="confirmPassword" required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ketik ulang password"
                  value={formData.confirmPassword} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? 'Memproses...' : <><FaUserPlus /> DAFTAR SEKARANG</>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Masuk disini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;