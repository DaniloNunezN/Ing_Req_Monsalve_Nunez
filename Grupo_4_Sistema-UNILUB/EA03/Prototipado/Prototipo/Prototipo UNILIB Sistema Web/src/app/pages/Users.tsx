import { useState } from 'react';
import { Plus, Search, Pencil, Lock, Unlock, Trash2, X, AlertCircle, Save } from 'lucide-react';
import { MOCK_USERS, User, UserRole } from '../data/mockData';
import { toast } from 'sonner';

const ROLE_LABELS: Record<UserRole, string> = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  bibliotecario: 'Bibliotecario',
  editor: 'Editor Catálogo',
  admin: 'Administrador',
  superadmin: 'Superadmin',
};

const ROLE_COLORS: Record<UserRole, { bg: string; color: string }> = {
  estudiante: { bg: '#EFF6FF', color: '#1D4ED8' },
  docente: { bg: '#F5F3FF', color: '#6D28D9' },
  bibliotecario: { bg: '#ECFDF5', color: '#065F46' },
  editor: { bg: '#FFF7ED', color: '#C2410C' },
  admin: { bg: '#FEF3C7', color: '#92400E' },
  superadmin: { bg: '#FEF2F2', color: '#DC2626' },
};

function validateRut(rut: string): boolean {
  const clean = rut.replace(/\./g, '').replace('-', '');
  if (clean.length < 8) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();
  let sum = 0, multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expected = 11 - (sum % 11);
  const expectedDv = expected === 11 ? '0' : expected === 10 ? 'K' : String(expected);
  return dv === expectedDv;
}

export function Users() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [query, setQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = users.filter(u => {
    const q = query.toLowerCase();
    return !query || u.nombre.toLowerCase().includes(q) || u.apellido.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q) || u.rut.includes(q);
  });

  const startEdit = (user: User) => { setEditingUser(user); setFormData(user); setIsCreating(false); setFormErrors({}); };
  const startCreate = () => {
    setIsCreating(true); setEditingUser(null); setFormErrors({});
    setFormData({ id: String(Date.now()), rut: '', nombre: '', apellido: '', correo: '', rol: 'estudiante', estado: 'activo', fechaRegistro: new Date().toISOString().split('T')[0], prestamosActivos: 0, multasPendientes: 0 });
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.rut) errors.rut = 'RUT requerido';
    else if (!validateRut(formData.rut)) errors.rut = 'RUT inválido';
    if (!formData.nombre) errors.nombre = 'Nombre requerido';
    if (!formData.apellido) errors.apellido = 'Apellido requerido';
    if (!formData.correo) errors.correo = 'Correo requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) errors.correo = 'Correo inválido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveUser = () => {
    if (!validate()) return;
    if (isCreating) {
      setUsers(prev => [...prev, formData as User]);
      toast.success('Usuario creado exitosamente.');
    } else {
      setUsers(prev => prev.map(u => u.id === formData.id ? formData as User : u));
      toast.success('Usuario actualizado.');
    }
    setEditingUser(null); setIsCreating(false); setFormData({});
  };

  const toggleBlock = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const newState = u.estado === 'bloqueado' ? 'activo' : 'bloqueado';
      toast.success(newState === 'bloqueado' ? `${u.nombre} ha sido bloqueado.` : `${u.nombre} ha sido desbloqueado.`);
      return { ...u, estado: newState };
    }));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setDeleteConfirm(null);
    toast.success('Usuario eliminado.');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Gestión de Usuarios</h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>{users.length} usuarios registrados</p>
        </div>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ background: 'var(--primary)', fontSize: 14 }}>
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 max-w-md" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
        <Search size={15} style={{ color: 'var(--muted-foreground)' }} />
        <input type="text" placeholder="Buscar por nombre, correo o RUT..." value={query} onChange={e => setQuery(e.target.value)} className="bg-transparent outline-none flex-1" style={{ fontSize: 14, color: 'var(--foreground)' }} />
        {query && <button onClick={() => setQuery('')}><X size={14} style={{ color: 'var(--muted-foreground)' }} /></button>}
      </div>

      {/* User cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center"><p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No se encontraron usuarios</p></div>
        ) : filtered.map(u => {
          const roleStyle = ROLE_COLORS[u.rol];
          return (
            <div key={u.id} className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: `1px solid ${u.estado === 'bloqueado' ? '#FECACA' : 'var(--border)'}` }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0" style={{ background: u.estado === 'bloqueado' ? '#9CA3AF' : 'var(--primary)', fontSize: 15 }}>
                  {u.nombre[0]}{u.apellido[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{u.nombre} {u.apellido}</p>
                    {u.estado === 'bloqueado' && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: '#FEE2E2', color: '#DC2626' }}>Bloqueado</span>}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{u.correo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div><span style={{ color: 'var(--muted-foreground)' }}>RUT: </span><span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{u.rut}</span></div>
                <div><span className="px-2 py-0.5 rounded-full" style={{ background: roleStyle.bg, color: roleStyle.color }}>{ROLE_LABELS[u.rol]}</span></div>
                <div><span style={{ color: 'var(--muted-foreground)' }}>Préstamos: </span><span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{u.prestamosActivos}</span></div>
                <div><span style={{ color: 'var(--muted-foreground)' }}>Multas: </span><span style={{ fontWeight: 500, color: u.multasPendientes > 0 ? '#DC2626' : 'var(--foreground)' }}>{u.multasPendientes}</span></div>
              </div>
              <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={() => startEdit(u)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-1 justify-center transition-all" style={{ background: 'var(--secondary)', color: 'var(--primary)', fontSize: 12 }}>
                  <Pencil size={12} /> Editar
                </button>
                <button onClick={() => toggleBlock(u.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-1 justify-center transition-all" style={{ background: u.estado === 'bloqueado' ? '#DCFCE7' : '#FEF3C7', color: u.estado === 'bloqueado' ? '#16A34A' : '#D97706', fontSize: 12 }}>
                  {u.estado === 'bloqueado' ? <><Unlock size={12} /> Desbloquear</> : <><Lock size={12} /> Bloquear</>}
                </button>
                <button onClick={() => setDeleteConfirm(u.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {(editingUser || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={e => { if (e.target === e.currentTarget) { setEditingUser(null); setIsCreating(false); } }}>
          <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{isCreating ? 'Nuevo Usuario' : 'Editar Usuario'}</h3>
              <button onClick={() => { setEditingUser(null); setIsCreating(false); }} style={{ color: 'var(--muted-foreground)' }}><X size={18} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'rut', label: 'RUT *' },
                  { key: 'correo', label: 'Correo institucional *' },
                  { key: 'nombre', label: 'Nombre *' },
                  { key: 'apellido', label: 'Apellido *' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'correo' ? 'col-span-2' : ''}>
                    <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>{f.label}</label>
                    <input
                      type={f.key === 'correo' ? 'email' : 'text'}
                      value={String(formData[f.key as keyof User] ?? '')}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: formErrors[f.key] ? '#FEF2F2' : 'var(--input-background)', border: `1px solid ${formErrors[f.key] ? '#EF4444' : 'var(--border)'}`, fontSize: 13, color: 'var(--foreground)' }}
                      placeholder={f.key === 'rut' ? '12.345.678-9' : f.key === 'correo' ? 'nombre@unilib.edu' : ''}
                    />
                    {formErrors[f.key] && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{formErrors[f.key]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>Rol</label>
                  <select value={formData.rol ?? 'estudiante'} onChange={e => setFormData(p => ({ ...p, rol: e.target.value as UserRole }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--foreground)' }}>
                    {Object.entries(ROLE_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>Estado</label>
                  <select value={formData.estado ?? 'activo'} onChange={e => setFormData(p => ({ ...p, estado: e.target.value as User['estado'] }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--foreground)' }}>
                    <option value="activo">Activo</option>
                    <option value="bloqueado">Bloqueado</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setEditingUser(null); setIsCreating(false); }} className="px-5 py-2 rounded-xl" style={{ background: 'var(--muted)', color: 'var(--foreground)', fontSize: 14 }}>Cancelar</button>
                <button onClick={saveUser} className="flex items-center gap-2 px-5 py-2 rounded-xl text-white" style={{ background: 'var(--primary)', fontSize: 14 }}>
                  <Save size={14} /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="w-full max-w-sm rounded-2xl shadow-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3 p-4 rounded-xl mb-4" style={{ background: '#FEF2F2' }}>
              <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>Eliminar usuario</p>
                <p style={{ fontSize: 13, color: '#991B1B', marginTop: 4 }}>Esta acción es irreversible. ¿Confirmas?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl" style={{ background: 'var(--muted)', color: 'var(--foreground)', fontSize: 14 }}>Cancelar</button>
              <button onClick={() => deleteUser(deleteConfirm)} className="flex-1 py-2 rounded-xl text-white" style={{ background: '#DC2626', fontSize: 14 }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
