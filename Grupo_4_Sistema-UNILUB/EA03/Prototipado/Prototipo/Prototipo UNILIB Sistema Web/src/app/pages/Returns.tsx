import { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, Loader2, X } from 'lucide-react';
import { MOCK_LOANS, Loan } from '../data/mockData';
import { toast } from 'sonner';

export function Returns() {
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<Loan | null>(null);
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<Loan | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);
    await new Promise(r => setTimeout(r, 600));
    const result = loans.find(l =>
      l.estado !== 'devuelto' &&
      (l.comprobante.toLowerCase().includes(query.toLowerCase()) ||
        l.libro.toLowerCase().includes(query.toLowerCase()) ||
        l.usuario.toLowerCase().includes(query.toLowerCase()))
    );
    setFound(result || null);
    setSearching(false);
    if (!result) toast.error('No se encontró un préstamo activo con ese criterio.');
  };

  const confirmReturn = async () => {
    if (!found) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoans(prev => prev.map(l => l.id === found.id ? { ...l, estado: 'devuelto' } : l));
    setSuccess(found);
    setFound(null);
    setQuery('');
    setProcessing(false);
    toast.success('Devolución registrada exitosamente.');
  };

  const daysLate = (date: string) => {
    const diff = Math.ceil((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const activeLoans = loans.filter(l => l.estado !== 'devuelto');
  const overdueLoans = loans.filter(l => l.estado === 'atrasado');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Registro de Devoluciones</h2>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>
          {activeLoans.length} préstamos activos · {overdueLoans.length} atrasados
        </p>
      </div>

      {/* Search */}
      <div className="p-6 rounded-2xl mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>Buscar préstamo para devolver</h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
            <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setFound(null); setSuccess(null); }}
              placeholder="Número de comprobante, libro o usuario..."
              className="bg-transparent outline-none flex-1"
              style={{ fontSize: 14, color: 'var(--foreground)' }}
            />
            {query && <button type="button" onClick={() => { setQuery(''); setFound(null); }}><X size={14} style={{ color: 'var(--muted-foreground)' }} /></button>}
          </div>
          <button type="submit" disabled={searching || !query} className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium" style={{ background: 'var(--primary)', fontSize: 14 }}>
            {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Buscar
          </button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 8 }}>Ejemplos: PRES-2026-001, Algoritmos, Ana García</p>
      </div>

      {/* Found loan */}
      {found && (
        <div className="p-6 rounded-2xl mb-6 border-2" style={{ background: 'var(--card)', borderColor: found.estado === 'atrasado' ? '#EF4444' : 'var(--primary)' }}>
          <div className="flex items-start justify-between mb-4">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>Préstamo encontrado</h3>
            {found.estado === 'atrasado' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <AlertTriangle size={12} /> Atrasado {daysLate(found.fechaDevolucion)} día(s)
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Libro', value: found.libro },
              { label: 'Usuario', value: found.usuario },
              { label: 'Fecha préstamo', value: found.fechaPrestamo },
              { label: 'Fecha vencimiento', value: found.fechaDevolucion },
              { label: 'Comprobante', value: found.comprobante },
              { label: 'Estado', value: found.estado },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{value}</p>
              </div>
            ))}
          </div>
          {found.estado === 'atrasado' && (
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: '#FEF2F2' }}>
              <AlertTriangle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: '#991B1B' }}>Este préstamo tiene <strong>{daysLate(found.fechaDevolucion)} día(s) de atraso</strong>. Se generará una multa correspondiente.</p>
            </div>
          )}
          <button onClick={confirmReturn} disabled={processing} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold" style={{ background: 'var(--primary)', fontSize: 14 }}>
            {processing ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : <><CheckCircle size={16} /> Confirmar devolución</>}
          </button>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-6 rounded-2xl mb-6 text-center" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DCFCE7' }}>
            <CheckCircle size={28} color="#16A34A" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#15803D', marginBottom: 8 }}>Devolución registrada</h3>
          <p style={{ fontSize: 14, color: '#166534' }}>"{success.libro}" ha sido devuelto por {success.usuario}.</p>
          <p style={{ fontSize: 13, color: '#15803D', marginTop: 4 }}>El libro ya está disponible en el catálogo.</p>
          <button onClick={() => setSuccess(null)} className="mt-4 px-6 py-2 rounded-xl text-white" style={{ background: '#16A34A', fontSize: 14 }}>Nueva devolución</button>
        </div>
      )}

      {/* Active loans table */}
      <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>Préstamos activos</h3>
        {activeLoans.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', textAlign: 'center', padding: '20px 0' }}>No hay préstamos activos</p>
        ) : (
          <div className="space-y-2">
            {activeLoans.map(loan => {
              const late = loan.estado === 'atrasado';
              return (
                <div key={loan.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: late ? '#FEF2F2' : 'var(--muted)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: late ? '#FEE2E2' : 'var(--secondary)' }}>
                    {late ? <AlertTriangle size={14} color="#DC2626" /> : <Search size={14} color="var(--primary)" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loan.libro}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{loan.usuario} · Vence: {loan.fechaDevolucion}</p>
                  </div>
                  <button
                    onClick={() => { setFound(loan); setQuery(loan.comprobante); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-3 py-1.5 rounded-lg text-white text-xs"
                    style={{ background: late ? '#DC2626' : 'var(--primary)', flexShrink: 0 }}
                  >
                    Devolver
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
