import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/storage';

export default function RegisterBuffetEmployee() {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', rol: 'user_buffet_employee' });
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
      alert('Empleado de Buffet creado exitosamente.');
      navigate('/dashboard'); 
    } else {
      setError(result.msg);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Alta Empleado Buffet</h2>
        <p style={{marginBottom: '15px', color: '#666'}}>Crear cuenta para personal de cocina/atención.</p>
        <div className="error">{error}</div>
        
        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        
        <button onClick={handleRegister} style={{backgroundColor: '#ffc107', color: '#000'}}>Registrar Empleado</button>
        
        <button onClick={() => navigate('/dashboard')} style={{backgroundColor: '#6c757d', marginTop: '10px'}}>
            Cancelar
        </button>
      </div>
    </div>
  );
}
