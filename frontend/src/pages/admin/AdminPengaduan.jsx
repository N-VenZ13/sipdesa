import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';

const AdminPengaduan = () => {
  const [dataLaporan, setDataLaporan] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Untuk Modal Detail
  const [responText, setResponText] = useState('');
  
  // Ambil Data
  const fetchData = async () => {
    try {
      const res = await api.get('/pengaduan/admin');
      setDataLaporan(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData() }, []);

  // Fungsi Buka Modal & Ambil Chat History
  const handleOpenDetail = async (id) => {
    try {
      const res = await api.get(`/pengaduan/${id}`);
      setSelectedItem(res.data); // Data termasuk responses
    } catch (error) {
      console.error(error);
    }
  };

  // Fungsi Kirim Balasan
  const handleKirimRespon = async (status) => {
    if (!responText) return Swal.fire('Error', 'Respon tidak boleh kosong', 'warning');

    try {
      await api.post(`/pengaduan/${selectedItem.id}/tanggapi`, {
        respon: responText,
        status: status // 'ditindak' atau 'selesai'
      });
      
      Swal.fire('Sukses', 'Tanggapan terkirim', 'success');
      setResponText('');
      setSelectedItem(null); // Tutup modal
      fetchData(); // Refresh tabel luar
    } catch (error) {
      Swal.fire('Gagal', 'Error server', 'error');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Laporan Masyarakat</h1>
      
      {/* TABEL */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 uppercase text-sm font-semibold text-gray-600">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Pelapor</th>
              <th className="p-4">Judul</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataLaporan.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-4">{item.pelapor}</td>
                <td className="p-4 font-medium">{item.judul_laporan}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded text-white capitalize ${
                    item.status === 'selesai' ? 'bg-green-500' : 
                    item.status === 'ditindak' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleOpenDetail(item.id)} className="text-blue-600 bg-blue-100 p-2 rounded hover:bg-blue-200">
                    <FaEye /> Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL & RESPON */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Detail Laporan</h3>
              <button onClick={() => setSelectedItem(null)} className="text-red-500 text-xl font-bold">&times;</button>
            </div>

            {/* Content Scrollable */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Info Pelapor */}
              <div className="bg-blue-50 p-4 rounded mb-4">
                 <h4 className="font-bold text-blue-800 text-lg">{selectedItem.judul_laporan}</h4>
                 <p className="text-gray-700 mt-2">{selectedItem.isi_laporan}</p>
                 {selectedItem.foto_bukti && (
                   <img 
                     src={`http://localhost:5000/${selectedItem.foto_bukti}`} 
                     alt="Bukti" 
                     className="mt-3 w-48 h-auto rounded border shadow-sm cursor-pointer hover:opacity-90"
                     onClick={() => window.open(`http://localhost:5000/${selectedItem.foto_bukti}`)}
                   />
                 )}
                 <p className="text-xs text-gray-500 mt-2">Pelapor: {selectedItem.pelapor} | {new Date(selectedItem.created_at).toLocaleString()}</p>
              </div>

              {/* Chat History / Tindak Lanjut */}
              <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Tindak Lanjut</h4>
              <div className="space-y-3 mb-4">
                {selectedItem.responses?.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">Belum ada tanggapan.</p>
                ) : (
                  selectedItem.responses.map((resp, idx) => (
                    <div key={idx} className="bg-gray-100 p-3 rounded">
                      <p className="font-bold text-xs text-blue-600 mb-1">{resp.admin_name} <span className="text-gray-400 font-normal">- {new Date(resp.tgl_tindak_lanjut).toLocaleString()}</span></p>
                      <p className="text-sm text-gray-800">{resp.respon}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Input */}
            <div className="p-4 border-t bg-gray-50">
              <label className="text-sm font-semibold block mb-1">Berikan Tanggapan:</label>
              <textarea 
                rows="2" 
                className="w-full border p-2 rounded mb-2 focus:ring-1 focus:ring-blue-500"
                placeholder="Tulis respon admin..."
                value={responText}
                onChange={e => setResponText(e.target.value)}
              ></textarea>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => handleKirimRespon('ditindak')} 
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Kirim & Proses
                </button>
                <button 
                  onClick={() => handleKirimRespon('selesai')} 
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                >
                  Kirim & Selesaikan
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPengaduan;