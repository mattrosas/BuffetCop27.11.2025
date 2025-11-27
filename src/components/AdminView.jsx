import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Storage from '../services/storage';
import BuffetStaff from './BuffetStaff'; 
import CooperadoraStaff from './CooperadoraStaff';

export default function AdminView({ user }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  
  // Datos
  const [menus, setMenus] = useState([]);
  const [socios, setSocios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [asistencias, setAsistencias] = useState([]);

  // Modales
  const [showModalMenu, setShowModalMenu] = useState(false);
  const [showModalSocio, setShowModalSocio] = useState(false);
  const [showModalReserva, setShowModalReserva] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    recargarDatos();
  }, []);

  const recargarDatos = () => {
    setMenus(Storage.getMenus());
    setSocios(Storage.getSocios());
    setReservas(Storage.getReservas());
    setPagos(Storage.getPagos());
    setAsistencias(Storage.getAsistencias());
  };

  const cerrarSesion = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({...formData, [e.target.name]: value});
  }

  // Guardados
  const guardarMenu = () => { if(formData.fecha){ Storage.addMenu(formData); recargarDatos(); setShowModalMenu(false); setFormData({}); } };
  const guardarSocio = () => { if(formData.nombre){ const s = {...formData, estado: formData.estado || 'Activo'}; Storage.addSocio(s); recargarDatos(); setShowModalSocio(false); setFormData({}); } };
  const guardarReserva = () => { if(formData.socio_numero){ Storage.addReserva(formData); recargarDatos(); setShowModalReserva(false); setFormData({}); } };
  
  // Acciones
  const editarReserva = (r) => { setFormData(r); setShowModalReserva(true); };
  const editarSocio = (s) => { setFormData(s); setShowModalSocio(true); };
  const borrarReserva = (id) => { if(window.confirm("¿Borrar?")) { Storage.deleteReserva(id); recargarDatos(); } };
  const borrarSocio = (id) => { if(window.confirm("¿Borrar?")) { Storage.deleteSocio(id); recargarDatos(); } };
  
  const abrirNuevaReserva = () => { setFormData({ estado: 'Reservado' }); setShowModalReserva(true); } 
  const abrirNuevoSocio = () => { setFormData({ estado: 'Activo' }); setShowModalSocio(true); }

  // Permisos para editar menú (Solo Admin Supremo y Buffet)
  const puedeEditarMenu = user.rol === 'admin' || user.rol === 'admin_buffet';

  return (
    <div className="dashboard-container">
      <nav className="main-navbar">
        <button className={`nav-link ${activeSection === null ? 'active' : ''}`} onClick={() => setActiveSection(null)}>🏠 Inicio</button>
        <button className={`nav-link ${activeSection === 'menus' ? 'active' : ''}`} onClick={() => setActiveSection('menus')}>Menús</button>
        <button className={`nav-link ${activeSection === 'reservas' ? 'active' : ''}`} onClick={() => setActiveSection('reservas')}>Reservas</button>
        <button className={`nav-link ${activeSection === 'pagos' ? 'active' : ''
