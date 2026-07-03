import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { Inventory } from './pages/Inventory';
import { Loans } from './pages/Loans';
import { Returns } from './pages/Returns';
import { Reservations } from './pages/Reservations';
import { History } from './pages/History';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';

function AppShell() {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    const main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;
  };

  if (!isAuthenticated) return <Login />;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />;
      case 'catalogo': return <Catalog onNavigate={handleNavigate} />;
      case 'inventario': return <Inventory />;
      case 'prestamos': return <Loans />;
      case 'devoluciones': return <Returns />;
      case 'reservas': return <Reservations />;
      case 'historial': return <History />;
      case 'usuarios': return <Users />;
      case 'reportes': return <Reports />;
      case 'notificaciones': return <Notifications />;
      case 'configuracion': return <ConfigPage />;
      case 'perfil': return <Profile />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onNavigate={handleNavigate} darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />
        <main id="main-content" className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function ConfigPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)', marginBottom: 24 }}>Configuración del Sistema</h2>
      <div className="space-y-4">
        {[
          { label: 'Días de préstamo predeterminados', value: '14', type: 'number' },
          { label: 'Máximo de préstamos por usuario', value: '3', type: 'number' },
          { label: 'Horas para reclamar reserva', value: '24', type: 'number' },
          { label: 'Multa diaria por atraso (CLP)', value: '500', type: 'number' },
          { label: 'Correo de notificaciones', value: 'biblioteca@unilib.edu', type: 'email' },
        ].map(f => (
          <div key={f.label} className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <label className="block mb-2" style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>{f.label}</label>
            <input type={f.type} defaultValue={f.value} className="px-3 py-2 rounded-lg outline-none" style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--foreground)' }} />
          </div>
        ))}
        <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', marginBottom: 12 }}>Notificaciones por correo</p>
          {['Recordatorio de vencimiento', 'Préstamo atrasado', 'Reserva disponible', 'Nuevos materiales'].map(opt => (
            <label key={opt} className="flex items-center gap-3 py-2 cursor-pointer">
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: 14, color: 'var(--foreground)' }}>{opt}</span>
            </label>
          ))}
        </div>
        <button className="px-6 py-3 rounded-xl text-white font-medium" style={{ background: 'var(--primary)', fontSize: 14 }}>
          Guardar configuración
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
