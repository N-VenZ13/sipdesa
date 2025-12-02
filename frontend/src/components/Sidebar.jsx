import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FaHome, FaEnvelopeOpenText, FaUsers, FaBullhorn, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const menus = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaHome /> },
    { name: 'Manajemen Surat', path: '/admin/surat', icon: <FaEnvelopeOpenText /> },
    { name: 'Pengaduan', path: '/admin/pengaduan', icon: <FaBullhorn /> },
    { name: 'Informasi Publik', path: '/admin/informasi', icon: <FaFileAlt /> },
    { name: 'Manajemen User', path: '/admin/users', icon: <FaUsers /> },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col transition-all duration-300">
      <div className="p-5 text-2xl font-bold border-b border-gray-700 flex items-center gap-2">
        🏛️ SIP DESA
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menus.map((menu, index) => (
          <Link 
            key={index} 
            to={menu.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
              location.pathname === menu.path 
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            {menu.icon}
            <span>{menu.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;