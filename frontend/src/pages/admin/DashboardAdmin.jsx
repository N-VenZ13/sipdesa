import { FaEnvelope, FaUsers, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const DashboardAdmin = () => {
  // Data Dummy dulu (Nanti kita ambil dari Database)
  const stats = [
    { title: 'Surat Masuk', value: 12, icon: <FaEnvelope />, color: 'bg-blue-500' },
    { title: 'Pengaduan', value: 5, icon: <FaExclamationCircle />, color: 'bg-red-500' },
    { title: 'Warga Terdaftar', value: 150, icon: <FaUsers />, color: 'bg-green-500' },
    { title: 'Layanan Selesai', value: 45, icon: <FaCheckCircle />, color: 'bg-indigo-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Ikhtisar</h1>
      
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full text-white text-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Area Konten Tambahan */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
        <p className="text-gray-500">Belum ada aktivitas terbaru.</p>
      </div>
    </div>
  );
};

export default DashboardAdmin;