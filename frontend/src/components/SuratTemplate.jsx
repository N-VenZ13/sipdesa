import React from 'react';

export const SuratTemplate = ({ data }) => {
  // Fallback jika data kosong (agar tidak crash saat render di background)
  if (!data) return <div className="p-10">Data Surat Belum Dipilih...</div>;

  return (
    // Pastikan background white dan text black agar hasil print jelas
    <div className="w-full p-12 text-black bg-white font-serif leading-relaxed">
      
      {/* KOP SURAT */}
      <div className="flex items-center border-b-4 border-black pb-4 mb-8">
        <div className="mr-6">
           {/* Ganti src logo jika perlu */}
           <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Bandung_Barat.svg/1200px-Lambang_Kabupaten_Bandung_Barat.svg.png" 
            alt="Logo" 
            className="w-24 h-auto" 
           />
        </div>
        <div className="text-center flex-1">
          <h3 className="text-xl font-bold uppercase">Pemerintah Kabupaten Bandung Barat</h3>
          <h2 className="text-2xl font-bold uppercase">Kecamatan Ngamprah</h2>
          <h1 className="text-3xl font-bold uppercase tracking-wider">Desa Sukatani</h1>
          <p className="text-sm italic mt-1">Jl. Raya Desa Sukatani No. 123, Telp (022) 1234567</p>
        </div>
      </div>

      {/* ISI SURAT */}
      <div className="px-2">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold underline uppercase decoration-2 underline-offset-4">{data.nama_surat}</h2>
          <p className="text-lg mt-2">Nomor: {data.nomor_surat || "___/___/___/2024"}</p>
        </div>

        <p className="mb-6 text-justify text-lg">
          Yang bertanda tangan di bawah ini Kepala Desa Sukatani, Kecamatan Ngamprah, Kabupaten Bandung Barat, menerangkan dengan sebenarnya bahwa:
        </p>

        <table className="w-full mb-8 text-lg">
          <tbody>
            <tr>
              <td className="w-48 py-2 align-top">Nama Lengkap</td>
              <td className="w-4 py-2 align-top">:</td>
              <td className="py-2 font-bold">{data.pemohon}</td>
            </tr>
            <tr>
              <td className="py-2 align-top">NIK</td>
              <td className="py-2 align-top">:</td>
              <td className="py-2">{data.nik}</td>
            </tr>
            <tr>
              <td className="py-2 align-top">Alamat</td>
              <td className="py-2 align-top">:</td>
              <td className="py-2">{data.alamat_user || "Desa Sukatani"}</td>
            </tr>
            {data.data_request && Object.entries(data.data_request).map(([key, value]) => (
              <tr key={key}>
                <td className="py-2 align-top capitalize">{key.replace(/_/g, ' ')}</td>
                <td className="py-2 align-top">:</td>
                <td className="py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mb-16 text-justify text-lg">
          Demikian surat keterangan ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
        </p>

        <div className="flex justify-end mt-10">
          <div className="text-center w-64">
            <p className="text-lg mb-24">
              Sukatani, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} <br/>
              Kepala Desa Sukatani
            </p>
            <p className="font-bold underline text-lg">H. ADMIN DESA, S.IP</p>
            <p className="text-lg">NIP. 19800101 201001 1 001</p>
          </div>
        </div>
      </div>
    </div>
  );
};