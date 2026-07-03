import { BookOpen, Users, Calendar, AlertTriangle, TrendingUp, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_BOOKS, MOCK_LOANS, MOCK_RESERVATIONS, MOCK_USERS, MOCK_NOTIFICATIONS } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const weeklyData = [
  { dia: 'Lun', prestamos: 12, devoluciones: 8 },
  { dia: 'Mar', prestamos: 19, devoluciones: 14 },
  { dia: 'Mié', prestamos: 15, devoluciones: 11 },
  { dia: 'Jue', prestamos: 22, devoluciones: 18 },
  { dia: 'Vie', prestamos: 28, devoluciones: 20 },
  { dia: 'Sáb', prestamos: 9, devoluciones: 12 },
  { dia: 'Dom', prestamos: 4, devoluciones: 6 },
];

const popularBooks = [
  { titulo: 'Cálculo: Trascendentes', consultas: 48 },
  { titulo: 'Introducción a Algoritmos', consultas: 42 },
  { titulo: 'Psicología del Desarrollo', consultas: 38 },
  { titulo: 'Química General', consultas: 35 },
  { titulo: 'Derecho Constitucional', consultas: 29 },
];

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  if (!user) return null;

  const disponibles = MOCK_BOOKS.filter(b => b.estado === 'disponible').length;
  const prestados = MOCK_LOANS.filter(l => l.estado === 'prestado' || l.estado === 'atrasado').length;
  const atrasados = MOCK_LOANS.filter(l => l.estado === 'atrasado').length;
  const reservasActivas = MOCK_RESERVATIONS.filter(r => r.estado === 'activa').length;
  const usuariosActivos = MOCK_USERS.filter(u => u.estado === 'activo').length;
  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.leida).length;

  const isAdmin = ['admin', 'superadmin', 'bibliotecario'].includes(user.rol);
  const isStudent = ['estudiante', 'docente'].includes(user.rol);

  const KPICard = ({ icon, label, value, sub, color, onClick }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string; onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="p-5 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02]"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <ArrowUpRight size={15} style={{ color: 'var(--muted-foreground)' }} />
      </div>
      <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 6 }}>{label}</p>
      {sub && <p style={{ fontSize: 12, color, marginTop: 4, fontWeight: 500 }}>{sub}</p>}
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>Bienvenido, {user.nombre} 👋</h1>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 4 }}>
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Alerts */}
      {(atrasados > 0 || unreadNotifs > 0) && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <AlertTriangle size={17} color="#D97706" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: '#92400E' }}>
            {atrasados > 0 && <span><strong>{atrasados} préstamo(s) atrasado(s)</strong> requieren atención. </span>}
            {unreadNotifs > 0 && <span>Tienes <strong>{unreadNotifs} notificación(es) sin leer</strong>.</span>}
          </p>
          <button onClick={() => onNavigate('notificaciones')} style={{ marginLeft: 'auto', fontSize: 12, color: '#92400E', fontWeight: 600, whiteSpace: 'nowrap' }}>Ver →</button>
        </div>
      )}

      {/* KPIs */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={<BookOpen size={20} />} label="Libros disponibles" value={disponibles} color="#1E4D8F" onClick={() => onNavigate('catalogo')} />
          <KPICard icon={<TrendingUp size={20} />} label="Préstamos activos" value={prestados} sub={atrasados > 0 ? `${atrasados} atrasados` : undefined} color="#F59E0B" onClick={() => onNavigate('prestamos')} />
          <KPICard icon={<Calendar size={20} />} label="Reservas activas" value={reservasActivas} color="#6366F1" onClick={() => onNavigate('reservas')} />
          <KPICard icon={<Users size={20} />} label="Usuarios activos" value={usuariosActivos} color="#22C55E" onClick={() => onNavigate('usuarios')} />
        </div>
      )}

      {isStudent && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard icon={<BookOpen size={20} />} label="Libros disponibles" value={disponibles} color="#1E4D8F" onClick={() => onNavigate('catalogo')} />
          <KPICard icon={<Clock size={20} />} label="Mis préstamos" value={user.prestamosActivos} color="#F59E0B" onClick={() => onNavigate('historial')} />
          <KPICard icon={<Calendar size={20} />} label="Mis reservas" value={reservasActivas} color="#6366F1" onClick={() => onNavigate('reservas')} />
        </div>
      )}

      {/* Charts */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly activity */}
          <div className="lg:col-span-2 p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>Actividad semanal</h3>
              <span className="px-3 py-1 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--primary)', fontSize: 12, fontWeight: 500 }}>Esta semana</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorPrestamos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E4D8F" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1E4D8F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDevoluciones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dia" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} />
                <Area type="monotone" dataKey="prestamos" name="Préstamos" stroke="#1E4D8F" strokeWidth={2} fill="url(#colorPrestamos)" />
                <Area type="monotone" dataKey="devoluciones" name="Devoluciones" stroke="#22C55E" strokeWidth={2} fill="url(#colorDevoluciones)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-1 rounded" style={{ background: '#1E4D8F' }} /><span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Préstamos</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-1 rounded" style={{ background: '#22C55E' }} /><span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Devoluciones</span></div>
            </div>
          </div>

          {/* Popular books */}
          <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 20 }}>Más consultados</h3>
            <div className="space-y-3">
              {popularBooks.map((b, i) => (
                <div key={b.titulo} className="flex items-center gap-3">
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)', width: 18, flexShrink: 0 }}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.titulo}</p>
                    <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(b.consultas / 50) * 100}%`, background: 'var(--primary)' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground)', flexShrink: 0 }}>{b.consultas}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent loans */}
        <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>Préstamos recientes</h3>
            <button onClick={() => onNavigate('prestamos')} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>Ver todos →</button>
          </div>
          <div className="space-y-3">
            {MOCK_LOANS.slice(0, 4).map(loan => (
              <div key={loan.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: loan.estado === 'atrasado' ? '#FEF2F2' : loan.estado === 'devuelto' ? '#F0FDF4' : 'var(--secondary)' }}>
                  {loan.estado === 'atrasado' ? <AlertTriangle size={14} color="#DC2626" /> : loan.estado === 'devuelto' ? <CheckCircle size={14} color="#16A34A" /> : <BookOpen size={14} color="var(--primary)" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loan.libro}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{loan.usuario} · Vence: {loan.fechaDevolucion}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{
                  background: loan.estado === 'atrasado' ? '#FEF2F2' : loan.estado === 'devuelto' ? '#F0FDF4' : '#EFF6FF',
                  color: loan.estado === 'atrasado' ? '#DC2626' : loan.estado === 'devuelto' ? '#16A34A' : '#1D4ED8',
                }}>{loan.estado}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reservations */}
        <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>Reservas activas</h3>
            <button onClick={() => onNavigate('reservas')} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>Ver todas →</button>
          </div>
          <div className="space-y-3">
            {MOCK_RESERVATIONS.filter(r => r.estado === 'activa').map(res => (
              <div key={res.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                <img src={res.portada} alt={res.libro} className="w-10 h-12 rounded object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.libro}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{res.usuario}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 12, fontWeight: 600, color: (res.horasRestantes ?? 0) < 8 ? '#DC2626' : '#D97706' }}>{res.horasRestantes}h</p>
                  <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>restantes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
