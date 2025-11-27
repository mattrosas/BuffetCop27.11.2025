import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Storage from '../services/storage';

export default function CooperadoraStaff() {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarStaff();
  }, []);

  const cargarStaff = () => {
    setStaff(Storage.getCooperadoraStaff());
  };

  const cambiarPermiso = (email) => {
    Storage.toggleUserPermission(email);
    cargarStaff(); // Recargar para ver el cambio
  };

  return (
    <div className="box fade-in">
      <div className="box-header">
        <h3>👥 Empleados de Cooperadora</h3>
        <button className="action-btn" onClick={() => navigate('/registro-empleado-cooperadora')}>
            + Crear Nueva Cuenta
        </button>
      </div>

      <p style={{marginBottom: '20px', color: '#666'}}>
        Gestione quién tiene acceso para manipular los datos de la página.
      </p>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Permisos de Edición</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr><td colSpan="4" style={{textAlign:'center'}}>No hay empleados registrados aún.</td></tr>
          ) : (
            staff.map((emp) => (
              <tr key={emp.email} style={{ backgroundColor: emp.permisos ? '#fff3cd' : 'transparent' }}>
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
                    {emp.permisos ? '🔓 HABILITADO' : '🔒 BLOQUEADO'}
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
