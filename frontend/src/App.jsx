// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import InformasiPublik from './pages/admin/InformasiPublik';
import ManajemenSurat from './pages/admin/ManajemenSurat';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Public */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route Khusus Admin (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="informasi" element={<InformasiPublik />} />
          <Route path="surat" element={<ManajemenSurat />} />
          
          {/* Nanti kita tambah halaman lain disini */}
          
          <Route path="pengaduan" element={<div>Halaman Pengaduan (Coming Soon)</div>} />
          <Route path="users" element={<div>Halaman Users (Coming Soon)</div>} />
        </Route>

        {/* Redirect Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>Halaman Tidak Ditemukan (404)</div>} />
      </Routes>
    </Router>
  );

  // INI DEFAULT VITE CONTENT
  // const [count, setCount] = useState(0)

  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

export default App
