import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes, FaFilePdf, FaPrint } from 'react-icons/fa';

// KITA TIDAK PERLU IMPORT react-to-print ATAU SuratTemplate LAGI
// KITA GUNAKAN FUNGSI MANUAL DI BAWAH INI

const ManajemenSurat = () => {
  const [listSurat, setListSurat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurat, setSelectedSurat] = useState(null);
  
  // Helper URL File
  const getFileUrl = (filePath) => {
    if (!filePath) return '#';
    const cleanPath = filePath.replace(/\\/g, '/').replace(/^\//, '');
    return import.meta.env.DEV 
      ? `http://localhost:5000/${cleanPath}` 
      : `/${cleanPath}`; 
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/surat/admin/list');
      setListSurat(response.data);
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  // --- FUNGSI CETAK MANUAL (PLAN B) ---
  const handlePrintManual = (data) => {
    // 1. Buat Jendela Baru
    const printWindow = window.open('', '_blank');

    // 2. Siapkan HTML Surat (Kita tulis manual HTML-nya di sini agar pasti rapi)
    const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Bandung_Barat.svg/1200px-Lambang_Kabupaten_Bandung_Barat.svg.png";
    
    // Susun baris data dinamis
    let dataRows = '';
    if (data.data_request) {
      Object.entries(data.data_request).forEach(([key, value]) => {
        // Ubah format key (misal: nama_usaha -> Nama Usaha)
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

    // 3. Tulis HTML ke Jendela Baru
    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Surat - ${data.nik}</title>
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
            @media print {
              @page { size: A4; margin: 2cm; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="kop">
            
            <div class="kop-text">
              <h3>Pemerintah Kabupaten Lahat </h3>
              <h2>Kecamatan Merapi Timur</h2>
              <h1>Desa Banjar Sari</h1>
              <p>Jl. Raya Desa Sukatani No. 123, Telp (022) 1234567, Kode Pos 40552</p>
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
                <td style="font-weight: bold;">${data.pemohon}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">NIK</td>
                <td>:</td>
                <td>${data.nik}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">Alamat</td>
                <td>:</td>
                <td>${data.alamat_user || 'Desa Banjar Sari'}</td>
              </tr>
              ${dataRows} <!-- Data dinamis masuk sini -->
            </table>

            <p>Demikian surat keterangan ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.</p>
          </div>

          <div class="ttd">
            <p>Sukatani, ${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            <p style="margin-bottom: 80px;">Kepala Desa Banjar Sari</p>
            <p style="text-decoration: underline; font-weight: bold;">H. Novendri, S.IP</p>
            <p>NIP. 19800101 201001 1 001</p>
          </div>

          <script>
            // Otomatis print saat jendela terbuka
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };
  // ---------------------------------------------

  const handleUpdateStatus = async (id, statusBaru) => {
    setSelectedSurat(null);
    const isApprove = statusBaru === 'selesai';
    const { value: textInput } = await Swal.fire({
      title: isApprove ? 'Terbitkan Surat' : 'Tolak Pengajuan',
      input: 'text',
      inputLabel: isApprove ? 'Nomor Surat Resmi:' : 'Alasan Penolakan:',
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      confirmButtonColor: isApprove ? '#16a34a' : '#dc2626',
      inputValidator: (v) => !v && 'Wajib diisi!'
    });

    if (textInput) {
      try {
        await api.put(`/surat/admin/verifikasi/${id}`, {
          status: statusBaru,
          keterangan: isApprove ? 'Surat diterbitkan' : textInput,
          nomor_surat: isApprove ? textInput : null
        });
        Swal.fire('Berhasil', 'Status diperbarui!', 'success');
        fetchData();
      } catch (error) { Swal.fire('Gagal', 'Error sistem', 'error'); }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'diajukan': return 'bg-yellow-500';
      case 'diproses': return 'bg-blue-500';
      case 'selesai': return 'bg-green-500';
      case 'ditolak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Pengajuan Surat</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">Tanggal</th>
              <th className="p-4 border-b">Pemohon</th>
              <th className="p-4 border-b">Jenis</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {isLoading ? (
              <tr><td colSpan="5" className="p-6 text-center">Loading...</td></tr>
            ) : listSurat.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center">Data kosong.</td></tr>
            ) : (
              listSurat.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-b">
                  <td className="p-4 text-sm">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="p-4">
                    <div className="font-bold">{item.pemohon}</div>
                    <div className="text-xs">NIK: {item.nik}</div>
                  </td>
                  <td className="p-4">{item.nama_surat}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs text-white uppercase font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedSurat(item)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 text-sm font-medium">
                      <FaEye className="inline mr-1"/> Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {selectedSurat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="p-5 border-b flex justify-between bg-gray-50 sticky top-0 z-10">
              <h3 className="text-lg font-bold">Detail Permohonan</h3>
              <button onClick={() => setSelectedSurat(null)} className="text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Detail Info */}
              <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded border border-blue-100">
                <div><label className="text-xs uppercase font-bold text-gray-500">Pemohon</label><p className="font-semibold">{selectedSurat.pemohon}</p></div>
                <div><label className="text-xs uppercase font-bold text-gray-500">NIK</label><p className="font-semibold">{selectedSurat.nik}</p></div>
                <div><label className="text-xs uppercase font-bold text-gray-500">Layanan</label><p className="font-semibold text-blue-600">{selectedSurat.nama_surat}</p></div>
                <div><label className="text-xs uppercase font-bold text-gray-500">Tanggal</label><p className="font-semibold">{new Date(selectedSurat.created_at).toLocaleDateString()}</p></div>
              </div>

              {/* Data Isian */}
              <div className="border rounded p-4">
                <h4 className="font-bold text-sm mb-2 border-b pb-1">Data Isian:</h4>
                <ul className="text-sm space-y-1">
                  {selectedSurat.data_request && Object.entries(selectedSurat.data_request).map(([key, val]) => (
                    <li key={key}><span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {val}</li>
                  ))}
                </ul>
              </div>

              {/* Link File */}
              {selectedSurat.file_persyaratan && (
                <a href={getFileUrl(selectedSurat.file_persyaratan)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded border border-red-100 w-fit hover:bg-red-100">
                  <FaFilePdf /> Lihat Dokumen Syarat
                </a>
              )}
            </div>

            <div className="p-5 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* === TOMBOL CETAK MANUAL === */}
              {selectedSurat.status === 'selesai' ? (
                 <button 
                  onClick={() => handlePrintManual(selectedSurat)} // PANGGIL FUNGSI MANUAL
                  className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2 font-bold"
                 >
                   <FaPrint /> Cetak PDF
                 </button>
              ) : <div />}

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button onClick={() => setSelectedSurat(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Tutup</button>
                {selectedSurat.status === 'diajukan' && (
                  <>
                    <button onClick={() => handleUpdateStatus(selectedSurat.id, 'ditolak')} className="px-4 py-2 bg-red-100 text-red-600 rounded font-semibold hover:bg-red-200 flex gap-2 items-center"><FaTimes/> Tolak</button>
                    <button onClick={() => handleUpdateStatus(selectedSurat.id, 'selesai')} className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 flex gap-2 items-center"><FaCheck/> Setujui</button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenSurat;