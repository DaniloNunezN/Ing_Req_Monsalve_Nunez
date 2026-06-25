import { useState } from 'react';
import { Search, Plus, CheckCircle, AlertTriangle, Clock, X, BookOpen, User, Loader2 } from 'lucide-react';
import { MOCK_LOANS, MOCK_BOOKS, MOCK_USERS, Loan } from '../data/mockData';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
  prestado: { bg: '#EFF6FF', color: '#1D4ED8', icon: <Clock size={13} />, label: 'Prestado' },
  atrasado: { bg: '#FEF2F2', color: '#DC2626', icon: <AlertTriangle size={13} />, label: 'Atrasado' },
  devuelto: { bg: '#F0FDF4', color: '#16A34A', icon: <CheckCircle size={13} />, label: 'Devuelto' },
};

export function Loans() {
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [filterEstado, setFilterEstado] = useState('');
  const [query, setQuery] = useState('');
  const [showNewLoan, setShowNewLoan] = useState(false);
  const [step, setStep] = useState(1);
  const [bookQuery, setBookQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<typeof MOCK_BOOKS[0] | null>(null);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [processing, setProcessing] = useState(false);

  const filtered = loans.filter(l => {
    const q = query.toLowerCase();
    const matchQuery = !query || l.libro.toLowerCase().includes(q) || l.usuario.toLowerCase().includes(q) || l.comprobante.toLowerCase().includes(q);
    const matchEstado = !filterEstado || l.estado === filterEstado;
    return matchQuery && matchEstado;
  });

  const bookResults = bookQuery.length > 1
    ? MOCK_BOOKS.filter(b => b.estado === 'disponible' && (b.titulo.toLowerCase().includes(bookQuery.toLowerCase()) || b.codigo.toLowerCase().includes(bookQuery.toLowerCase()))).slice(0, 5)
    : [];

  const userResults = userQuery.length > 1
    ? MOCK_USERS.filter(u => u.estado === 'activo' && (u.nombre.toLowerCase().includes(userQuery.toLowerCase()) || u.apellido.toLowerCase().includes(userQuery.toLowerCase()) || u.rut.includes(userQuery))).slice(0, 5)
    : [];

  const confirmLoan = async () => {
    if (!selectedBook || !selectedUser) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    const devolucion = new Date();
    devolucion.setDate(devolucion.getDate() + 14);
    const newLoan: Loan = {
      id: String(Date.now()),
      libroId: selectedBook.id,
      libro: selectedBook.titulo,
      usuarioId: selectedUser.id,
      usuario: `${selectedUser.nombre} ${selectedUser.apellido}`,
      fechaPrestamo: new Date().toISOString().split('T')[0],
      fechaDevolucion: devolucion.toISOString().split('T')[0],
      estado: 'prestado',
      bibliotecario: 'María López',
      comprobante: `PRES-2026-${String(loans.length + 1).padStart(3, '0')}`,
    };
    setLoans(prev => [newLoan, ...prev]);
    setProcessing(false);
    setShowNewLoan(false);
    setStep(1);
    setSelectedBook(null);
    setSelectedUser(null);
    setBookQuery('');
    setUserQuery('');
    toast.success(`Préstamo registrado. Comprobante: ${newLoan.comprobante}`);
  };

  const days = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Préstamos</h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>
            {loans.filter(l => l.estado !== 'devuelto').length} activos · {loans.filter(l => l.estado === 'atrasado').length} atrasados
          </p>
        </div>
        <button onClick={() => { setShowNewLoan(true); setStep(1); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ background: 'var(--primary)', fontSize: 14 }}>
          <Plus size={16} /> Nuevo préstamo
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-sm" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
          <Search size={15} style={{ color: 'var(--muted-foreground)' }} />
          <input type="text" placeholder="Buscar préstamo..." value={query} onChange={e => setQuery(e.target.value)} className="bg-transparent outline-none flex-1" style={{ fontSize: 14, color: 'var(--foreground)' }} />
        </div>
        <div className="flex gap-2">
          {(['', 'prestado', 'atrasado', 'devuelto'] as const).map(s => (
            <button key={s} onClick={() => setFilterEstado(s)} className="px-4 py-2 rounded-xl transition-all" style={{ fontSize: 13, background: filterEstado === s ? 'var(--primary)' : 'var(--card)', color: filterEstado === s ? 'white' : 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
              {s === '' ? 'Todos' : STATUS_STYLES[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-16 text-center"><p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No se encontraron préstamos</p></div>
        ) : filtered.map(loan => {
          const s = STATUS_STYLES[loan.estado];
          const daysLeft = days(loan.fechaDevolucion);
          return (
            <div key={loan.id} className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{loan.libro}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>{loan.usuario}</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
                  {s.icon}{s.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Fecha préstamo</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{loan.fechaPrestamo}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: loan.estado === 'atrasado' ? '#FEF2F2' : 'var(--muted)' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 2 }}>Fecha devolución</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: loan.estado === 'atrasado' ? '#DC2626' : 'var(--foreground)' }}>
                    {loan.fechaDevolucion} {loan.estado === 'prestado' && daysLeft >= 0 && <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>({daysLeft}d)</span>}
                    {loan.estado === 'atrasado' && <span> ({Math.abs(daysLeft)}d atrasado)</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{loan.comprobante}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New loan modal */}
      {showNewLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-lg rounded-2xl shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>Registrar Préstamo</h3>
                <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Paso {step} de 3</p>
              </div>
              <button onClick={() => setShowNewLoan(false)} style={{ color: 'var(--muted-foreground)' }}><X size={18} /></button>
            </div>

            {/* Progress */}
            <div className="px-6 py-3 flex gap-2">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: step >= s ? 'var(--primary)' : 'var(--muted)' }} />
              ))}
            </div>

            <div className="p-6">
              {step === 1 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12 }}>1. Seleccionar libro</h4>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
                    <BookOpen size={15} style={{ color: 'var(--muted-foreground)' }} />
                    <input type="text" placeholder="Buscar por título o código..." value={bookQuery} onChange={e => setBookQuery(e.target.value)} className="bg-transparent outline-none flex-1" style={{ fontSize: 14, color: 'var(--foreground)' }} autoFocus />
                  </div>
                  {selectedBook && (
                    <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ background: 'var(--secondary)', border: '1px solid var(--primary)' }}>
                      <img src={selectedBook.portada} alt="" className="w-10 h-12 rounded object-cover" />
                      <div className="flex-1"><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{selectedBook.titulo}</p><p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{selectedBook.autor}</p></div>
                      <button onClick={() => setSelectedBook(null)}><X size={14} style={{ color: 'var(--primary)' }} /></button>
                    </div>
                  )}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {bookResults.map(b => (
                      <button key={b.id} onClick={() => { setSelectedBook(b); setBookQuery(''); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors" style={{ background: 'var(--muted)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--secondary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}>
                        <img src={b.portada} alt="" className="w-10 h-12 rounded object-cover" />
                        <div><p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{b.titulo}</p><p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{b.codigo} · {b.ubicacion}</p></div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} disabled={!selectedBook} className="w-full mt-4 py-2.5 rounded-xl text-white font-medium" style={{ background: selectedBook ? 'var(--primary)' : 'var(--muted)', cursor: selectedBook ? 'pointer' : 'not-allowed' }}>Continuar →</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12 }}>2. Identificar usuario</h4>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
                    <User size={15} style={{ color: 'var(--muted-foreground)' }} />
                    <input type="text" placeholder="Buscar por nombre o RUT..." value={userQuery} onChange={e => setUserQuery(e.target.value)} className="bg-transparent outline-none flex-1" style={{ fontSize: 14, color: 'var(--foreground)' }} autoFocus />
                  </div>
                  {selectedUser && (
                    <div className="flex items-center gap-3 p-3 rounded-xl mb-3" style={{ background: 'var(--secondary)', border: '1px solid var(--primary)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white" style={{ background: 'var(--primary)', fontSize: 13 }}>{selectedUser.nombre[0]}{selectedUser.apellido[0]}</div>
                      <div className="flex-1"><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{selectedUser.nombre} {selectedUser.apellido}</p><p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{selectedUser.rut} · {selectedUser.rol}</p></div>
                      <button onClick={() => setSelectedUser(null)}><X size={14} style={{ color: 'var(--primary)' }} /></button>
                    </div>
                  )}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userResults.map(u => (
                      <button key={u.id} onClick={() => { setSelectedUser(u); setUserQuery(''); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-left" style={{ background: 'var(--muted)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--secondary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0" style={{ background: 'var(--primary)', fontSize: 12 }}>{u.nombre[0]}{u.apellido[0]}</div>
                        <div><p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{u.nombre} {u.apellido}</p><p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{u.rut}</p></div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>← Volver</button>
                    <button onClick={() => setStep(3)} disabled={!selectedUser} className="flex-1 py-2.5 rounded-xl text-white font-medium" style={{ background: selectedUser ? 'var(--primary)' : 'var(--muted)', cursor: selectedUser ? 'pointer' : 'not-allowed' }}>Continuar →</button>
                  </div>
                </div>
              )}

              {step === 3 && selectedBook && selectedUser && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>3. Confirmar préstamo</h4>
                  <div className="space-y-3 p-4 rounded-xl mb-4" style={{ background: 'var(--muted)' }}>
                    <div className="flex items-center gap-3">
                      <img src={selectedBook.portada} alt="" className="w-12 h-16 rounded object-cover" />
                      <div><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{selectedBook.titulo}</p><p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{selectedBook.autor} · {selectedBook.ubicacion}</p></div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white" style={{ background: 'var(--primary)', fontSize: 12 }}>{selectedUser.nombre[0]}{selectedUser.apellido[0]}</div>
                        <div><p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{selectedUser.nombre} {selectedUser.apellido}</p><p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{selectedUser.rut}</p></div>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Fecha de devolución: <strong style={{ color: 'var(--foreground)' }}>{new Date(Date.now() + 14 * 86400000).toLocaleDateString('es-CL')}</strong> (14 días)</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-xl" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>← Volver</button>
                    <button onClick={confirmLoan} disabled={processing} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-medium" style={{ background: 'var(--primary)' }}>
                      {processing ? <><Loader2 size={15} className="animate-spin" /> Procesando...</> : <><CheckCircle size={15} /> Confirmar</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
