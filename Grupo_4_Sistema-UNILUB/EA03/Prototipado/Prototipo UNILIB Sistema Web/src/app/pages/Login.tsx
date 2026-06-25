import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { DEMO_ACCOUNTS, MOCK_USERS } from '../data/mockData';

export function Login() {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || !contrasena) { setError('Por favor completa todos los campos.'); return; }
    setError('');
    setLoading(true);
    const result = await login(correo, contrasena);
    setLoading(false);
    if (!result.success) setError(result.error || 'Error al iniciar sesión.');
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySent(true);
  };

  const quickLogin = (userId: string) => {
    const acc = DEMO_ACCOUNTS.find(a => a.userId === userId);
    if (acc) { setCorreo(acc.correo); setContrasena(acc.contrasena); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{ background: 'var(--primary)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full" style={{ background: 'white' }} />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full" style={{ background: 'white' }} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <BookOpen size={20} color="white" />
            </div>
            <span className="text-white font-semibold" style={{ fontSize: 20 }}>UNILIB</span>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-white mb-4" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>
            Sistema de Gestión de Biblioteca Universitaria
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.7 }}>
            Accede al catálogo, gestiona préstamos, reservas y mucho más desde una sola plataforma moderna e intuitiva.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[{ n: '12,450', l: 'Libros' }, { n: '3,280', l: 'Usuarios' }, { n: '98%', l: 'Disponibilidad' }].map(s => (
              <div key={s.l} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <p className="text-white" style={{ fontSize: 22, fontWeight: 700 }}>{s.n}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, position: 'relative', zIndex: 10 }}>
          © 2026 UNILIB · Universidad Nacional
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <BookOpen size={16} color="white" />
            </div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 18 }}>UNILIB</span>
          </div>

          {!showRecovery ? (
            <>
              <div className="mb-8">
                <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--foreground)' }}>Iniciar sesión</h2>
                <p style={{ color: 'var(--muted-foreground)', fontSize: 14, marginTop: 6 }}>Ingresa con tu correo institucional</p>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <p style={{ color: '#DC2626', fontSize: 13 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2" style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>Correo institucional</label>
                  <input
                    type="email"
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                    placeholder="nombre@unilib.edu"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ background: 'var(--input-background)', border: '1.5px solid var(--border)', color: 'var(--foreground)', fontSize: 14 }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,77,143,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label className="block mb-2" style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={contrasena}
                      onChange={e => setContrasena(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all"
                      style={{ background: 'var(--input-background)', border: '1.5px solid var(--border)', color: 'var(--foreground)', fontSize: 14 }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,77,143,0.1)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }}>
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => setShowRecovery(true)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all"
                  style={{ background: loading ? 'var(--muted)' : 'var(--primary)', color: 'white', fontSize: 15 }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#163D75'; }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--primary)'; }}
                >
                  {loading ? <><Loader2 size={17} className="animate-spin" /> Verificando...</> : 'Ingresar al sistema'}
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-8">
                <p className="text-center mb-4" style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 500, letterSpacing: '0.05em' }}>ACCESO RÁPIDO (DEMO)</p>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_USERS.slice(0, 6).map(u => (
                    <button
                      key={u.id}
                      onClick={() => quickLogin(u.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left"
                      style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--secondary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--input-background)'; }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: 'var(--primary)', fontSize: 10, fontWeight: 700 }}>
                        {u.nombre[0]}{u.apellido[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>{u.nombre}</p>
                        <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{u.rol}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-center mt-3" style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Contraseña de demo: <strong>123456</strong></p>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setShowRecovery(false)} className="flex items-center gap-2 mb-6" style={{ color: 'var(--primary)', fontSize: 14 }}>
                ← Volver al inicio de sesión
              </button>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)', marginBottom: 8 }}>Recuperar contraseña</h2>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 14, marginBottom: 24 }}>Ingresa tu correo institucional y te enviaremos un enlace de recuperación.</p>
              {!recoverySent ? (
                <form onSubmit={handleRecovery} className="space-y-4">
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={e => setRecoveryEmail(e.target.value)}
                    placeholder="nombre@unilib.edu"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'var(--input-background)', border: '1.5px solid var(--border)', color: 'var(--foreground)', fontSize: 14 }}
                  />
                  <button type="submit" className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: 'var(--primary)' }}>
                    Enviar enlace de recuperación
                  </button>
                </form>
              ) : (
                <div className="p-6 rounded-xl text-center" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <p style={{ color: '#15803D', fontWeight: 600, marginBottom: 8 }}>Correo enviado</p>
                  <p style={{ color: '#166534', fontSize: 14 }}>Revisa tu bandeja de entrada en {recoveryEmail || 'tu correo'}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
