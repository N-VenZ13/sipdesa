import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { FaCamera, FaPaperPlane, FaHistory } from 'react-icons/fa';

const UserPengaduan = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [fileBukti, setFileBukti] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load Riwayat
  const loadRiwayat = async () => {
    try {
      const res = await api.get('/pengaduan/riwayat');
      setRiwayat(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRiwayat();
  }, []);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !isi) return Swal.fire('Error', 'Judul dan Isi wajib diisi!', 'error');

    setIsLoading(true);
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('isi', isi);
    if (fileBukti) formData.append('bukti', fileBukti);

    try {
      await api.post('/pengaduan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Terkirim', 'Laporan Anda berhasil dikirim', 'success');
      setJudul(''); setIsi(''); setFileBukti(null);
      loadRiwayat(); // Refresh list
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* FORM LAPOR (Kiri/Atas) */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <FaPaperPlane className="text-blue-600"/> Sampaikan Laporan
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Judul Laporan</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Jalan Berlubang di RT 01"
                value={judul}
                onChange={e => setJudul(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-1">Detail Kejadian</label>
              <textarea 
                rows="4"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ceritakan kronologi, lokasi, dll..."
                value={isi}
                onChange={e => setIsi(e.target.value)}
              ></textarea>
            </div>

            <div className="border border-dashed p-4 rounded bg-gray-50">
              <label className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <FaCamera size={20} />
                <span>{fileBukti ? fileBukti.name : 'Upload Foto Bukti (Opsional)'}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={e => setFileBukti(e.target.files[0])}
                />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </form>
        </div>
      </div>

      {/* RIWAYAT (Kanan/Bawah) */}
      <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
          <FaHistory /> Riwayat Laporan
        </h3>
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {riwayat.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada laporan.</p>
          ) : (
            riwayat.map(item => (
              <div key={item.id} className="border-b pb-3 last:border-0">
                <p className="font-bold text-gray-800 text-sm">{item.judul_laporan}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded text-white capitalize ${
                    item.status === 'pending' ? 'bg-gray-400' :
                    item.status === 'ditindak' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPengaduan;