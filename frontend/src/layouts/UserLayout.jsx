import { Outlet, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const UserLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Proteksi: Kalau belum login, tendang ke login
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Proteksi: Kalau Admin iseng masuk sini, tendang ke Dashboard Admin
  if (user?.role_id === 1) return <Navigate to="/admin/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR ATAS */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/user/dashboard" className="text-xl font-bold flex items-center gap-2">
            🏛️ LAYANAN DESA
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/user/dashboard" className="hover:text-blue-200">Beranda</Link>
            <Link to="/user/ajukan" className="hover:text-blue-200">Ajukan Surat</Link>
            
            <div className="flex items-center gap-3 pl-6 border-l border-blue-400">
              <div className="flex items-center gap-2">
                <FaUser /> <span>{user?.name}</span>
              </div>
              <button 
                onClick={() => dispatch(logout())} 
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center gap-1 transition"
              >
                <FaSignOutAlt /> Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* KONTEN HALAMAN */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;