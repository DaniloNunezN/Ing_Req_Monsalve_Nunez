import { useState } from 'react';
import { Save, Edit2, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_LOANS, MOCK_RESERVATIONS } from '../data/mockData';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  estudiante: 'Estudiante',
  docente: 'Docente',
  bibliotecario: 'Bibliotecario',
  editor: 'Editor Catálogo',
  admin: 'Administrador',
  superadmin: 'Superadmin',
};

export function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nombre: user?.nombre || '', apellido: user?.apellido || '', correo: user?.correo || '', carrera: user?.carrera || '', telefono: '+56 9 1234 5678' });
  const [passwordForm, setPasswordForm] = useState({ current: '', nueva: '', confirmar: '' });
  const [showPassForm, setShowPassForm] = useState(false);

  if (!user) return null;

  const userLoans = MOCK_LOANS.filter(l => l.usuarioId === user.id);
  const userReservations = MOCK_RESERVATIONS.filter(r => r.usuarioId === user.id);

  const saveProfile = () => {
    toast.success('Perfil actualizado correctamente.');
    setEditing(false);
  };

  const savePassword = () => {
    if (!passwordForm.current) { toast.error('Ingresa tu contraseña actual.'); return; }
    if (passwordForm.nueva.length < 6) { toast.error('La nueva contraseña debe tener al menos 6 caracteres.'); return; }
    if (passwordForm.nueva !== passwordForm.confirmar) { toast.error('Las contraseñas no coinciden.'); return; }
    toast.success('Contraseña actualizada exitosamente.');
    setShowPassForm(false);
    setPasswordForm({ current: '', nueva: '', confirmar: '' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 24 }}>Mi Perfil</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: avatar + stats */}
        <div className="space-y-5">
          <div className="p-6 rounded-2xl text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white mx-auto mb-4" style={{ background: 'var(--primary)', fontSize: 28 }}>
              {user.nombre[0]}{user.apellido[0]}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>{user.nombre} {user.apellido}</h3>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>{ROLE_LABELS[user.rol]}</span>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 8 }}>Miembro desde {new Date(user.fechaRegistro).toLocaleDateString('es-CL', { year: 'numeric', month: 'long' })}</p>
          </div>

          {/* Stats */}
          <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12 }}>Estadísticas</h4>
            <div className="space-y-3">
              {[
                { icon: <BookOpen size={16} color="var(--primary)" />, label: 'Préstamos activos', value: user.prestamosActivos, bg: 'var(--secondary)' },
                { icon: <Clock size={16} color="#D97706" />, label: 'Reservas activas', value: userReservations.filter(r => r.estado === 'activa').length, bg: '#FEF3C7' },
                { icon: <CheckCircle size={16} color="#16A34A" />, label: 'Total completados', value: userLoans.filter(l => l.estado === 'devuelto').length, bg: '#F0FDF4' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: s.bg }}>
                  {s.icon}
                  <span style={{ fontSize: 13, color: 'var(--foreground)', flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>{s.value}</span>
                </div>
              ))}
              {user.multasPendientes > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FEF2F2' }}>
                  <span style={{ fontSize: 14 }}>⚠️</span>
                  <span style={{ fontSize: 13, color: '#DC2626', flex: 1 }}>Multas pendientes</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#DC2626' }}>{user.multasPendientes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal data */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>Datos personales</h4>
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: editing ? 'var(--muted)' : 'var(--secondary)', color: editing ? 'var(--foreground)' : 'var(--primary)', fontSize: 13 }}>
                <Edit2 size={13} /> {editing ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'nombre', label: 'Nombre' },
                { key: 'apellido', label: 'Apellido' },
                { key: 'correo', label: 'Correo institucional' },
                { key: 'telefono', label: 'Teléfono' },
                { key: 'carrera', label: 'Carrera / Departamento' },
              ].map(f => (
                <div key={f.key} className={f.key === 'correo' ? 'col-span-2' : ''}>
                  <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)' }}>{f.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData[f.key as keyof typeof formData] || ''}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--foreground)' }}
                    />
                  ) : (
                    <p style={{ fontSize: 14, color: 'var(--foreground)', padding: '8px 0' }}>{formData[f.key as keyof typeof formData] || '—'}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)' }}>RUT</label>
                <p style={{ fontSize: 14, color: 'var(--muted-foreground)', padding: '8px 0' }}>{user.rut}</p>
              </div>
            </div>
            {editing && (
              <button onClick={saveProfile} className="flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-white font-medium" style={{ background: 'var(--primary)', fontSize: 14 }}>
                <Save size={15} /> Guardar cambios
              </button>
            )}
          </div>

          {/* Password */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>Seguridad</h4>
              <button onClick={() => setShowPassForm(!showPassForm)} className="px-3 py-1.5 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--primary)', fontSize: 13 }}>
                {showPassForm ? 'Cancelar' : 'Cambiar contraseña'}
              </button>
            </div>
            {showPassForm ? (
              <div className="space-y-3">
                {[
                  { key: 'current', label: 'Contraseña actual' },
                  { key: 'nueva', label: 'Nueva contraseña' },
                  { key: 'confirmar', label: 'Confirmar nueva contraseña' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)' }}>{f.label}</label>
                    <input
                      type="password"
                      value={passwordForm[f.key as keyof typeof passwordForm]}
                      onChange={e => setPasswordForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--foreground)' }}
                      placeholder="••••••••"
                    />
                  </div>
                ))}
                <button onClick={savePassword} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white" style={{ background: 'var(--primary)', fontSize: 14 }}>
                  <Save size={15} /> Actualizar contraseña
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Última actualización: hace 3 meses · ●●●●●●●●</p>
            )}
          </div>

          {/* Recent activity */}
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>Actividad reciente</h4>
            {userLoans.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>Sin actividad registrada</p>
            ) : (
              <div className="space-y-3">
                {userLoans.map(l => (
                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: l.estado === 'devuelto' ? '#F0FDF4' : 'var(--secondary)' }}>
                      {l.estado === 'devuelto' ? <CheckCircle size={15} color="#16A34A" /> : <BookOpen size={15} color="var(--primary)" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.libro}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{l.fechaPrestamo} → {l.fechaDevolucion}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{
                      background: l.estado === 'devuelto' ? '#F0FDF4' : l.estado === 'atrasado' ? '#FEF2F2' : '#EFF6FF',
                      color: l.estado === 'devuelto' ? '#16A34A' : l.estado === 'atrasado' ? '#DC2626' : '#1D4ED8',
                    }}>{l.estado}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
