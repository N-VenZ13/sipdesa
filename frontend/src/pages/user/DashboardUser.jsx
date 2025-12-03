import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  FaPlus, FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle, 
  FaBullhorn, FaNewspaper, FaArrowRight, FaUserCircle 
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const DashboardUser = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth); // Ambil nama user dari Redux

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const response = await api.get('/surat/riwayat');
        setRiwayat(response.data);
      } catch (error) {
        console.error("Gagal load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      selesai: 'bg-green-100 text-green-700 border-green-200',
      ditolak: 'bg-red-100 text-red-700 border-red-200',
      diajukan: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      diproses: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* 1. HERO SECTION (Sapaan) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
            <FaUserCircle className="text-blue-300" /> 
            Halo, {user?.name || 'Warga'}!
          </h1>
          <p className="text-blue-100 text-lg">
            Selamat datang di Portal Pelayanan Digital Desa Sukatani. Apa yang bisa kami bantu hari ini?
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 text-center">
            <p className="text-sm font-medium text-blue-100">Status Akun</p>
            <p className="text-xl font-bold flex items-center gap-2 justify-center">
              <FaCheckCircle className="text-green-400" /> Aktif / Terverifikasi
            </p>
          </div>
        </div>
      </div>

      {/* 2. MENU CEPAT (Quick Actions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Ajukan Surat */}
        <Link to="/user/ajukan" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-blue-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
              <FaFileAlt size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Ajukan Surat</h3>
              <p className="text-gray-500 text-sm">Buat permohonan surat baru</p>
            </div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-blue-500" />
          </div>
        </Link>

        {/* Card Pengaduan */}
        <Link to="/user/pengaduan" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-red-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
              <FaBullhorn size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Lapor Masalah</h3>
              <p className="text-gray-500 text-sm">Sampaikan keluhan Anda</p>
            </div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-red-500" />
          </div>
        </Link>

        {/* Card Info */}
        <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-green-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition">
              <FaNewspaper size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Info Desa</h3>
              <p className="text-gray-500 text-sm">Berita & Pengumuman</p>
            </div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-green-500" />
          </div>
        </div>
      </div>

      {/* 3. RIWAYAT TERBARU (Modern List) */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <FaClock className="text-blue-500" /> Riwayat Aktivitas
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border">
            {riwayat.length} Permohonan
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : riwayat.length === 0 ? (
            <div className="p-12 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="Empty" className="w-24 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 font-medium">Belum ada aktivitas.</p>
              <Link to="/user/ajukan" className="text-blue-600 hover:underline text-sm mt-2 block">Mulai buat pengajuan</Link>
            </div>
          ) : (
            riwayat.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Kiri: Ikon & Detail */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full mt-1 ${
                    item.status === 'selesai' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <FaFileAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{item.nama_surat}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Diajukan pada: {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    
                    {/* Pesan Admin (Jika ada) */}
                    {item.keterangan_admin && (
                      <div className="mt-2 text-xs bg-gray-100 p-2 rounded text-gray-600 inline-block border">
                        💬 Admin: {item.keterangan_admin}
                      </div>
                    )}
                  </div>
                </div>

                {/* Kanan: Status & Aksi */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  {getStatusBadge(item.status)}
                  
                  {item.status === 'selesai' && item.file_hasil && (
                    <a 
                      href={`http://localhost:5000/${item.file_hasil}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold border-b border-blue-200 hover:border-blue-600 transition"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardUser;