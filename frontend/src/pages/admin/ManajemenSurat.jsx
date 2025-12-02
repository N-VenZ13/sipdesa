import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes, FaFilePdf } from 'react-icons/fa';

const ManajemenSurat = () => {
  const [listSurat, setListSurat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurat, setSelectedSurat] = useState(null);
  
  const BASE_URL = 'http://localhost:5000/';

  // Ambil data saat halaman dibuka
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/surat/admin/list');
      setListSurat(response.data);
    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Update Status (Disetujui/Ditolak)
  const handleUpdateStatus = async (id, statusBaru) => {
    setSelectedSurat(null); // Tutup modal

    const isApprove = statusBaru === 'selesai';

    const { value: textInput } = await Swal.fire({
      title: isApprove ? 'Terbitkan Surat' : 'Tolak Pengajuan',
      input: 'text',
      inputLabel: isApprove ? 'Masukkan Nomor Surat Resmi:' : 'Alasan Penolakan:',
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      confirmButtonColor: isApprove ? '#16a34a' : '#dc2626',
      inputValidator: (value) => {
        if (!value) return 'Kolom ini wajib diisi!';
      }
    });

    if (textInput) {
      try {
        await api.put(`/surat/admin/verifikasi/${id}`, {
          status: statusBaru,
          keterangan: isApprove ? 'Surat diterbitkan' : textInput,
          nomor_surat: isApprove ? textInput : null
        });

        Swal.fire('Berhasil', `Status diperbarui!`, 'success');
        fetchData(); // Refresh tabel

      } catch (error) {
        Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
      }
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

      {/* TABEL SURAT */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">Tanggal</th>
              <th className="p-4 border-b">Pemohon</th>
              <th className="p-4 border-b">Jenis Surat</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {isLoading ? (
              <tr><td colSpan="5" className="p-6 text-center">Memuat data...</td></tr>
            ) : listSurat.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center">Belum ada pengajuan surat.</td></tr>
            ) : (
              listSurat.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-b">
                  <td className="p-4 text-sm">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{item.pemohon}</div>
                    <div className="text-xs text-gray-500">NIK: {item.nik}</div>
                  </td>
                  <td className="p-4">{item.nama_surat}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs text-white uppercase font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedSurat(item)}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition text-sm flex items-center gap-1 mx-auto font-medium"
                    >
                      <FaEye /> Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL SURAT */}
      {selectedSurat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="p-5 border-b flex justify-between items-center bg-gray-50 sticky top-0">
              <h3 className="text-lg font-bold text-gray-800">Detail Permohonan</h3>
              <button onClick={() => setSelectedSurat(null)} className="text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded border border-blue-100">
                <div><label className="text-xs uppercase font-bold text-gray-500">Pemohon</label><p className="font-semibold">{selectedSurat.pemohon}</p></div>
                <div><label className="text-xs uppercase font-bold text-gray-500">NIK</label><p className="font-semibold">{selectedSurat.nik}</p></div>
                <div><label className="text-xs uppercase font-bold text-gray-500">Layanan</label><p className="font-semibold text-blue-600">{selectedSurat.nama_surat}</p></div>
                <div><label className="text-xs uppercase font-bold text-gray-500">Tanggal</label><p className="font-semibold">{new Date(selectedSurat.created_at).toLocaleString()}</p></div>
              </div>

              <div className="border rounded p-4">
                <h4 className="font-bold text-sm mb-2 text-gray-700 border-b pb-1">Data Isian Warga:</h4>
                <ul className="text-sm space-y-1">
                  {Object.entries(selectedSurat.data_request || {}).map(([key, value]) => (
                    <li key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span className="capitalize font-medium min-w-[150px]">{key.replace(/_/g, ' ')}:</span> 
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-2 text-gray-700">Lampiran Persyaratan:</h4>
                {selectedSurat.file_persyaratan ? (
                  <a 
                    href={`${BASE_URL}${selectedSurat.file_persyaratan}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline bg-blue-50 p-3 rounded border border-blue-100 w-fit"
                  >
                    <FaFilePdf className="text-red-500" /> Lihat Dokumen
                  </a>
                ) : (
                  <p className="text-red-500 text-sm italic">Tidak ada file dilampirkan.</p>
                )}
              </div>
            </div>

            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setSelectedSurat(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition border"
              >
                Tutup
              </button>
              
              {selectedSurat.status === 'diajukan' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(selectedSurat.id, 'ditolak')}
                    className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded flex items-center gap-2 font-semibold"
                  >
                    <FaTimes /> Tolak
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedSurat.id, 'selesai')}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded flex items-center gap-2 font-semibold"
                  >
                    <FaCheck /> Setujui
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenSurat;