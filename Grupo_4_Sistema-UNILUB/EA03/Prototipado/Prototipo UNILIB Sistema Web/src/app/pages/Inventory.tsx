import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { MOCK_BOOKS, Book } from '../data/mockData';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  disponible: { bg: '#DCFCE7', color: '#15803D', label: 'Disponible' },
  prestado: { bg: '#FEE2E2', color: '#DC2626', label: 'Prestado' },
  reservado: { bg: '#FEF3C7', color: '#D97706', label: 'Reservado' },
  mantenimiento: { bg: '#F3F4F6', color: '#6B7280', label: 'Mantenimiento' },
};

export function Inventory() {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [query, setQuery] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({});

  const filtered = books.filter(b => {
    const q = query.toLowerCase();
    return !query || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.isbn.includes(q) || b.codigo.toLowerCase().includes(q);
  });

  const startEdit = (book: Book) => { setEditingBook(book); setFormData(book); setIsCreating(false); };
  const startCreate = () => {
    setIsCreating(true);
    setEditingBook(null);
    setFormData({ id: String(Date.now()), isbn: '', codigo: '', titulo: '', autor: '', editorial: '', anio: 2024, materia: '', categoria: '', ubicacion: '', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop', descripcion: '', ejemplares: 1, ejemplaresDisponibles: 1, idioma: 'Español', paginas: 0, edicion: '1ª' });
  };
  const cancelEdit = () => { setEditingBook(null); setIsCreating(false); setFormData({}); };

  const saveBook = () => {
    if (!formData.titulo || !formData.autor || !formData.isbn) { toast.error('Completa los campos obligatorios: Título, Autor e ISBN.'); return; }
    if (isCreating) {
      setBooks(prev => [...prev, formData as Book]);
      toast.success('Material agregado al inventario.');
    } else {
      setBooks(prev => prev.map(b => b.id === formData.id ? formData as Book : b));
      toast.success('Material actualizado correctamente.');
    }
    cancelEdit();
  };

  const confirmDelete = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    setDeleteConfirm(null);
    toast.success('Material eliminado del inventario.');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Inventario de Materiales</h2>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 2 }}>{books.length} materiales registrados</p>
        </div>
        <button onClick={startCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium transition-all hover:opacity-90" style={{ background: 'var(--primary)', fontSize: 14 }}>
          <Plus size={16} /> Nuevo material
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 max-w-md" style={{ background: 'var(--input-background)', border: '1px solid var(--border)' }}>
        <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
        <input type="text" placeholder="Buscar por código, ISBN, título o autor..." value={query} onChange={e => setQuery(e.target.value)} className="bg-transparent outline-none flex-1" style={{ fontSize: 14, color: 'var(--foreground)' }} />
        {query && <button onClick={() => setQuery('')}><X size={14} style={{ color: 'var(--muted-foreground)' }} /></button>}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                {['Código', 'ISBN', 'Título', 'Autor', 'Materia', 'Ubicación', 'Ejem.', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-16 text-center" style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>No se encontraron materiales</td></tr>
              ) : filtered.map((book, idx) => {
                const s = STATUS_STYLES[book.estado];
                return (
                  <tr key={book.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    <td className="px-4 py-3"><span className="font-mono" style={{ fontSize: 12, background: 'var(--secondary)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 4 }}>{book.codigo}</span></td>
                    <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{book.isbn}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={book.portada} alt="" className="w-8 h-10 rounded object-cover flex-shrink-0" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{book.titulo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{book.autor}</td>
                    <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{book.materia}</td>
                    <td className="px-4 py-3" style={{ fontSize: 13, color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{book.ubicacion}</td>
                    <td className="px-4 py-3 text-center" style={{ fontSize: 13, color: 'var(--foreground)' }}>{book.ejemplaresDisponibles}/{book.ejemplares}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{ background: s.bg, color: s.color }}>{s.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(book)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'var(--primary)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--secondary)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(book.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: '#DC2626' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {(editingBook || isCreating) && (
        <Modal title={isCreating ? 'Nuevo Material' : 'Editar Material'} onClose={cancelEdit}>
          <div className="grid grid-cols-2 gap-4">
            {([
              { key: 'codigo', label: 'Código *', type: 'text' },
              { key: 'isbn', label: 'ISBN *', type: 'text' },
              { key: 'titulo', label: 'Título *', type: 'text' },
              { key: 'autor', label: 'Autor *', type: 'text' },
              { key: 'editorial', label: 'Editorial', type: 'text' },
              { key: 'anio', label: 'Año', type: 'number' },
              { key: 'materia', label: 'Materia', type: 'text' },
              { key: 'categoria', label: 'Categoría', type: 'text' },
              { key: 'ubicacion', label: 'Ubicación física', type: 'text' },
              { key: 'ejemplares', label: 'Ejemplares', type: 'number' },
            ] as { key: keyof Book; label: string; type: string }[]).map(f => (
              <div key={f.key} className={f.key === 'titulo' || f.key === 'autor' ? 'col-span-2' : ''}>
                <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>{f.label}</label>
                <input
                  type={f.type}
                  value={String(formData[f.key] ?? '')}
                  onChange={e => setFormData(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--foreground)' }}
                />
              </div>
            ))}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>Estado</label>
              <select value={formData.estado ?? 'disponible'} onChange={e => setFormData(p => ({ ...p, estado: e.target.value as Book['estado'] }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ background: 'var(--input-background)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--foreground)' }}>
                <option value="disponible">Disponible</option>
                <option value="prestado">Prestado</option>
                <option value="reservado">Reservado</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={cancelEdit} className="px-5 py-2 rounded-xl" style={{ background: 'var(--muted)', color: 'var(--foreground)', fontSize: 14 }}>Cancelar</button>
            <button onClick={saveBook} className="flex items-center gap-2 px-5 py-2 rounded-xl text-white" style={{ background: 'var(--primary)', fontSize: 14 }}>
              <Save size={15} /> Guardar
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Modal title="Confirmar eliminación" onClose={() => setDeleteConfirm(null)}>
          <div className="flex items-start gap-3 p-4 rounded-xl mb-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>Esta acción no se puede deshacer</p>
              <p style={{ fontSize: 13, color: '#991B1B', marginTop: 4 }}>¿Estás seguro de que deseas eliminar este material del inventario?</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2 rounded-xl" style={{ background: 'var(--muted)', color: 'var(--foreground)', fontSize: 14 }}>Cancelar</button>
            <button onClick={() => confirmDelete(deleteConfirm)} className="px-5 py-2 rounded-xl text-white" style={{ background: '#DC2626', fontSize: 14 }}>Eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
