import { useState } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { MOCK_BOOKS } from '../data/mockData';

interface HeaderProps {
  onNavigate: (page: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Header({ onNavigate, darkMode, onToggleDark }: HeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  if (!user) return null;

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.leida && (n.usuarioId === user.id || user.rol === 'admin' || user.rol === 'superadmin')).length;
  const searchResults = searchQuery.length > 1
    ? MOCK_BOOKS.filter(b => b.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || b.autor.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const PAGE_TITLES: Record<string, string> = {
    dashboard: 'Dashboard',
    catalogo: 'Catálogo de Libros',
    inventario: 'Inventario',
    prestamos: 'Préstamos',
    devoluciones: 'Devoluciones',
    reservas: 'Reservas',
    historial: 'Historial',
    usuarios: 'Gestión de Usuarios',
    reportes: 'Reportes y Estadísticas',
    notificaciones: 'Notificaciones',
    configuracion: 'Configuración',
    perfil: 'Mi Perfil',
  };

  return (
    <header className="flex items-center gap-4 px-6 py-3 relative" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', height: 60 }}>
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--input-background)' }}>
          <Search size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar libros, autores, ISBN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            className="bg-transparent outline-none flex-1"
            style={{ fontSize: 14, color: 'var(--foreground)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>✕</button>
          )}
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-50 overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {searchResults.map(book => (
              <button
                key={book.id}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                onClick={() => { onNavigate('catalogo'); setSearchQuery(''); }}
              >
                <div className="w-8 h-10 rounded overflow-hidden flex-shrink-0" style={{ background: 'var(--muted)' }}>
                  <img src={book.portada} alt={book.titulo} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{book.titulo}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{book.autor}</p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded text-xs" style={{
                  background: book.estado === 'disponible' ? '#DCFCE7' : book.estado === 'prestado' ? '#FEE2E2' : '#FEF3C7',
                  color: book.estado === 'disponible' ? '#15803D' : book.estado === 'prestado' ? '#DC2626' : '#92400E',
                }}>{book.estado}</span>
              </button>
            ))}
          </div>
        )}
        {showSearch && searchQuery.length > 1 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-50 px-4 py-6 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>No se encontraron resultados para "{searchQuery}"</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{ color: 'var(--muted-foreground)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); onNavigate('notificaciones'); }}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all relative"
            style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#EF4444', fontSize: 9, fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User */}
        <button
          onClick={() => onNavigate('perfil')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: 'var(--primary)' }}>
            {user.nombre[0]}{user.apellido[0]}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{user.nombre}</span>
          <ChevronDown size={13} style={{ color: 'var(--muted-foreground)' }} />
        </button>
      </div>
    </header>
  );
}
