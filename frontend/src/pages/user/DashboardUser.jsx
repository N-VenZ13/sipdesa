import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  FaPlus, FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle, 
  FaBullhorn, FaNewspaper, FaArrowRight, FaUserCircle, FaCommentDots 
} from 'react-icons/fa'; 
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'; 

const DashboardUser = () => {
  // --- STATE ---
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ambil data user yang sedang login dari Redux
  const { user } = useSelector((state) => state.auth);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Request data Surat dan Pengaduan secara bersamaan
        const [resSurat, resAduan] = await Promise.all([
          api.get('/surat/riwayat'),
          api.get('/pengaduan/riwayat')
        ]);

        // 2. Tandai tipe datanya
        const listSurat = resSurat.data.map(item => ({ ...item, tipe: 'surat' }));
        const listAduan = resAduan.data.map(item => ({ ...item, tipe: 'aduan' }));

        // 3. Gabungkan dan Urutkan dari yang terbaru
        const gabungan = [...listSurat, ...listAduan].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

        setRiwayat(gabungan);
      } catch (error) {
        console.error("Gagal load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- POPUP TANGGAPAN ADMIN ---
  const showResponAdmin = (pesan, judul) => {
    Swal.fire({
      title: 'Tanggapan Admin',
      html: `
        <div class="text-left bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p class="text-xs text-gray-500 mb-2 uppercase font-bold">Perihal Laporan:</p>
          <p class="text-gray-700 font-semibold mb-4 border-b pb-2">${judul}</p>
          
          <p class="text-xs text-gray-500 mb-2 uppercase font-bold">Respon:</p>
          <p class="text-gray-800 text-lg leading-relaxed">"${pesan}"</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#2563eb'
    });
  };

  // --- HELPER WARNA STATUS ---
  const getStatusBadge = (status) => {
    const styles = {
      // Surat
      selesai: 'bg-green-100 text-green-700 border-green-200',
      ditolak: 'bg-red-100 text-red-700 border-red-200',
      diajukan: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      diproses: 'bg-blue-100 text-blue-700 border-blue-200',
      // Pengaduan
      pending: 'bg-gray-100 text-gray-600 border-gray-200',
      ditindak: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  // --- RENDER UI ---
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
            Selamat datang di Portal Pelayanan Digital Desa.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 text-center min-w-[150px]">
            <p className="text-sm font-medium text-blue-100">Status Akun</p>
            <p className="text-xl font-bold flex items-center gap-2 justify-center">
              <FaCheckCircle className="text-green-400" /> Aktif
            </p>
          </div>
        </div>
      </div>

      {/* 2. MENU CEPAT (Quick Actions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/user/ajukan" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-blue-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
              <FaFileAlt size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Ajukan Surat</h3>
              <p className="text-gray-500 text-sm">Buat permohonan baru</p>
            </div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-blue-500" />
          </div>
        </Link>

        <Link to="/user/pengaduan" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-red-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
              <FaBullhorn size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Lapor Masalah</h3>
              <p className="text-gray-500 text-sm">Sampaikan keluhan</p>
            </div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-red-500" />
          </div>
        </Link>

        <Link to="/user/info" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-green-500 cursor-pointer">
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
        </Link>
      </div>

      {/* 3. RIWAYAT AKTIVITAS (Timeline) */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <FaClock className="text-blue-500" /> Riwayat Aktivitas
          </h3>
          <span className="text-xs bg-white border px-3 py-1 rounded-full text-gray-500">
            {riwayat.length} Total
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500">Memuat data aktivitas...</div>
          ) : riwayat.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-2 text-4xl">📭</p>
              <p className="text-gray-500 font-medium">Belum ada aktivitas apapun.</p>
            </div>
          ) : (
            riwayat.map((item) => (
              <div key={`${item.tipe}-${item.id}`} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* BAGIAN KIRI: IKON & INFO */}
                <div className="flex items-start gap-4">
                  {/* Ikon sesuai tipe */}
                  <div className={`p-3 rounded-full mt-1 shadow-sm ${
                    item.tipe === 'surat' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.tipe === 'surat' ? <FaFileAlt /> : <FaBullhorn />}
                  </div>

                  <div className="flex-1">
                    {/* Judul */}
                    <h4 className="font-bold text-gray-800 text-lg">
                      {item.tipe === 'surat' ? item.nama_surat : item.judul_laporan}
                    </h4>
                    
                    {/* Meta Data */}
                    <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3 items-center">
                      <span className="flex items-center gap-1">
                        <FaClock size={12} /> {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="font-semibold text-gray-400 text-[10px] px-2 py-0.5 border rounded uppercase bg-gray-50">
                        {item.tipe === 'surat' ? 'Layanan Surat' : 'Pengaduan'}
                      </span>
                    </div>

                    {/* Feedback Admin (Kondisional) */}
                    {item.tipe === 'surat' && item.keterangan_admin && (
                      <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded border border-yellow-100 inline-block">
                        📝 <b>Catatan Admin:</b> {item.keterangan_admin}
                      </div>
                    )}

                    {item.tipe === 'aduan' && item.respon_admin && (
                      <div className="mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded border border-blue-100 inline-block max-w-xl">
                        💬 <b>Balasan Admin:</b> "{item.respon_admin.substring(0, 70)}{item.respon_admin.length > 70 ? '...' : ''}"
                      </div>
                    )}
                  </div>
                </div>

                {/* BAGIAN KANAN: STATUS & TOMBOL AKSI */}
                <div className="flex items-center gap-3 self-end md:self-center flex-wrap justify-end">
                  
                  {getStatusBadge(item.status)}
                  
                  {/* Tombol Lihat Tanggapan (Khusus Pengaduan yg ada respon) */}
                  {item.tipe === 'aduan' && item.respon_admin && (
                    <button 
                      onClick={() => showResponAdmin(item.respon_admin, item.judul_laporan)}
                      className="flex items-center gap-2 text-white bg-blue-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                    >
                      <FaCommentDots /> Lihat Tanggapan
                    </button>
                  )}

                  {/* Tombol Download (Khusus Surat Selesai) */}
                  {item.tipe === 'surat' && item.status === 'selesai' && item.file_hasil && (
                    <a 
                      href={`http://localhost:5000/${item.file_hasil}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-indigo-600 font-bold text-xs border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition"
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