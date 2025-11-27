import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/storage';

export default function RegisterCooperadora() {
  // Este formulario fuerza el rol 'admin_cooperadora'
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', rol: 'admin_cooperadora' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = () => {
    if (!form.nombre || !form.email || !form.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    const result = registerUser(form);
    
    if (result.success) {
      alert('Administrador de Cooperadora creado exitosamente.');
      navigate('/dashboard'); // Vuelve al panel del Admin Supremo
    } else {
      setError(result.msg);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Crear Admin Cooperadora</h2>
        <p style={{marginBottom: '15px', color: '#666'}}>Este usuario tendrá acceso al panel de gestión.</p>
        <div className="error">{error}</div>
        
        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        
        <button onClick={handleRegister} style={{backgroundColor: '#28a745'}}>Crear Admin Cooperadora</button>
        
        <button onClick={() => navigate('/dashboard')} style={{backgroundColor: '#6c757d', marginTop: '10px'}}>
            Cancelar
        </button>
      </div>
    </div>
  );
}
