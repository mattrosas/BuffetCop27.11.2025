// src/services/storage.js

const get = (key) => JSON.parse(localStorage.getItem(key)) || [];
const set = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// === GESTIÓN DE PERSONAL ===
export const getCooperadoraStaff = () => {
    const users = get('users');
    return users.filter(u => u.rol === 'user_cooperadora');
};

export const getBuffetStaffReal = () => {
    const users = get('users');
    // Filtramos usuarios creados para el buffet
    return users.filter(u => u.rol === 'user_buffet_employee');
};

export const toggleUserPermission = (email) => {
    const users = get('users');
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
        users[index].permisos = !users[index].permisos;
        set('users', users);
    }
};

// === USUARIOS ===
export const registerUser = (user) => {
  const users = get('users');
  if (users.find(u => u.email === user.email)) return { success: false, msg: 'Email ya registrado' };
  
  // Por defecto permisos en true para que puedan trabajar al crearse, o false si prefieres bloquearlos de entrada
  users.push({ ...user, rol: user.rol || 'alumno', permisos: true });
  set('users', users);
  return { success: true };
};

export const loginUser = (email, password) => {
  if (email === 'Admin@example.com' && password === '123') {
    return { nombre: 'Admin', apellido: 'Supremo', email: 'Admin@example.com', rol: 'admin', permisos: true };
  }
  const users = get('users');
  return users.find(u => u.email === email && u.password === password);
};

// === MENUS, SOCIOS, ETC ===
export const getMenus = () => get('menus');
export const addMenu = (item) => { const data = get('menus'); data.push({ ...item, id: Date.now(), disponible: true }); set('menus', data); };

export const getSocios = () => get('socios');
export const addSocio = (item) => { 
    const data = get('socios'); 
    if (item.id) { const i = data.findIndex(s => s.id === item.id); if (i !== -1) data[i] = item; } 
    else data.push({ ...item, id: Date.now(), ingreso: new Date().toISOString().split('T')[0] }); 
    set('socios', data); 
};
export const deleteSocio = (id) => { let data = get('socios'); data = data.filter(s => s.id !== id); set('socios', data); };

export const getReservas = () => get('reservas');
export const addReserva = (item) => { 
    const data = get('reservas'); 
    const nueva = { ...item, id: item.id || Date.now(), estado: item.estado || 'reservado', pagado: item.pagado || false };
    const idx = data.findIndex(r => r.id === nueva.id);
    if (idx !== -1) data[idx] = nueva; else data.push(nueva);
    set('reservas', data);
};
export const deleteReserva = (id) => { let data = get('reservas'); data = data.filter(r => r.id !== id); set('reservas', data); };

export const getAsistencias = () => get('asistencias');
export const getPagos = () => get('pagos');
export const getPlanillaTrabajadores = () => [ {id:101, nombre:'Juan', apellido:'Pérez'} ];
