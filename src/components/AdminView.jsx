import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Storage from '../services/storage';
import BuffetStaff from './BuffetStaff'; 

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

  return (
    <div className="dashboard-container">
      <nav className="main-navbar">
        <button className={`nav-link ${activeSection === null ? 'active' : ''}`} onClick={() => setActiveSection(null)}>🏠 Inicio</button>
        <button className={`nav-link ${activeSection === 'menus' ? 'active' : ''}`} onClick={() => setActiveSection('menus')}>Menús</button>
        <button className={`nav-link ${activeSection === 'reservas' ? 'active' : ''}`} onClick={() => setActiveSection('reservas')}>Reservas</button>
        <button className={`nav-link ${activeSection === 'pagos' ? 'active' : ''}`} onClick={() => setActiveSection('pagos')}>Pagos</button>
        <button className={`nav-link ${activeSection === 'socios' ? 'active' : ''}`} onClick={() => setActiveSection('socios')}>Socios</button>
        
        {/* BOTÓN PERSONAL: SOLO VISIBLE PARA ADMIN BUFFET */}
        {user.rol === 'admin_buffet' && (
            <button className={`nav-link ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}>👨‍🍳 Personal</button>
        )}
      </nav>

      <div className="dashboard-content">
        <div className="welcome-banner">
          <div className="user-info">
            <img src="/Socio.png" alt="avatar" className="user-avatar"/>
            <div>
              <h2>Hola, <span className="highlight-name">{user.nombre} {user.apellido}</span></h2>
              <p className="user-role">
                {user.rol === 'admin' ? 'Administrador Supremo' : 
                 user.rol === 'admin_buffet' ? 'Administrador de Buffet' : 
                 user.rol === 'admin_cooperadora' ? 'Administrador de Cooperadora' : 'Usuario'}
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <button onClick={cerrarSesion} className="logout-btn">Cerrar Sesión</button>
            
            {/* === BOTONES DEL ADMIN SUPREMO === */}
            {user.email === 'Admin@example.com' && (
                <>
                    <button onClick={() => navigate('/registro')} className="action-btn" style={{fontSize: '12px', padding: '8px 15px'}}>
                        + Crear Admin Buffet
                    </button>
                    <button onClick={() => navigate('/registro-cooperadora')} className="action-btn" style={{fontSize: '12px', padding: '8px 15px', backgroundColor: '#28a745'}}>
                        + Crear Admin Cooperadora
                    </button>
                </>
            )}

            {/* === BOTÓN DEL ADMIN BUFFET === */}
            {user.rol === 'admin_buffet' && (
                <button onClick={() => navigate('/registro-gerente')} className="action-btn" style={{fontSize: '12px', padding: '8px 15px', backgroundColor: '#ffc107', color: '#000'}}>
                    + Crear Gerente
                </button>
            )}
          </div>
        </div>

        {activeSection === null && <div className="welcome-placeholder"><h3>Panel de Gestión</h3><p>Seleccione una opción del menú.</p></div>}

        {/* VISTA DE PERSONAL (SOLO BUFFET) */}
        {activeSection === 'personal' && <BuffetStaff />}

        {/* Tablas Normales */}
        {activeSection === 'menus' && <div className="box fade-in"><div className="box-header"><h3>Menús</h3><button className="action-btn" onClick={()=>setShowModalMenu(true)}>+ Nuevo</button></div><table><thead><tr><th>Fecha</th><th>Principal</th><th>Precio</th></tr></thead><tbody>{menus.map((m,i)=><tr key={i}><td>{m.fecha}</td><td>{m.principal}</td><td>${m.precio}</td></tr>)}</tbody></table></div>}
        
        {activeSection === 'reservas' && <div className="box fade-in"><div className="box-header"><h3>Reservas</h3><button className="action-btn" onClick={abrirNuevaReserva}>+ Nueva</button></div><table><thead><tr><th>Socio</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{reservas.map((r,i)=><tr key={i}><td>{r.socio_numero}</td><td>{r.menu_fecha}</td><td><span className={`tag ${r.estado==='Reservado'?'confirmado':'reservado'}`} style={{backgroundColor:r.estado==='Reservado'?'#d4edda':'#f8d7da',color:r.estado==='Reservado'?'#155724':'#721c24'}}>{r.estado||'Reservado'}</span></td><td><button onClick={()=>editarReserva(r)}>✏️</button></td></tr>)}</tbody></table></div>}
        
        {activeSection === 'socios' && <div className="box fade-in"><div className="box-header"><h3>Socios</h3><button className="action-btn" onClick={abrirNuevoSocio}>+ Nuevo</button></div><table><thead><tr><th>N°</th><th>Nombre</th><th>DNI</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{socios.map((s,i)=><tr key={i}><td>{s.numero}</td><td>{s.nombre}</td><td>{s.dni}</td><td><span className='tag' style={{backgroundColor:s.estado==='Inactivo'?'#f8d7da':'#d4edda',color:s.estado==='Inactivo'?'#721c24':'#155724'}}>{s.estado||'Activo'}</span></td><td><button onClick={()=>editarSocio(s)} style={{marginRight:'5px'}}>✏️</button><button onClick={()=>borrarSocio(s.id)} style={{background:'#dc3545', color:'white', border:'none', borderRadius:'3px'}}>🗑️</button></td></tr>)}</tbody></table></div>}
        
        {activeSection === 'pagos' && <div className="box fade-in"><h3>Pagos</h3><table><thead><tr><th>Socio</th><th>Monto</th></tr></thead><tbody>{pagos.map((p,i)=><tr key={i}><td>{p.socio_numero}</td><td>${p.monto}</td></tr>)}</tbody></table></div>}
      </div>

      {/* Modales Genéricos */}
      {showModalMenu && <div className="modal"><div className="modal-content"><span className="close" onClick={()=>setShowModalMenu(false)}>&times;</span><h2>Menú</h2><input name="fecha" type="date" onChange={handleInputChange}/><input name="principal" placeholder="Plato" onChange={handleInputChange}/><input name="precio" type="number" placeholder="Precio" onChange={handleInputChange}/><button className="action-btn full-width" onClick={guardarMenu}>Guardar</button></div></div>}
      
      {showModalSocio && <div className="modal"><div className="modal-content"><span className="close" onClick={()=>setShowModalSocio(false)}>&times;</span><h2>Socio</h2><input name="nombre" placeholder="Nombre" value={formData.nombre||''} onChange={handleInputChange}/><input name="dni" placeholder="DNI" value={formData.dni||''} onChange={handleInputChange}/><input name="numero" placeholder="N°" value={formData.numero||''} onChange={handleInputChange}/><label style={{display:'block', textAlign:'left', marginTop:'10px'}}>Estado:</label><select name="estado" value={formData.estado||'Activo'} onChange={handleInputChange} style={{width:'100%', marginBottom:'15px', padding:'10px'}}><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select><button className="action-btn full-width" onClick={guardarSocio}>Guardar</button></div></div>}
      
      {showModalReserva && <div className="modal"><div className="modal-content"><span className="close" onClick={()=>setShowModalReserva(false)}>&times;</span><h2>Reserva</h2><input name="socio_numero" placeholder="Socio" value={formData.socio_numero||''} onChange={handleInputChange}/><input name="menu_fecha" type="date" value={formData.menu_fecha||''} onChange={handleInputChange}/><label style={{display:'block', textAlign:'left', marginTop:'10px'}}>Estado:</label><select name="estado" value={formData.estado||'Reservado'} onChange={handleInputChange} style={{width:'100%', marginBottom:'15px', padding:'10px'}}><option value="Reservado">Reservado</option><option value="Sin reservar">Sin reservar</option></select><button className="action-btn full-width" onClick={guardarReserva}>Guardar</button></div></div>}
    </div>
  );
}
