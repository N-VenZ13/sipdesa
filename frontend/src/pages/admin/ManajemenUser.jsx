import { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { FaTrash, FaUserShield, FaUser, FaSearch, FaPlus, FaTimes, FaEdit } from 'react-icons/fa'; // Tambah FaEdit
import { useSelector } from 'react-redux';

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // State Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Penanda Edit atau Tambah
  const [editId, setEditId] = useState(null); // ID user yang sedang diedit

  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    email: '',
    password: '',
    role_id: '2', 
    phone: '',
    address: ''
  });

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const result = users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.nik.includes(search)
    );
    setFilteredUsers(result);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  // --- FUNGSI BUKA MODAL TAMBAH ---
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ nik: '', name: '', email: '', password: '', role_id: '2', phone: '', address: '' });
    setShowModal(true);
  };

  // --- FUNGSI BUKA MODAL EDIT ---
  const handleOpenEdit = (user) => {
    setIsEditMode(true);
    setEditId(user.id);
    // Isi form dengan data user yang dipilih
    setFormData({
      nik: user.nik,
      name: user.name,
      email: user.email,
      password: '', // Kosongkan password (hanya diisi jika ingin diganti)
      role_id: user.role_id,
      phone: user.phone || '',
      address: user.address || ''
    });
    setShowModal(true);
  };

  // --- FUNGSI SIMPAN (CREATE / UPDATE) ---
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Mode UPDATE
        await api.put(`/users/${editId}`, formData);
        Swal.fire('Sukses', 'Data user diperbarui!', 'success');
      } else {
        // Mode CREATE
        await api.post('/users', formData);
        Swal.fire('Sukses', 'User baru ditambahkan!', 'success');
      }
      
      setShowModal(false);
      fetchUsers(); // Refresh tabel

    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin hapus user ini?',
      text: "Data tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        Swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
        fetchUsers();
      } catch (error) {
        Swal.fire('Gagal', 'Gagal menghapus user', 'error');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Cari Nama / NIK..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <button 
            onClick={handleOpenAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow"
          >
            <FaPlus /> <span className="hidden md:inline">Tambah</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 border-b">No</th>
              <th className="p-4 border-b">Nama & NIK</th>
              <th className="p-4 border-b">Kontak</th>
              <th className="p-4 border-b">Role</th>
              <th className="p-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {isLoading ? (
              <tr><td colSpan="5" className="p-6 text-center">Memuat data...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center">Tidak ada user ditemukan.</td></tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b last:border-0">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{user.nik}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone || '-'}</div>
                  </td>
                  <td className="p-4">
                    {user.role_id === 1 ? (
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit">
                        <FaUserShield /> Admin
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit">
                        <FaUser /> Warga
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {/* Tombol EDIT */}
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="text-yellow-500 hover:bg-yellow-50 p-2 rounded transition"
                        title="Edit User"
                      >
                        <FaEdit />
                      </button>

                      {/* Tombol HAPUS (Proteksi akun sendiri) */}
                      {user.id !== currentUser?.id && (
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                          title="Hapus User"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM (REUSABLE UNTUK ADD & EDIT) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold">
                {isEditMode ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Peran (Role)</label>
                <select 
                  className="w-full border p-2 rounded bg-gray-50"
                  value={formData.role_id}
                  onChange={e => setFormData({...formData, role_id: e.target.value})}
                >
                  <option value="2">Warga</option>
                  <option value="1">Administrator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">NIK</label>
                  <input type="text" required maxLength="16" className="w-full border p-2 rounded"
                    value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                   <input type="text" required className="w-full border p-2 rounded"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" required className="w-full border p-2 rounded"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password 
                  {isEditMode && <span className="text-gray-400 font-normal text-xs ml-2">(Kosongkan jika tidak ingin ubah)</span>}
                </label>
                <input 
                  type="password" 
                  className="w-full border p-2 rounded" 
                  placeholder={isEditMode ? "Biarkan kosong..." : "Minimal 6 karakter"}
                  required={!isEditMode} // Wajib diisi kalau mode TAMBAH, opsional kalau mode EDIT
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">No. HP / WA</label>
                  <input type="text" className="w-full border p-2 rounded"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Alamat</label>
                   <input type="text" className="w-full border p-2 rounded"
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition mt-4">
                {isEditMode ? 'Simpan Perubahan' : 'Buat User Baru'}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenUser;