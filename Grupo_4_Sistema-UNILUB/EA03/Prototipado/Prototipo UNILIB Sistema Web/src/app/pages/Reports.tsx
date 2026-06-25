import { Download, TrendingUp, Users, BookOpen, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#1E4D8F', '#22C55E', '#F59E0B', '#EF4444', '#6366F1'];

const popularBooks = [
  { titulo: 'Cálculo: Trascendentes', prestamos: 48 },
  { titulo: 'Introducción a Algoritmos', prestamos: 42 },
  { titulo: 'Psicología del Desarrollo', prestamos: 38 },
  { titulo: 'Química General', prestamos: 35 },
  { titulo: 'Derecho Constitucional', prestamos: 29 },
  { titulo: 'Macroeconomía', prestamos: 24 },
];

const monthlyLoans = [
  { mes: 'Ene', prestamos: 245, devoluciones: 238 },
  { mes: 'Feb', prestamos: 312, devoluciones: 305 },
  { mes: 'Mar', prestamos: 380, devoluciones: 371 },
  { mes: 'Abr', prestamos: 298, devoluciones: 285 },
  { mes: 'May', prestamos: 420, devoluciones: 408 },
  { mes: 'Jun', prestamos: 156, devoluciones: 142 },
];

const statusDist = [
  { name: 'Disponibles', value: 8 },
  { name: 'Prestados', value: 3 },
  { name: 'Reservados', value: 2 },
  { name: 'Mantenimiento', value: 1 },
];

const frequentUsers = [
  { usuario: 'Ana García', prestamos: 12 },
  { usuario: 'Carlos Mendoza', prestamos: 9 },
  { usuario: 'Diego Morales', prestamos: 8 },
  { usuario: 'Sofía Herrera', prestamos: 6 },
  { usuario: 'Pedro Soto', prestamos: 5 },
];

const overdueTrend = [
  { semana: 'S1', atrasados: 3 },
  { semana: 'S2', atrasados: 5 },
  { semana: 'S3', atrasados: 4 },
  { semana: 'S4', atrasados: 7 },
  { semana: 'S5', atrasados: 6 },
  { semana: 'S6', atrasados: 2 },
];

export function Reports() {
  const KPI = ({ icon, label, value, change, color }: { icon: React.ReactNode; label: string; value: string; change: string; color: string }) => (
    <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15' }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: change.startsWith('+') ? '#16A34A' : '#DC2626', background: change.startsWith('+') ? '#F0FDF4' : '#FEF2F2', padding: '2px 8px', borderRadius: 20 }}>{change}</span>
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--foreground)' }}>{value}</p>
      <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>{label}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Reportes y Estadísticas</h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>Resumen del período: Enero – Junio 2026</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success('Reporte exportado como PDF')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontSize: 14 }}>
            <Download size={15} /> PDF
          </button>
          <button onClick={() => toast.success('Reporte exportado como Excel')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', fontSize: 14 }}>
            <Download size={15} /> Excel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={<BookOpen size={20} />} label="Préstamos este mes" value="156" change="+12%" color="#1E4D8F" />
        <KPI icon={<Users size={20} />} label="Usuarios activos" value="247" change="+8%" color="#22C55E" />
        <KPI icon={<TrendingUp size={20} />} label="Uso semanal promedio" value="89%" change="+3%" color="#6366F1" />
        <KPI icon={<AlertTriangle size={20} />} label="Tasa de morosidad" value="4.2%" change="-1%" color="#F59E0B" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 20 }}>Préstamos vs Devoluciones (mensual)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyLoans} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="prestamos" name="Préstamos" fill="#1E4D8F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="devoluciones" name="Devoluciones" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 20 }}>Distribución del catálogo</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {statusDist.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statusDist.map((d, idx) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: COLORS[idx] }} />
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 20 }}>Libros más prestados</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={popularBooks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="titulo" type="category" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={130} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="prestamos" name="Préstamos" fill="#1E4D8F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 20 }}>Tendencia de morosidad</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={overdueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="semana" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} />
              <Line type="monotone" dataKey="atrasados" name="Atrasados" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 10 }}>Usuarios frecuentes</h4>
            <div className="space-y-2">
              {frequentUsers.map((u, i) => (
                <div key={u.usuario} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-foreground)', width: 16 }}>#{i + 1}</span>
                    <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{u.usuario}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{u.prestamos} préstamos</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
