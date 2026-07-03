import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../data/mockData';
import {
  LayoutDashboard, BookOpen, Archive, BookMarked, Calendar,
  Users, BarChart3, Settings, User, LogOut, ChevronLeft, ChevronRight,
  BookCopy, Bell
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['estudiante', 'docente', 'bibliotecario', 'editor', 'admin', 'superadmin'] },
  { id: 'catalogo', label: 'Catálogo', icon: <BookOpen size={18} />, roles: ['estudiante', 'docente', 'bibliotecario', 'editor', 'admin', 'superadmin'] },
  { id: 'inventario', label: 'Inventario', icon: <Archive size={18} />, roles: ['editor', 'admin', 'superadmin'] },
  { id: 'prestamos', label: 'Préstamos', icon: <BookCopy size={18} />, roles: ['bibliotecario', 'admin', 'superadmin'] },
  { id: 'devoluciones', label: 'Devoluciones', icon: <BookMarked size={18} />, roles: ['bibliotecario', 'admin', 'superadmin'] },
  { id: 'reservas', label: 'Reservas', icon: <Calendar size={18} />, roles: ['estudiante', 'docente', 'bibliotecario', 'admin', 'superadmin'] },
  { id: 'historial', label: 'Historial', icon: <BarChart3 size={18} />, roles: ['estudiante', 'docente', 'bibliotecario', 'admin', 'superadmin'] },
  { id: 'usuarios', label: 'Usuarios', icon: <Users size={18} />, roles: ['admin', 'superadmin'] },
  { id: 'reportes', label: 'Reportes', icon: <BarChart3 size={18} />, roles: ['admin', 'superadmin'] },
  { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={18} />, roles: ['estudiante', 'docente', 'bibliotecario', 'editor', 'admin', 'superadmin'] },
  { id: 'configuracion', label: 'Configuración', icon: <Settings size={18} />, roles: ['admin', 'superadmin'] },
];

const ROLE_LABELS: Record<UserRole, string> = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  bibliotecario: 'Bibliotecario',
  editor: 'Ed. Catálogo',
  admin: 'Administrador',
  superadmin: 'Superadmin',
};

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user.rol));

  return (
    <aside
      className="flex flex-col h-screen transition-all duration-300 relative"
      style={{
        width: collapsed ? 64 : 240,
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--sidebar-border)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <BookOpen size={16} color="white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-semibold tracking-wide" style={{ fontSize: 16 }}>UNILIB</span>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Biblioteca Universitaria</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2" style={{ scrollbarWidth: 'none' }}>
        {visibleItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 text-left"
              style={{
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                fontWeight: isActive ? 500 : 400,
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ flexShrink: 0, color: isActive ? 'white' : 'rgba(255,255,255,0.55)' }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: 14 }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div style={{ borderTop: '1px solid var(--sidebar-border)', padding: '12px 8px' }}>
        <button
          onClick={() => onNavigate('perfil')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
          style={{ color: 'rgba(255,255,255,0.75)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            {user.nombre[0]}{user.apellido[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-white truncate" style={{ fontSize: 13, fontWeight: 500 }}>{user.nombre} {user.apellido}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{ROLE_LABELS[user.rol]}</p>
            </div>
          )}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 mt-1"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'; (e.currentTarget as HTMLElement).style.color = '#FCA5A5'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13 }}>Cerrar sesión</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-150 hover:scale-110"
        style={{ background: 'var(--primary)', border: '2px solid var(--background)', color: 'white' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
