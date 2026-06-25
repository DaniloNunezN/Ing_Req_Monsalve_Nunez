import { Bell, BookOpen, AlertTriangle, Info, Check, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { MOCK_NOTIFICATIONS, Notification } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const TYPE_STYLES: Record<string, { icon: React.ReactNode; bg: string; color: string; iconBg: string }> = {
  devolucion: { icon: <BookOpen size={16} />, bg: 'var(--card)', color: '#1D4ED8', iconBg: '#EFF6FF' },
  reserva: { icon: <Bell size={16} />, bg: 'var(--card)', color: '#16A34A', iconBg: '#F0FDF4' },
  alerta: { icon: <AlertTriangle size={16} />, bg: 'var(--card)', color: '#D97706', iconBg: '#FEF3C7' },
  info: { icon: <Info size={16} />, bg: 'var(--card)', color: '#6B7280', iconBg: '#F3F4F6' },
};

export function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const relevant = notifs.filter(n => n.usuarioId === user?.id || user?.rol === 'admin' || user?.rol === 'superadmin' || user?.rol === 'bibliotecario');
  const displayed = filter === 'unread' ? relevant.filter(n => !n.leida) : relevant;
  const unreadCount = relevant.filter(n => !n.leida).length;

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, leida: true })));

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 60) return `hace ${diff} min`;
    if (diff < 1440) return `hace ${Math.floor(diff / 60)} h`;
    return `hace ${Math.floor(diff / 1440)} días`;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Notificaciones</h2>
          {unreadCount > 0 && <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>{unreadCount} sin leer</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'var(--secondary)', color: 'var(--primary)', fontSize: 13, fontWeight: 500 }}>
            <CheckCheck size={15} /> Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[{ key: 'all', label: 'Todas' }, { key: 'unread', label: 'Sin leer' }].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key as 'all' | 'unread')} className="px-4 py-2 rounded-xl transition-all" style={{ fontSize: 13, background: filter === t.key ? 'var(--primary)' : 'var(--card)', color: filter === t.key ? 'white' : 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
            {t.label} {t.key === 'unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--muted)' }}>
            <Bell size={28} style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>Sin notificaciones</p>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 4 }}>
            {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No hay notificaciones disponibles'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(n => {
            const s = TYPE_STYLES[n.tipo];
            return (
              <div
                key={n.id}
                className="flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer"
                style={{ background: n.leida ? 'var(--card)' : 'var(--secondary)', border: `1px solid ${n.leida ? 'var(--border)' : 'rgba(30,77,143,0.2)'}` }}
                onClick={() => markRead(n.id)}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p style={{ fontSize: 14, fontWeight: n.leida ? 400 : 600, color: 'var(--foreground)' }}>{n.titulo}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span style={{ fontSize: 12, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{formatTime(n.fecha)}</span>
                      {!n.leida && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--primary)' }} />}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 3, lineHeight: 1.5 }}>{n.mensaje}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
