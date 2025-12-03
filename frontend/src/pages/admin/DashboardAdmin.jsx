import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  FaEnvelopeOpenText, 
  FaBullhorn, 
  FaUsers, 
  FaCheckCircle, 
  FaClock, 
  FaFileAlt 
} from 'react-icons/fa';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    surat_pending: 0,
    pengaduan_pending: 0,
    warga_total: 0,
    surat_selesai: 0
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil Data dari API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data.stats);
        setActivities(response.data.recent_activities);
      } catch (error) {
        console.error("Gagal load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Konfigurasi Kartu Statistik
  const statCards = [
    { 
      title: 'Perlu Diproses', 
      value: stats.surat_pending, 
      icon: <FaClock />, 
      color: 'bg-orange-500',
      desc: 'Surat masuk baru' 
    },
    { 
      title: 'Laporan Warga', 
      value: stats.pengaduan_pending, 
      icon: <FaBullhorn />, 
      color: 'bg-red-500',
      desc: 'Pengaduan belum ditindak'
    },
    { 
      title: 'Warga Terdaftar', 
      value: stats.warga_total, 
      icon: <FaUsers />, 
      color: 'bg-blue-500',
      desc: 'Total akun warga'
    },
    { 
      title: 'Layanan Selesai', 
      value: stats.surat_selesai, 
      icon: <FaCheckCircle />, 
      color: 'bg-green-500',
      desc: 'Surat diterbitkan'
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-center">Memuat data dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Ikhtisar</h1>
      <p className="text-gray-600 mb-8">Pantau aktivitas pelayanan desa hari ini.</p>
      
      {/* 1. KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition border-l-4 border-transparent hover:border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg text-white text-lg ${stat.color} shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* 2. AKTIVITAS TERBARU (GABUNGAN SURAT & PENGADUAN) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaEnvelopeOpenText className="text-blue-600"/> Aktivitas Terbaru
        </h3>
        
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">Belum ada aktivitas terbaru.</p>
          ) : (
            activities.map((item, index) => (
              <div key={index} className="flex items-start gap-4 border-b pb-3 last:border-0 last:pb-0">
                {/* Ikon berdasarkan tipe */}
                <div className={`p-2 rounded-full text-white mt-1 ${
                  item.type === 'surat' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                }`}>
                  {item.type === 'surat' ? <FaFileAlt /> : <FaBullhorn />}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.user_name} 
                    <span className="font-normal text-gray-600"> 
                      {item.type === 'surat' ? ' mengajukan permohonan ' : ' mengirim laporan '} 
                    </span>
                    <span className="text-blue-600">{item.title}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.created_at).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>

                <span className={`text-xs px-2 py-1 rounded capitalize ${
                   item.type === 'surat' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {item.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;