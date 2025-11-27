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
  
  // Modales
  const [showModalMenu, setShowModalMenu] = useState(false);
  const [showModalSocio, setShowModalSocio] = useState(false);
  const [showModalReserva, setShowModalReserva] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => { recargarDatos(); }, []);

  const recargarDatos = () => {
    setMenus(Storage.getMenus());
    setSocios(Storage.getSocios());
    setReservas(Storage.getReservas());
    setPagos(Storage.getPagos());
  };

  const cerrarSesion = () => { localStorage.removeItem('currentUser'); navigate('/'); };
  const handleInputChange = (e) => { const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setFormData({...formData, [e.target.name]: value}); }

  // === LÓGICA DE PERMISOS (AQUÍ ESTÁ LA CLAVE) ===
  const esAdminSupremo = user.rol === 'admin';
  const esAdminBuffet = user.rol === 'admin_buffet';
  const esEmpleadoBuffet = user.rol === 'user_buffet_employee'; // El empleado raso
  
  // 1. ¿Quién puede editar MENÚS? (Admin Supremo + Jefe Buffet + Empleado Buffet)
  const puedeEditarMenu = esAdminSupremo || esAdminBuffet || esEmpleadoBuffet;

  // 2. ¿Quién puede editar SOCIOS/RESERVAS? (Admin Supremo + Cooperadora)
  const puedeEditarSociosYReservas = esAdminSupremo || user.rol === 'admin_cooperadora';

  // 3. ¿Quién puede gestionar PERSONAL de Buffet? (Solo el Jefe de Buffet)
  const puedeGestionarPersonalBuffet = esAdminBuffet;


  // Funciones de Guardado
  const guardarMenu = () => { if(formData.fecha){ Storage.addMenu(formData); recargarDatos(); setShowModalMenu(false); setFormData({}); } };
  const guardarSocio = () => { if(formData.nombre){ const s = {...formData, estado: formData.estado || 'Activo'}; Storage.addSocio(s); recargarDatos(); setShowModalSocio(false); setFormData({}); } };
  const guardarReserva = () => { if(formData.socio_numero){ Storage.addReserva(formData); recargarDatos(); setShowModalReserva(false); setFormData({}); } };
  
  // Acciones
  const editarMenu = (m) => { setFormData(m); setShowModalMenu(true); };
  const borrarMenu = (id) => { if(window.confirm("¿Borrar menú?")) { Storage.deleteMenu(id); recargarDatos(); } };

  const editarReserva = (r) => { setFormData(r); setShowModalReserva(true); };
  const editarSocio = (s) => { setFormData(s); setShowModalSocio(true); };
  const borrarReserva = (id) => { if(window.confirm("¿Borrar?")) { Storage.deleteReserva(id); recargarDatos(); } };
  const borrarSocio = (id) => { if(window.confirm("¿Borrar?")) { Storage.deleteSocio(id); recargarDatos(); } };
  
  const abrirNuevoMenu = () => { setFormData({}); setShowModalMenu(true); }
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
        
        {/* Solo el JEFE de buffet ve el botón de Personal */}
        {puedeGestionarPersonalBuffet && (
            <button className={`nav-link ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}>👨‍🍳 Personal</button>
        )}
        
        {user.rol === 'admin_cooperadora' && (
            <button className={`nav-link ${activeSection === 'personal_coop' ? 'active' : ''}`} onClick={() => setActiveSection('personal_coop')}>👥 Empleados</button>
        )}
      </nav>

      <div className="dashboard-content">
        <div className="welcome-banner">
          <div className="user-info">
            <img src="/Socio.png" alt="avatar" className="user-avatar"/>
            <div>
              <h2>Hola, <span className="highlight-name">{user.nombre} {user.apellido}</span></h2>
              <p className="user-role">{user.rol.replace(/_/g, ' ').toUpperCase()}</p>
            </div>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <button onClick={cerrarSesion} className="logout-btn">Cerrar Sesión</button>
            
            {esAdminSupremo && (
                <>
                    <button onClick={() => navigate('/registro')} className="action-btn" style={{fontSize: '12px', padding: '8px 15px'}}>+ Crear Admin Buffet</button>
                    <button onClick={() => navigate('/registro-cooperadora')} className="action-btn" style={{fontSize: '12px', padding: '8px 15px', backgroundColor: '#28a745'}}>+ Crear Admin Cooperadora</button>
                </>
            )}

            {/* SOLO EL JEFE DE BUFFET PUEDE CREAR EMPLEADOS */}
            {puedeGestionarPersonalBuffet && (
                <button onClick={() => navigate('/registro-empleado-buffet')} className="action-btn" style={{fontSize: '12px', padding: '8px 15px', backgroundColor: '#ffc107', color: '#000'}}>
                    + Crear Empleado Buffet
                </button>
            )}

            {user.rol === 'admin_cooperadora' && (
                <button onClick={() => navigate('/registro-empleado-cooperadora')} className="action-btn" style={{fontSize: '12px', padding: '8px 15px', backgroundColor: '#17a2b8', color: '#fff'}}>+ Crear Empleado</button>
            )}
          </div>
        </div>

        {activeSection === null && <div className="welcome-placeholder"><h3>Panel de Gestión</h3><p>Seleccione una opción del menú.</p></div>}
        
        {/* VISTAS DE PERSONAL */}
        {activeSection === 'personal' && <BuffetStaff />}
        {activeSection === 'personal_coop' && <CooperadoraStaff />}

        {/* === SECCIÓN MENÚS (Editable por Buffet y Admin) === */}
        {activeSection === 'menus' && (
            <div className="box fade-in">
                <div className="box-header">
                    <h3>Menús</h3>
                    {puedeEditarMenu && <button className="action-btn" onClick={abrirNuevoMenu}>+ Nuevo</button>}
                </div>
                <table>
                    <thead><tr><th>Fecha</th><th>Principal</th><th>Precio</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {menus.map((m,i)=> (
                            <tr key={i}>
                                <td>{m.fecha}</td>
                                <td>{m.principal}</td>
                                <td>${m.precio}</td>
                                <td>
                                    {puedeEditarMenu && (
                                        <>
                                            <button className="action-btn secondary" style={{padding:'5px 10px', fontSize:'12px', marginRight:'5px'}} onClick={()=>editarMenu(m)}>✏️</button>
                                            <button className="action-btn" style={{padding:'5px 10px', fontSize:'12px', background:'#dc3545'}} onClick={()=>borrarMenu(m.id)}>🗑️</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        
        {/* SECCIÓN RESERVAS (Solo lectura para Buffet) */}
        {activeSection === 'reservas' && (
            <div className="box fade-in">
                <div className="box-header"><h3>Reservas</h3>{puedeEditarSociosYReservas && <button className="action-btn" onClick={abrirNuevaReserva}>+ Nueva</button>}</div>
                <table>
                    <thead><tr><th>Socio</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead>
                    <tbody>
                        {reservas.map((r,i)=><tr key={i}><td>{r.socio_numero}</td><td>{r.menu_fecha}</td><td><span className={`tag ${r.estado==='Reservado'?'confirmado':'reservado'}`} style={{backgroundColor:r.estado==='Reservado'?'#d4edda':'#f8d7da',color:r.estado==='Reservado'?'#155724':'#721c24'}}>{r.estado||'Reservado'}</span></td><td>{puedeEditarSociosYReservas && <button onClick={()=>editarReserva(r)}>✏️</button>}</td></tr>)}
                    </tbody>
                </table>
                {!puedeEditarSociosYReservas && <p style={{color:'#888', fontStyle:'italic'}}>* Solo lectura.</p>}
            </div>
        )}
        
        {/* SECCIÓN SOCIOS (Solo lectura para Buffet) */}
        {activeSection === 'socios' && (
            <div className="box fade-in">
                <div className="box-header"><h3>Socios</h3>{puedeEditarSociosYReservas && <button className="action-btn" onClick={abrirNuevoSocio}>+ Nuevo</button>}</div>
                <table>
                    <thead><tr><th>N°</th><th>Nombre</th><th>DNI</th><th>Estado</th><th>Acción</th></tr></thead>
                    <tbody>
                        {socios.map((s,i)=><tr key={i}><td>{s.numero}</td><td>{s.nombre}</td><td>{s.dni}</td><td><span className='tag' style={{backgroundColor:s.estado==='Inactivo'?'#f8d7da':'#d4edda',color:s.estado==='Inactivo'?'#721c24':'#155724'}}>{s.estado||'Activo'}</span></td><td>{puedeEditarSociosYReservas && <><button onClick={()=>editarSocio(s)} style={{marginRight:'5px'}}>✏️</button><button onClick={()=>borrarSocio(s.id)} style={{background:'#dc3545', color:'white', border:'none', borderRadius:'3px'}}>🗑️</button></>}</td></tr>)}
                    </tbody>
                </table>
                {!puedeEditarSociosYReservas && <p style={{color:'#888', fontStyle:'italic'}}>* Solo lectura.</p>}
            </div>
        )}
        
        {activeSection === 'pagos' && <div className="box fade-in"><h3>Pagos</h3><table><thead><tr><th>Socio</th><th>Monto</th></tr></thead><tbody>{pagos.map((p,i)=><tr key={i}><td>{p.socio_numero}</td><td>${p.monto}</td></tr>)}</tbody></table></div>}
      </div>

      {/* Modales */}
      {showModalMenu && puedeEditarMenu && <div className="modal"><div className="modal-content"><span className="close" onClick={()=>setShowModalMenu(false)}>&times;</span><h2>{formData.id?'Editar':'Nuevo'} Menú</h2><input name="fecha" type="date" value={formData.fecha||''} onChange={handleInputChange}/><input name="principal" placeholder="Plato" value={formData.principal||''} onChange={handleInputChange}/><input name="precio" type="number" placeholder="Precio" value={formData.precio||''} onChange={handleInputChange}/><button className="action-btn full-width" onClick={guardarMenu}>Guardar</button></div></div>}
      
      {showModalSocio && puedeEditarSociosYReservas && <div className="modal"><div className="modal-content"><span className="close" onClick={()=>setShowModalSocio(false)}>&times;</span><h2>Socio</h2><input name="nombre" placeholder="Nombre" value={formData.nombre||''} onChange={handleInputChange}/><input name="dni" placeholder="DNI" value={formData.dni||''} onChange={handleInputChange}/><input name="numero" placeholder="N°" value={formData.numero||''} onChange={handleInputChange}/><label style={{display:'block', textAlign:'left', marginTop:'10px'}}>Estado:</label><select name="estado" value={formData.estado||'Activo'} onChange={handleInputChange} style={{width:'100%', marginBottom:'15px', padding:'10px'}}><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select><button className="action-btn full-width" onClick={guardarSocio}>Guardar</button></div></div>}
      
      {showModalReserva && puedeEditarSociosYReservas && <div className="modal"><div className="modal-content"><span className="close" onClick={()=>setShowModalReserva(false)}>&times;</span><h2>Reserva</h2><input name="socio_numero" placeholder="Socio" value={formData.socio_numero||''} onChange={handleInputChange}/><input name="menu_fecha" type="date" value={formData.menu_fecha||''} onChange={handleInputChange}/><label style={{display:'block', textAlign:'left', marginTop:'10px'}}>Estado:</label><select name="estado" value={formData.estado||'Reservado'} onChange={handleInputChange} style={{width:'100%', marginBottom:'15px', padding:'10px'}}><option value="Reservado">Reservado</option><option value="Sin reservar">Sin reservar</option></select><button className="action-btn full-width" onClick={guardarReserva}>Guardar</button></div></div>}
    </div>
  );
}
