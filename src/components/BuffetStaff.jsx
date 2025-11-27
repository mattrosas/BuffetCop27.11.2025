import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Storage from '../services/storage';

export default function BuffetStaff() {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarStaff();
  }, []);

  const cargarStaff = () => {
    // Usamos la nueva función para traer usuarios reales
    setStaff(Storage.getBuffetStaffReal());
  };

  const cambiarPermiso = (email) => {
    Storage.toggleUserPermission(email);
    cargarStaff(); 
  };

  return (
    <div className="box fade-in">
      <div className="box-header">
        <h3>👨‍🍳 Equipo del Buffet</h3>
        <button className="action-btn" onClick={() => navigate('/registro-empleado-buffet')}>
            + Crear Nueva Cuenta
        </button>
      </div>

      <p style={{marginBottom: '20px', color: '#666'}}>
        Gestione el acceso de sus empleados al sistema de Menús.
      </p>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Acceso a Menús</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr><td colSpan="4" style={{textAlign:'center'}}>No hay empleados registrados.</td></tr>
          ) : (
            staff.map((emp) => (
              <tr key={emp.email} style={{ backgroundColor: emp.permisos ? '#e8f5e9' : 'transparent' }}>
                <td>{emp.nombre}</td>
                <td>{emp.apellido}</td>
                <td>{emp.email}</td>
                <td>
                  <button 
                    onClick={() => cambiarPermiso(emp.email)}
                    style={{
                        padding: '8px 15px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        backgroundColor: emp.permisos ? '#28a745' : '#dc3545',
                        color: 'white',
                        transition: '0.3s'
                    }}
                  >
                    {emp.permisos ? '🔓 PERMITIDO' : '🔒 DENEGADO'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
