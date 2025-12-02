import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { FaPaperPlane, FaFileUpload } from 'react-icons/fa';

const AjukanSurat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State Form
  const [layananId, setLayananId] = useState('');
  const [keperluan, setKeperluan] = useState(''); // Masuk ke JSON data_request
  const [keterangan, setKeterangan] = useState(''); // Masuk ke JSON data_request
  const [fileSyarat, setFileSyarat] = useState(null);

  // Daftar Layanan (Harusnya dari API, tapi kita hardcode dulu sesuai ID Database di Langkah 1)
  const listLayanan = [
    { id: 1, nama: 'Surat Keterangan Domisili (SKD)' },
    { id: 2, nama: 'Surat Keterangan Usaha (SKU)' },
    { id: 3, nama: 'Surat Keterangan Tidak Mampu (SKTM)' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('File Terlalu Besar', 'Maksimal ukuran file 2MB', 'error');
        return;
      }
      setFileSyarat(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!layananId || !fileSyarat) {
      Swal.fire('Gagal', 'Mohon lengkapi jenis surat dan upload persyaratan!', 'warning');
      return;
    }

    setLoading(true);

    // 1. Siapkan FormData (Paket data + file)
    const formData = new FormData();
    formData.append('layanan_id', layananId);
    
    // Gabungkan isian form jadi satu JSON string
    const requestData = {
      keperluan: keperluan,
      keterangan_tambahan: keterangan
    };
    formData.append('data_request', JSON.stringify(requestData));
    
    // Masukkan file
    formData.append('syarat', fileSyarat);

    try {
      // 2. Kirim ke Backend (Header 'multipart/form-data' otomatis diatur oleh axios)
      await api.post('/surat/ajukan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire('Berhasil!', 'Surat Anda telah diajukan.', 'success');
      navigate('/user/dashboard'); // Kembali ke dashboard

    } catch (error) {
      console.error(error);
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Form Pengajuan Surat</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pilih Jenis Surat */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Jenis Layanan Surat</label>
          <select 
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            value={layananId}
            onChange={(e) => setLayananId(e.target.value)}
            required
          >
            <option value="">-- Pilih Jenis Surat --</option>
            {listLayanan.map((l) => (
              <option key={l.id} value={l.id}>{l.nama}</option>
            ))}
          </select>
        </div>

        {/* Input Dinamis (Sederhana) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Keperluan</label>
            <input 
              type="text" 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Cth: Persyaratan Bank"
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Keterangan Tambahan</label>
            <input 
              type="text" 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Opsional"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>
        </div>

        {/* Upload File */}
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:bg-gray-50 transition">
          <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-2" />
          <label className="block text-gray-700 font-medium mb-2 cursor-pointer">
            <span className="text-blue-600 underline">Upload Scan KTP/KK</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange} 
            />
          </label>
          <p className="text-xs text-gray-500">Format: JPG, PNG, PDF (Max 2MB)</p>
          
          {fileSyarat && (
            <div className="mt-4 bg-blue-50 text-blue-700 px-4 py-2 rounded inline-block text-sm font-semibold">
              File Terpilih: {fileSyarat.name}
            </div>
          )}
        </div>

        {/* Tombol Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
        >
          {loading ? 'Mengirim...' : <><FaPaperPlane /> AJUKAN SEKARANG</>}
        </button>
      </form>
    </div>
  );
};

export default AjukanSurat;