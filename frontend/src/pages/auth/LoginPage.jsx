import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { loginSuccess } from '../../redux/authSlice';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Kirim request ke Backend
      const response = await api.post('/auth/login', { email, password });
      
      // Jika sukses, simpan data ke Redux
      dispatch(loginSuccess(response.data));

      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: `Selamat datang, ${response.data.user.name}!`,
        timer: 1500,
        showConfirmButton: false
      });

      // Redirect berdasarkan Role
      if (response.data.user.role_id === 1) {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Login',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">SIP DESA LOGIN</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@desa.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
          >
            {isLoading ? 'Memproses...' : 'MASUK'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun? <span className="text-blue-500 cursor-pointer font-bold">Daftar disini</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;