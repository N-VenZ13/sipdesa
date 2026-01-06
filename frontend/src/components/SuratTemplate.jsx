import React from 'react';

// HANYA TERIMA DATA. TIDAK ADA REF, TIDAK ADA CLASS.
export const SuratTemplate = ({ data }) => {
  if (!data) return null;

  return (
    // Pastikan styling ini benar
    <div className="w-full p-10 text-black bg-white leading-normal font-serif"> 
      {/* ... KOP SURAT ... */}
      <div className="flex items-center border-b-4 border-black pb-4 mb-6">
        <div className="w-24 h-24 flex items-center justify-center mr-4">
           {/* Ganti logo sesuai kebutuhan */}
           <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Bandung_Barat.svg/1200px-Lambang_Kabupaten_Bandung_Barat.svg.png" 
            alt="Logo" 
            className="w-20" 
           />
        </div>
        <div className="text-center flex-1">
          <h3 className="text-xl font-bold uppercase">Pemerintah Kabupaten Bandung Barat</h3>
          <h2 className="text-2xl font-bold uppercase">Kecamatan Ngamprah</h2>
          <h1 className="text-3xl font-bold uppercase">Desa Sukatani</h1>
          <p className="text-sm italic">Jl. Raya Desa Sukatani No. 123, Telp (022) 1234567</p>
        </div>
      </div>

      {/* ... ISI SURAT ... */}
      <div className="px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold underline uppercase decoration-2 underline-offset-4">{data.nama_surat}</h2>
          <p className="text-lg mt-1">Nomor: {data.nomor_surat || "___/___/___/2025"}</p>
        </div>

        <p className="mb-4 text-justify text-lg">
          Yang bertanda tangan di bawah ini Kepala Desa Sukatani, Kecamatan Ngamprah, Kabupaten Bandung Barat, menerangkan dengan sebenarnya bahwa:
        </p>

        <table className="w-full mb-6 text-lg">
          <tbody>
            <tr><td className="w-48 py-1">Nama Lengkap</td><td>: <b>{data.pemohon}</b></td></tr>
            <tr><td className="py-1">NIK</td><td>: {data.nik}</td></tr>
            <tr><td className="py-1">Alamat</td><td>: {data.alamat_user}</td></tr>
            {data.data_request && Object.entries(data.data_request).map(([key, value]) => (
              <tr key={key}><td className="py-1 capitalize">{key.replace(/_/g, ' ')}</td><td>: {value}</td></tr>
            ))}
          </tbody>
        </table>

        <p className="mb-12 text-justify text-lg">
          Demikian surat keterangan ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
        </p>

        <div className="flex justify-end"><div className="text-center w-64"><p className="mb-24">Kepala Desa Sukatani</p><p className="font-bold underline">H. ADMIN DESA, S.IP</p></div></div>
      </div>
    </div>
  );
};