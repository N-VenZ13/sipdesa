import { useState, useEffect } from 'react';
import api from '../../services/api'; // Koneksi ke Backend
import Swal from 'sweetalert2'; // Notifikasi cantik
import { FaPlus, FaTrash, FaNewspaper, FaBullhorn } from 'react-icons/fa';

const InformasiPublik = () => {
  // --- STATE (Penyimpanan Data Sementara) ---
  const [dataInformasi, setDataInformasi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // State untuk Form Input
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'berita',
    konten: ''
  });

  // --- EFFECT (Dijalankan saat halaman dibuka) ---
  useEffect(() => {
    fetchData();
  }, []);

  // --- FUNGSI-FUNGSI LOGIKA ---
  
  // 1. Ambil data dari Backend
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/informasi');
      setDataInformasi(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Simpan Data Baru
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    try {
      await api.post('/informasi', formData);
      
      Swal.fire('Sukses', 'Informasi berhasil diterbitkan!', 'success');
      setShowModal(false); // Tutup modal
      setFormData({ judul: '', kategori: 'berita', konten: '' }); // Reset form
      fetchData(); // Refresh tabel

    } catch (error) {
      Swal.fire('Error', 'Gagal menyimpan data', 'error');
    }
  };

  // 3. Hapus Data
  const handleDelete = async (id) => {
    // Konfirmasi dulu sebelum hapus
    const result = await Swal.fire({
      title: 'Yakin hapus data ini?',
      text: "Data tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/informasi/${id}`);
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
        fetchData(); // Refresh tabel
      } catch (error) {
        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
      }
    }
  };

  // --- TAMPILAN (UI) ---
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Informasi Publik</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FaPlus /> Tambah Data
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4 border-b">No</th>
              <th className="p-4 border-b">Judul</th>
              <th className="p-4 border-b">Kategori</th>
              <th className="p-4 border-b">Penulis</th>
              <th className="p-4 border-b">Tanggal</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {isLoading ? (
              <tr><td colSpan="6" className="p-4 text-center">Memuat data...</td></tr>
            ) : dataInformasi.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center">Belum ada data informasi.</td></tr>
            ) : (
              dataInformasi.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 border-b">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">{item.judul}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      item.kategori === 'berita' ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                      {item.kategori === 'berita' ? <FaNewspaper className="inline mr-1"/> : <FaBullhorn className="inline mr-1"/>}
                      {item.kategori.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">{item.author_name}</td>
                  <td className="p-4 text-sm">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM (Popup) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Tambah Informasi Baru</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Judul</label>
                <input 
                  type="text" 
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  placeholder="Contoh: Jadwal Posyandu Mawar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                >
                  <option value="berita">Berita Desa</option>
                  <option value="pengumuman">Pengumuman</option>
                  <option value="layanan">Info Layanan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Konten / Isi</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.konten}
                  onChange={(e) => setFormData({...formData, konten: e.target.value})}
                  placeholder="Tulis detail informasi disini..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformasiPublik;