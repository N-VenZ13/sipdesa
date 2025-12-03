import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCalendarAlt, FaUser, FaNewspaper, FaBullhorn } from 'react-icons/fa';

const InfoDesa = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data berita dari Backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/informasi');
        setNews(response.data);
      } catch (error) {
        console.error("Gagal load berita:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Helper untuk memotong teks panjang (Excerpt)
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Informasi Desa</h1>
          <p className="text-gray-600">Berita terbaru dan pengumuman penting.</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Memuat informasi...</div>
      ) : news.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-dashed">
          <p className="text-gray-500">Belum ada informasi terbaru.</p>
        </div>
      ) : (
        // Grid Berita
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border overflow-hidden flex flex-col">
              {/* Gambar (Thumbnail) - Placeholder jika tidak ada gambar */}
              <div className="h-48 bg-gray-200 w-full object-cover flex items-center justify-center text-gray-400">
                 {/* Jika nanti ada fitur upload gambar berita, pasang <img> disini */}
                 <FaNewspaper size={40} />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Badge Kategori */}
                <div className="mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    item.kategori === 'berita' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.kategori}
                  </span>
                </div>

                {/* Judul */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                  {item.judul}
                </h3>

                {/* Meta Data (Tanggal & Penulis) */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt /> {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser /> Admin
                  </span>
                </div>

                {/* Isi Singkat */}
                <p className="text-sm text-gray-600 mb-4 flex-1">
                  {truncateText(item.konten, 100)}
                </p>

                {/* Tombol Baca (Opsional: Nanti bisa dibuat halaman detail) */}
                {/* <button className="text-blue-600 text-sm font-semibold hover:underline self-start">
                  Baca Selengkapnya
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoDesa;