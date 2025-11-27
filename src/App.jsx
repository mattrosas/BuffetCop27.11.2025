import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import RegisterGerente from './components/RegisterGerente';
import RegisterCooperadora from './components/RegisterCooperadora'; // NUEVO
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas de Creación de Usuarios */}
        <Route path="/registro" element={<Register />} /> {/* Crea Admin Buffet */}
        <Route path="/registro-gerente" element={<RegisterGerente />} /> {/* Crea Gerente */}
        <Route path="/registro-cooperadora" element={<RegisterCooperadora />} /> {/* Crea Admin Cooperadora */}
        
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
