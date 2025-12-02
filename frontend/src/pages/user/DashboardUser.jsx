import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaPlus, FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const DashboardUser = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data riwayat surat saya
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

  // Helper ikon status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'selesai': return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'ditolak': return <FaTimesCircle className="text-red-500 text-xl" />;
      default: return <FaClock className="text-yellow-500 text-xl" />;
    }
  };

  return (
    <div>
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Halo, Warga!</h1>
          <p className="text-gray-600">Selamat datang di layanan administrasi mandiri.</p>
        </div>
        <Link 
          to="/user/ajukan" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> Buat Pengajuan Baru
        </Link>
      </div>

      {/* List Riwayat */}
      <h3 className="text-xl font-semibold mb-4 border-l-4 border-blue-500 pl-3">Riwayat Pengajuan Anda</h3>
      
      <div className="grid gap-4">
        {isLoading ? (
          <p>Memuat data...</p>
        ) : riwayat.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            Belum ada pengajuan surat. Silakan ajukan surat baru.
          </div>
        ) : (
          riwayat.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex justify-between items-center border-l-4 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <FaFileAlt size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{item.nama_surat}</h4>
                  <p className="text-sm text-gray-500">
                    Diajukan pada: {new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {/* Tampilkan pesan admin jika ada */}
                  {item.keterangan_admin && (
                    <p className="text-sm text-red-500 mt-1 italic">"Catatan Admin: {item.keterangan_admin}"</p>
                  )}
                  {/* Tombol Download jika selesai */}
                  {item.status === 'selesai' && item.file_hasil && (
                     <a href={`http://localhost:5000/${item.file_hasil}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-bold hover:underline mt-1 block">
                       Download Surat Hasil
                     </a>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  {getStatusIcon(item.status)}
                  <span className="capitalize font-semibold text-gray-700">{item.status}</span>
                </div>
                {item.status === 'selesai' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">No: {item.nomor_surat}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardUser;