import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import RegisterGerente from './components/RegisterGerente';
import RegisterCooperadora from './components/RegisterCooperadora'; 
import RegisterCooperadoraEmployee from './components/RegisterCooperadoraEmployee'; // NUEVO
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas de Creación de Usuarios */}
        <Route path="/registro" element={<Register />} /> 
        <Route path="/registro-gerente" element={<RegisterGerente />} /> 
        <Route path="/registro-cooperadora" element={<RegisterCooperadora />} /> 
        <Route path="/registro-empleado-cooperadora" element={<RegisterCooperadoraEmployee />} /> {/* NUEVO */}
        
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
