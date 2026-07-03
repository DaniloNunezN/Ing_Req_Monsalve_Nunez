import { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { MOCK_LOANS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  prestado: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Prestado' },
  atrasado: { bg: '#FEF2F2', color: '#DC2626', label: 'Atrasado' },
  devuelto: { bg: '#F0FDF4', color: '#16A34A', label: 'Devuelto' },
};

export function History() {
  const { user } = useAuth();
  const [filterEstado, setFilterEstado] = useState('');
  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');

  const isAdmin = user && ['admin', 'superadmin', 'bibliotecario'].includes(user.rol);

  const filtered = MOCK_LOANS.filter(l => {
    const matchEstado = !filterEstado || l.estado === filterEstado;
    const matchDesde = !filterFechaDesde || l.fechaPrestamo >= filterFechaDesde;
    const matchHasta = !filterFechaHasta || l.fechaPrestamo <= filterFechaHasta;
    return matchEstado && matchDesde && matchHasta;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Historial de Préstamos</h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>{filtered.length} registros</p>
        </div>
        <button onClick={() => toast.success('Historial exportado como CSV')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: 14 }}>
          <Download size={15} /> Exportar
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Filter size={15} style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 500 }}>Filtros:</span>
        </div>
        <div>
          <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="px-3 py-2 rounded-lg outline-none" style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--foreground)' }}>
            <option value="">Todos los estados</option>
            <option value="prestado">Prestado</option>
            <option value="atrasado">Atrasado</option>
            <option value="devuelto">Devuelto</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Desde</span>
          <input type="date" value={filterFechaDesde} onChange={e => setFilterFechaDesde(e.target.value)} className="px-3 py-2 rounded-lg outline-none" style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--foreground)' }} />
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Hasta</span>
          <input type="date" value={filterFechaHasta} onChange={e => setFilterFechaHasta(e.target.value)} className="px-3 py-2 rounded-lg outline-none" style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--foreground)' }} />
        </div>
        {(filterEstado || filterFechaDesde || filterFechaHasta) && (
          <button onClick={() => { setFilterEstado(''); setFilterFechaDesde(''); setFilterFechaHasta(''); }} style={{ fontSize: 13, color: 'var(--primary)' }}>Limpiar filtros</button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                <th className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Comprobante</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Libro</th>
                {isAdmin && <th className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Usuario</th>}
                <th className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Fecha préstamo</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Fecha devolución</th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} className="px-4 py-12 text-center" style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No hay registros para los filtros seleccionados</td></tr>
              ) : filtered.map((loan, idx) => {
                const s = STATUS_STYLES[loan.estado];
                return (
                  <tr key={loan.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    <td className="px-4 py-3"><span className="font-mono" style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{loan.comprobante}</span></td>
                    <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{loan.libro}</td>
                    {isAdmin && <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{loan.usuario}</td>}
                    <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{loan.fechaPrestamo}</td>
                    <td className="px-4 py-3" style={{ fontSize: 13, color: loan.estado === 'atrasado' ? '#DC2626' : 'var(--muted-foreground)' }}>{loan.fechaDevolucion}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
