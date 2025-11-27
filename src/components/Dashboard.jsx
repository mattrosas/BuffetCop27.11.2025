import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GerenteView from './GerenteView';
import AdminView from './AdminView';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  if (!user) return null;

  // === ROL: GERENTE (Vista Limitada) ===
  if (user.rol === 'gerente') {
    return <GerenteView user={user} />;
  }

  // === ROL: ADMIN, ADMIN BUFFET, ADMIN COOP O EMPLEADO COOP ===
  // Todos ellos usan la vista principal, pero AdminView se encarga de ocultar botones
  return <AdminView user={user} />;
}
