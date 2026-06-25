import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Search, Calendar } from 'lucide-react';
import { MOCK_RESERVATIONS, MOCK_BOOKS, Reservation } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  activa: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Activa', icon: <Clock size={12} /> },
  expirada: { bg: '#FEF2F2', color: '#DC2626', label: 'Expirada', icon: <XCircle size={12} /> },
  completada: { bg: '#F0FDF4', color: '#16A34A', label: 'Completada', icon: <CheckCircle size={12} /> },
  cancelada: { bg: '#F3F4F6', color: '#6B7280', label: 'Cancelada', icon: <XCircle size={12} /> },
};

export function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [filterEstado, setFilterEstado] = useState<'' | 'activa' | 'expirada' | 'completada' | 'cancelada'>('');
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState('');
  const [timer, setTimer] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTimer(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const isStudent = user && ['estudiante', 'docente'].includes(user.rol);

  const filtered = reservations.filter(r => {
    const matchEstado = !filterEstado || r.estado === filterEstado;
    const q = query.toLowerCase();
    const matchQuery = !query || r.libro.toLowerCase().includes(q) || r.usuario.toLowerCase().includes(q);
    return matchEstado && matchQuery;
  });

  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r));
    toast.success('Reserva cancelada.');
  };

  const bookResults = MOCK_BOOKS.filter(b => b.estado === 'disponible').slice(0, 4);

  const makeReservation = (book: typeof MOCK_BOOKS[0]) => {
    const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newRes: Reservation = {
      id: String(Date.now()),
      libroId: book.id,
      libro: book.titulo,
      portada: book.portada,
      usuarioId: user?.id || '1',
      usuario: user ? `${user.nombre} ${user.apellido}` : 'Usuario',
      fechaReserva: new Date().toISOString().split('T')[0],
      fechaExpiracion: expiration.toISOString().split('T')[0],
      estado: 'activa',
      horasRestantes: 24,
    };
    setReservations(prev => [newRes, ...prev]);
    setShowNew(false);
    toast.success(`Reserva de "${book.titulo}" realizada. Tienes 24 horas para retirarlo.`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Reservas</h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>
            {reservations.filter(r => r.estado === 'activa').length} activas
          </p>
        </div>
        {isStudent && (
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ background: 'var(--primary)', fontSize: 14 }}>
            <Calendar size={16} /> Nueva reserva
          </button>
        )}
      </div>

      {/* Active reservations countdown */}
      {reservations.filter(r => r.estado === 'activa').length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reservations.filter(r => r.estado === 'activa').map(res => {
            const urgent = (res.horasRestantes ?? 24) < 8;
            return (
              <div key={res.id} className="p-4 rounded-2xl border-2 transition-all" style={{ background: 'var(--card)', borderColor: urgent ? '#EF4444' : 'var(--primary)' }}>
                <div className="flex items-start gap-3">
                  <img src={res.portada} alt={res.libro} className="w-12 h-16 rounded object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3 }} className="line-clamp-2">{res.libro}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>{res.usuario}</p>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-xl flex items-center justify-between" style={{ background: urgent ? '#FEF2F2' : 'var(--secondary)' }}>
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: urgent ? '#DC2626' : 'var(--primary)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: urgent ? '#DC2626' : 'var(--primary)' }}>
                      {res.horasRestantes}h restantes
                    </span>
                  </div>
                  <button onClick={() => cancelReservation(res.id)} style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Cancelar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters & search */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input type="text" placeholder="Buscar..." value={query} onChange={e => setQuery(e.target.value)} className="bg-transparent outline-none" style={{ fontSize: 13, color: 'var(--foreground)', width: 160 }} />
        </div>
        <div className="flex gap-2">
          {(['', 'activa', 'expirada', 'completada', 'cancelada'] as const).map(s => (
            <button key={s} onClick={() => setFilterEstado(s)} className="px-3 py-2 rounded-xl transition-all" style={{ fontSize: 12, background: filterEstado === s ? 'var(--primary)' : 'var(--card)', color: filterEstado === s ? 'white' : 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
              {s === '' ? 'Todas' : STATUS_STYLES[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* History table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {['Libro', 'Usuario', 'Fecha reserva', 'Expiración', 'Estado', 'Acción'].map(h => (
                <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center" style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No hay reservas</td></tr>
            ) : filtered.map((res, idx) => {
              const s = STATUS_STYLES[res.estado];
              return (
                <tr key={res.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={res.portada} alt="" className="w-8 h-10 rounded object-cover flex-shrink-0" />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{res.libro}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{res.usuario}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{res.fechaReserva}</td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{res.fechaExpiracion}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit" style={{ background: s.bg, color: s.color }}>{s.icon}{s.label}</span></td>
                  <td className="px-4 py-3">
                    {res.estado === 'activa' && (
                      <button onClick={() => cancelReservation(res.id)} className="px-3 py-1 rounded-lg text-xs" style={{ background: '#FEF2F2', color: '#DC2626' }}>Cancelar</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* New reservation modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>Nueva Reserva</h3>
              <button onClick={() => setShowNew(false)} style={{ color: 'var(--muted-foreground)', fontSize: 18 }}>✕</button>
            </div>
            <div className="p-6">
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 16 }}>Libros disponibles para reservar. La reserva expira en 24 horas.</p>
              <div className="space-y-3">
                {bookResults.map(book => (
                  <div key={book.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                    <img src={book.portada} alt={book.titulo} className="w-10 h-14 rounded object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{book.titulo}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{book.autor}</p>
                      <p style={{ fontSize: 11, color: '#16A34A', marginTop: 2 }}>Disponible · {book.ubicacion}</p>
                    </div>
                    <button onClick={() => makeReservation(book)} className="px-3 py-1.5 rounded-lg text-white text-xs font-medium" style={{ background: 'var(--primary)', flexShrink: 0 }}>Reservar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
