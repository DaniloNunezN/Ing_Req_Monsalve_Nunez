import { useState } from 'react';
import { Search, Grid, List, Filter, X, BookOpen, MapPin, Star } from 'lucide-react';
import { MOCK_BOOKS, Book } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const CATEGORIAS = [...new Set(MOCK_BOOKS.map(b => b.categoria))];
const MATERIAS = [...new Set(MOCK_BOOKS.map(b => b.materia))];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  disponible: { bg: '#DCFCE7', color: '#15803D', label: 'Disponible' },
  prestado: { bg: '#FEE2E2', color: '#DC2626', label: 'Prestado' },
  reservado: { bg: '#FEF3C7', color: '#D97706', label: 'Reservado' },
  mantenimiento: { bg: '#F3F4F6', color: '#6B7280', label: 'Mantenimiento' },
};

interface CatalogProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export function Catalog({ onNavigate }: CatalogProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const canReserve = user && ['estudiante', 'docente'].includes(user.rol);

  const filtered = MOCK_BOOKS.filter(b => {
    const q = query.toLowerCase();
    const matchQuery = !query || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.isbn.includes(q) || b.materia.toLowerCase().includes(q);
    const matchMateria = !selectedMateria || b.materia === selectedMateria;
    const matchCategoria = !selectedCategoria || b.categoria === selectedCategoria;
    const matchEstado = !selectedEstado || b.estado === selectedEstado;
    return matchQuery && matchMateria && matchCategoria && matchEstado;
  });

  const handleReserve = (book: Book) => {
    if (book.estado !== 'disponible') {
      toast.error('Este libro no está disponible para reserva.');
      return;
    }
    toast.success(`Reserva de "${book.titulo}" realizada con éxito. Tienes 24 horas para retirarlo.`);
  };

  if (selectedBook) {
    return <BookDetail book={selectedBook} onBack={() => setSelectedBook(null)} onReserve={handleReserve} canReserve={canReserve ?? false} />;
  }

  return (
    <div className="flex h-full">
      {/* Filters sidebar */}
      {showFilters && (
        <div className="w-56 flex-shrink-0 p-5 overflow-y-auto" style={{ borderRight: '1px solid var(--border)', background: 'var(--card)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>Filtros</h3>
            {(selectedMateria || selectedCategoria || selectedEstado) && (
              <button onClick={() => { setSelectedMateria(''); setSelectedCategoria(''); setSelectedEstado(''); }} style={{ fontSize: 12, color: 'var(--primary)' }}>Limpiar</button>
            )}
          </div>

          <FilterSection title="Estado">
            {['disponible', 'prestado', 'reservado'].map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer py-1">
                <input type="radio" name="estado" checked={selectedEstado === s} onChange={() => setSelectedEstado(selectedEstado === s ? '' : s)} style={{ accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{STATUS_STYLES[s].label}</span>
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Materia">
            {MATERIAS.map(m => (
              <label key={m} className="flex items-center gap-2 cursor-pointer py-1">
                <input type="radio" name="materia" checked={selectedMateria === m} onChange={() => setSelectedMateria(selectedMateria === m ? '' : m)} style={{ accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{m}</span>
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Categoría">
            {CATEGORIAS.map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer py-1">
                <input type="radio" name="categoria" checked={selectedCategoria === c} onChange={() => setSelectedCategoria(selectedCategoria === c ? '' : c)} style={{ accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: 13, color: 'var(--foreground)' }}>{c}</span>
              </label>
            ))}
          </FilterSection>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 flex-1 max-w-md px-3 py-2.5 rounded-xl" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
              <input type="text" placeholder="Buscar por título, autor o ISBN..." value={query} onChange={e => setQuery(e.target.value)} className="bg-transparent outline-none flex-1" style={{ fontSize: 14, color: 'var(--foreground)' }} />
              {query && <button onClick={() => setQuery('')}><X size={14} style={{ color: 'var(--muted-foreground)' }} /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all" style={{ background: showFilters ? 'var(--secondary)' : 'var(--input-background)', color: showFilters ? 'var(--primary)' : 'var(--muted-foreground)', border: '1px solid var(--border)', fontSize: 13 }}>
              <Filter size={15} /> Filtros
            </button>
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <button onClick={() => setViewMode('grid')} className="px-3 py-2.5 transition-colors" style={{ background: viewMode === 'grid' ? 'var(--primary)' : 'var(--card)', color: viewMode === 'grid' ? 'white' : 'var(--muted-foreground)' }}>
                <Grid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className="px-3 py-2.5 transition-colors" style={{ background: viewMode === 'list' ? 'var(--primary)' : 'var(--card)', color: viewMode === 'list' ? 'white' : 'var(--muted-foreground)' }}>
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}><strong style={{ color: 'var(--foreground)' }}>{filtered.length}</strong> resultado{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <BookOpen size={48} style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', marginTop: 16 }}>Sin resultados</p>
              <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 4 }}>Intenta con otros términos o ajusta los filtros</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(book => (
                <BookCard key={book.id} book={book} onView={() => setSelectedBook(book)} onReserve={handleReserve} canReserve={canReserve ?? false} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(book => (
                <BookRow key={book.id} book={book} onView={() => setSelectedBook(book)} onReserve={handleReserve} canReserve={canReserve ?? false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', letterSpacing: '0.06em', marginBottom: 8, textTransform: 'uppercase' }}>{title}</p>
      {children}
    </div>
  );
}

function BookCard({ book, onView, onReserve, canReserve }: { book: Book; onView: () => void; onReserve: (b: Book) => void; canReserve: boolean }) {
  const s = STATUS_STYLES[book.estado];
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer group" style={{ background: 'var(--card)', border: '1px solid var(--border)' }} onClick={onView}>
      <div className="relative h-44 overflow-hidden" style={{ background: 'var(--muted)' }}>
        <img src={book.portada} alt={book.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
      </div>
      <div className="p-3">
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.4 }} className="line-clamp-2">{book.titulo}</p>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>{book.autor}</p>
        <div className="flex items-center gap-1 mt-2">
          <MapPin size={11} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
          <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{book.ubicacion}</p>
        </div>
        {canReserve && book.estado === 'disponible' && (
          <button
            onClick={e => { e.stopPropagation(); onReserve(book); }}
            className="w-full mt-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
            style={{ background: 'var(--primary)', fontSize: 12, fontWeight: 500 }}
          >
            Reservar
          </button>
        )}
      </div>
    </div>
  );
}

function BookRow({ book, onView, onReserve, canReserve }: { book: Book; onView: () => void; onReserve: (b: Book) => void; canReserve: boolean }) {
  const s = STATUS_STYLES[book.estado];
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:shadow-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)' }} onClick={onView}>
      <img src={book.portada} alt={book.titulo} className="w-12 h-16 rounded object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{book.titulo}</p>
        <p style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{book.autor} · {book.editorial}, {book.anio}</p>
        <div className="flex items-center gap-4 mt-1">
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>ISBN: {book.isbn}</span>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{book.materia}</span>
          <div className="flex items-center gap-1"><MapPin size={11} style={{ color: 'var(--muted-foreground)' }} /><span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{book.ubicacion}</span></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
        {canReserve && book.estado === 'disponible' && (
          <button onClick={e => { e.stopPropagation(); onReserve(book); }} className="px-4 py-1.5 rounded-lg text-white" style={{ background: 'var(--primary)', fontSize: 12 }}>Reservar</button>
        )}
      </div>
    </div>
  );
}

function BookDetail({ book, onBack, onReserve, canReserve }: { book: Book; onBack: () => void; onReserve: (b: Book) => void; canReserve: boolean }) {
  const s = STATUS_STYLES[book.estado];
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 transition-colors" style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 500 }}>
        ← Volver al catálogo
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '3/4' }}>
            <img src={book.portada} alt={book.titulo} className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>Estado</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
            </div>
            <div className="space-y-2">
              <InfoRow label="Ejemplares" value={`${book.ejemplaresDisponibles} / ${book.ejemplares} disponibles`} />
              <InfoRow label="Ubicación" value={book.ubicacion} />
              <InfoRow label="Código" value={book.codigo} />
            </div>
            {canReserve && (
              <button
                onClick={() => onReserve(book)}
                disabled={book.estado !== 'disponible'}
                className="w-full mt-4 py-2.5 rounded-xl font-semibold text-white transition-all"
                style={{ background: book.estado === 'disponible' ? 'var(--primary)' : 'var(--muted)', cursor: book.estado === 'disponible' ? 'pointer' : 'not-allowed' }}
              >
                {book.estado === 'disponible' ? 'Reservar libro' : 'No disponible'}
              </button>
            )}
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-3 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>{book.materia}</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{book.categoria}</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.3 }}>{book.titulo}</h1>
            <p style={{ fontSize: 16, color: 'var(--muted-foreground)', marginTop: 6 }}>{book.autor}</p>
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.8 }}>{book.descripcion}</p>
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <InfoRow label="ISBN" value={book.isbn} />
            <InfoRow label="Editorial" value={book.editorial} />
            <InfoRow label="Año" value={String(book.anio)} />
            <InfoRow label="Edición" value={book.edicion} />
            <InfoRow label="Páginas" value={String(book.paginas)} />
            <InfoRow label="Idioma" value={book.idioma} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>{value}</span>
    </div>
  );
}
