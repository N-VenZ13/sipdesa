import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  FaFileAlt, FaCheckCircle, FaClock, 
  FaBullhorn, FaNewspaper, FaArrowRight, FaUserCircle, FaCommentDots, FaPrint, FaDownload 
} from 'react-icons/fa'; 
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'; 

const DashboardUser = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ambil data user dari Redux (Pastikan sudah Logout & Login ulang agar data NIK/Alamat masuk)
  const { user } = useSelector((state) => state.auth);

  // Helper URL untuk file upload
  const getFileUrl = (filePath) => {
    if (!filePath) return '#';
    const cleanPath = filePath.replace(/\\/g, '/').replace(/^\//, '');
    return import.meta.env.DEV 
      ? `http://localhost:5000/${cleanPath}` 
      : `/${cleanPath}`; 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSurat, resAduan] = await Promise.all([
          api.get('/surat/riwayat'),
          api.get('/pengaduan/riwayat')
        ]);

        // Parsing data_request dan mapping tipe
        const listSurat = resSurat.data.map(item => ({ 
          ...item, 
          tipe: 'surat',
          data_request: typeof item.data_request === 'string' ? JSON.parse(item.data_request) : item.data_request
        }));
        
        const listAduan = resAduan.data.map(item => ({ ...item, tipe: 'aduan' }));

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

  // --- FUNGSI CETAK MANUAL (PERBAIKAN DATA DIRI) ---
  const handlePrintManual = (data) => {
    const printWindow = window.open('', '_blank');
    const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Bandung_Barat.svg/1200px-Lambang_Kabupaten_Bandung_Barat.svg.png";
    
    // Susun data dinamis (Keperluan, Nama Usaha, dll)
    let dataRows = '';
    if (data.data_request) {
      Object.entries(data.data_request).forEach(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        dataRows += `
          <tr>
            <td style="width: 200px; padding: 5px 0;">${label}</td>
            <td style="width: 20px;">:</td>
            <td style="font-weight: bold;">${value}</td>
          </tr>
        `;
      });
    }

    // --- PERBAIKAN: AMBIL DATA DARI REDUX JIKA DATA TRANSAKSI KOSONG ---
    // data.pemohon = dari API riwayat surat (mungkin null di sisi warga)
    // user.name = dari Redux (Data login saat ini)
    const namaPemohon = data.pemohon || user.name || '-';
    const nikPemohon = data.nik || user.nik || '-';
    const alamatPemohon = data.alamat_user || user.address || 'Desa Sukatani';

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Surat</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; }
            .kop { display: flex; align-items: center; border-bottom: 4px solid black; padding-bottom: 10px; margin-bottom: 30px; }
            .logo { width: 80px; height: auto; margin-right: 20px; }
            .kop-text { text-align: center; flex: 1; }
            .kop-text h3, .kop-text h2, .kop-text h1 { margin: 0; text-transform: uppercase; line-height: 1.2; }
            .kop-text p { margin: 5px 0 0 0; font-style: italic; font-size: 12px; }
            .judul { text-align: center; margin-bottom: 30px; }
            .judul h2 { text-decoration: underline; margin: 0; text-transform: uppercase; }
            .isi { font-size: 16px; line-height: 1.6; text-align: justify; }
            .ttd { float: right; text-align: center; margin-top: 50px; width: 250px; }
            @media print { @page { size: A4; margin: 2cm; } }
          </style>
        </head>
        <body>
          <div class="kop">
            <img src="${logoUrl}" class="logo" />
            <div class="kop-text">
              <h3>Pemerintah Kabupaten Lahat </h3>
              <h2>Kecamatan Merapi Timur</h2>
              <h1>Desa Banjar Sari</h1>
              <p>Jl. Lintas Sumatera km.27 No. 123, Telp (022) 1234567, Kode Pos 40552</p>
            </div>
          </div>

          <div class="judul">
            <h2>${data.nama_surat}</h2>
            <p>Nomor: ${data.nomor_surat || "___/___/___/2025"}</p>
          </div>

          <div class="isi">
            <p>Yang bertanda tangan di bawah ini Kepala Desa Banjar Sari, Kecamatan Merapi Timur, Kabupaten Lahat, menerangkan dengan sebenarnya bahwa:</p>
            
            <table style="width: 100%; margin: 20px 0;">
              <tr>
                <td style="width: 200px; padding: 5px 0;">Nama Lengkap</td>
                <td style="width: 20px;">:</td>
                <td style="font-weight: bold;">${namaPemohon}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">NIK</td>
                <td>:</td>
                <td>${nikPemohon}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Alamat</td>
                <td>:</td>
                <td>${alamatPemohon}</td>
              </tr>
              ${dataRows}
            </table>

            <p>Demikian surat keterangan ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.</p>
          </div>

          <div class="ttd">
            <p>Sukatani, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            <p style="margin-bottom: 80px;">Kepala Desa Banjar Sari</p>
            <p style="text-decoration: underline; font-weight: bold;">H. Novendri, S.IP</p>
            <p>NIP. 19800101 201001 1 001</p>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Popup Respon Admin
  const showResponAdmin = (pesan, judul) => {
    Swal.fire({
      title: 'Tanggapan Admin',
      html: `
        <div class="text-left bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p class="text-xs text-gray-500 mb-2 uppercase font-bold">Perihal:</p>
          <p class="text-gray-700 font-semibold mb-4 border-b pb-2">${judul}</p>
          <p class="text-xs text-gray-500 mb-2 uppercase font-bold">Respon:</p>
          <p class="text-gray-800 text-lg">"${pesan}"</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Tutup'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      selesai: 'bg-green-100 text-green-700 border-green-200',
      ditolak: 'bg-red-100 text-red-700 border-red-200',
      diajukan: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      diproses: 'bg-blue-100 text-blue-700 border-blue-200',
      pending: 'bg-gray-100 text-gray-600 border-gray-200',
      ditindak: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
            <FaUserCircle className="text-blue-300" /> Halo, {user?.name || 'Warga'}!
          </h1>
          <p className="text-blue-100 text-lg">Selamat datang di Portal Pelayanan Digital.</p>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 text-center">
            <p className="text-sm font-medium text-blue-100">Status Akun</p>
            <p className="text-xl font-bold flex items-center gap-2 justify-center"><FaCheckCircle className="text-green-400" /> Aktif</p>
          </div>
        </div>
      </div>

      {/* Menu Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/user/ajukan" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-blue-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-lg"><FaFileAlt size={24} /></div>
            <div><h3 className="font-bold text-gray-800 text-lg">Ajukan Surat</h3></div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-blue-500" />
          </div>
        </Link>
        <Link to="/user/pengaduan" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-red-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 text-red-600 rounded-lg"><FaBullhorn size={24} /></div>
            <div><h3 className="font-bold text-gray-800 text-lg">Lapor Masalah</h3></div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-red-500" />
          </div>
        </Link>
        <Link to="/user/info" className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border hover:border-green-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-lg"><FaNewspaper size={24} /></div>
            <div><h3 className="font-bold text-gray-800 text-lg">Info Desa</h3></div>
            <FaArrowRight className="ml-auto text-gray-300 group-hover:text-green-500" />
          </div>
        </Link>
      </div>

      {/* Riwayat Aktivitas */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><FaClock className="text-blue-500" /> Riwayat Aktivitas</h3>
          <span className="text-xs bg-white border px-3 py-1 rounded-full text-gray-500">{riwayat.length} Total</span>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500">Memuat data...</div>
          ) : riwayat.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Belum ada aktivitas.</div>
          ) : (
            riwayat.map((item) => (
              <div key={`${item.tipe}-${item.id}`} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Kiri: Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-full mt-1 ${item.tipe === 'surat' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    {item.tipe === 'surat' ? <FaFileAlt /> : <FaBullhorn />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{item.tipe === 'surat' ? item.nama_surat : item.judul_laporan}</h4>
                    <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3 items-center">
                      <span className="flex items-center gap-1"><FaClock size={12} /> {new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                      <span className="font-semibold text-gray-400 text-[10px] px-2 py-0.5 border rounded uppercase bg-gray-50">{item.tipe}</span>
                    </div>
                    {item.tipe === 'surat' && item.keterangan_admin && (
                      <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded border border-yellow-100 inline-block">📝 <b>Catatan Admin:</b> {item.keterangan_admin}</div>
                    )}
                    {item.tipe === 'aduan' && item.respon_admin && (
                      <div className="mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-100 inline-block">💬 <b>Balasan:</b> "{item.respon_admin}"</div>
                    )}
                  </div>
                </div>

                {/* Kanan: Aksi */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  {getStatusBadge(item.status)}
                  
                  {/* Tombol Lihat Tanggapan (Aduan) */}
                  {item.tipe === 'aduan' && item.respon_admin && (
                    <button onClick={() => showResponAdmin(item.respon_admin, item.judul_laporan)} className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-100">
                      <FaCommentDots /> Lihat
                    </button>
                  )}

                  {/* Tombol Aksi Surat (Selesai) */}
                  {item.tipe === 'surat' && item.status === 'selesai' && (
                    <div className="flex gap-2">
                        {/* Tombol CETAK MANDIRI (BARU) */}
                        <button 
                          onClick={() => handlePrintManual(item)}
                          className="flex items-center gap-2 text-white bg-purple-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-700 transition shadow-sm"
                        >
                          <FaPrint /> Cetak
                        </button>

                        {/* Tombol Download File (Jika Admin upload file) */}
                        {item.file_hasil && (
                          <a 
                            href={getFileUrl(item.file_hasil)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-2 text-indigo-600 font-bold text-xs border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition"
                          >
                            <FaDownload /> File
                          </a>
                        )}
                    </div>
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