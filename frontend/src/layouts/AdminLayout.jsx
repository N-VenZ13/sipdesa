import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // 1. Proteksi: Jika belum login, tendang ke Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Proteksi: Jika bukan Admin, tendang ke Dashboard User
  if (user?.role_id !== 1) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans">
      {/* Sidebar Kiri */}
      <Sidebar />
      
      {/* Konten Utama Kanan */}
      <div className="flex-1 flex flex-col">
        {/* Header Sederhana */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Panel Admin</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Halo, <b>{user?.name}</b></span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Isi Halaman Berubah-ubah disini */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;