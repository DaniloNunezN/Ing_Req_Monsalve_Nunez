export type UserRole = 'estudiante' | 'docente' | 'bibliotecario' | 'editor' | 'admin' | 'superadmin';

export interface User {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: UserRole;
  estado: 'activo' | 'bloqueado' | 'inactivo';
  carrera?: string;
  fechaRegistro: string;
  avatar?: string;
  prestamosActivos: number;
  multasPendientes: number;
}

export interface Book {
  id: string;
  isbn: string;
  codigo: string;
  titulo: string;
  autor: string;
  editorial: string;
  anio: number;
  materia: string;
  categoria: string;
  ubicacion: string;
  estado: 'disponible' | 'prestado' | 'reservado' | 'mantenimiento';
  portada: string;
  descripcion: string;
  ejemplares: number;
  ejemplaresDisponibles: number;
  idioma: string;
  paginas: number;
  edicion: string;
}

export interface Loan {
  id: string;
  libroId: string;
  libro: string;
  usuarioId: string;
  usuario: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: 'prestado' | 'atrasado' | 'devuelto';
  bibliotecario: string;
  comprobante: string;
}

export interface Reservation {
  id: string;
  libroId: string;
  libro: string;
  portada: string;
  usuarioId: string;
  usuario: string;
  fechaReserva: string;
  fechaExpiracion: string;
  estado: 'activa' | 'expirada' | 'completada' | 'cancelada';
  horasRestantes?: number;
}

export interface Notification {
  id: string;
  tipo: 'devolucion' | 'reserva' | 'alerta' | 'info';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  usuarioId: string;
}

export const MOCK_USERS: User[] = [
  { id: '1', rut: '12.345.678-9', nombre: 'Ana', apellido: 'García', correo: 'ana.garcia@unilib.edu', rol: 'estudiante', estado: 'activo', carrera: 'Ingeniería Civil', fechaRegistro: '2024-03-01', prestamosActivos: 2, multasPendientes: 0 },
  { id: '2', rut: '9.876.543-2', nombre: 'Carlos', apellido: 'Mendoza', correo: 'carlos.mendoza@unilib.edu', rol: 'docente', estado: 'activo', carrera: 'Facultad de Ciencias', fechaRegistro: '2023-08-15', prestamosActivos: 1, multasPendientes: 0 },
  { id: '3', rut: '15.234.567-K', nombre: 'María', apellido: 'López', correo: 'maria.lopez@unilib.edu', rol: 'bibliotecario', estado: 'activo', fechaRegistro: '2022-01-10', prestamosActivos: 0, multasPendientes: 0 },
  { id: '4', rut: '11.222.333-4', nombre: 'Pedro', apellido: 'Soto', correo: 'pedro.soto@unilib.edu', rol: 'editor', estado: 'activo', fechaRegistro: '2023-05-20', prestamosActivos: 0, multasPendientes: 0 },
  { id: '5', rut: '8.765.432-1', nombre: 'Laura', apellido: 'Ramírez', correo: 'laura.ramirez@unilib.edu', rol: 'admin', estado: 'activo', fechaRegistro: '2021-11-05', prestamosActivos: 0, multasPendientes: 0 },
  { id: '6', rut: '7.654.321-0', nombre: 'Jorge', apellido: 'Vargas', correo: 'jorge.vargas@unilib.edu', rol: 'superadmin', estado: 'activo', fechaRegistro: '2020-01-01', prestamosActivos: 0, multasPendientes: 0 },
  { id: '7', rut: '16.789.012-3', nombre: 'Sofía', apellido: 'Herrera', correo: 'sofia.herrera@unilib.edu', rol: 'estudiante', estado: 'bloqueado', carrera: 'Derecho', fechaRegistro: '2024-02-14', prestamosActivos: 3, multasPendientes: 2 },
  { id: '8', rut: '13.456.789-5', nombre: 'Diego', apellido: 'Morales', correo: 'diego.morales@unilib.edu', rol: 'estudiante', estado: 'activo', carrera: 'Psicología', fechaRegistro: '2024-01-22', prestamosActivos: 1, multasPendientes: 0 },
];

export const MOCK_BOOKS: Book[] = [
  { id: '1', isbn: '978-0-13-468599-1', codigo: 'INF-001', titulo: 'El arte de escribir código limpio', autor: 'Robert C. Martin', editorial: 'Pearson', anio: 2020, materia: 'Informática', categoria: 'Programación', ubicacion: 'Estante A-12', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop', descripcion: 'Guía definitiva para escribir código mantenible y legible.', ejemplares: 3, ejemplaresDisponibles: 2, idioma: 'Español', paginas: 431, edicion: '2ª' },
  { id: '2', isbn: '978-0-59-651798-3', codigo: 'INF-002', titulo: 'Introducción a los Algoritmos', autor: 'Thomas H. Cormen', editorial: 'MIT Press', anio: 2022, materia: 'Informática', categoria: 'Algoritmos', ubicacion: 'Estante A-05', estado: 'prestado', portada: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop', descripcion: 'El texto estándar sobre algoritmos y estructuras de datos.', ejemplares: 5, ejemplaresDisponibles: 0, idioma: 'Español', paginas: 1292, edicion: '4ª' },
  { id: '3', isbn: '978-84-9835-264-5', codigo: 'DER-001', titulo: 'Derecho Constitucional Chileno', autor: 'José Luis Cea Egaña', editorial: 'Ediciones UC', anio: 2021, materia: 'Derecho', categoria: 'Derecho Público', ubicacion: 'Estante C-03', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=280&fit=crop', descripcion: 'Análisis completo del marco constitucional chileno.', ejemplares: 4, ejemplaresDisponibles: 3, idioma: 'Español', paginas: 580, edicion: '3ª' },
  { id: '4', isbn: '978-0-07-340743-7', codigo: 'MAT-001', titulo: 'Cálculo: Trascendentes Tempranas', autor: 'James Stewart', editorial: 'Cengage', anio: 2019, materia: 'Matemáticas', categoria: 'Cálculo', ubicacion: 'Estante B-08', estado: 'reservado', portada: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=200&h=280&fit=crop', descripcion: 'Texto clásico para cursos de cálculo universitario.', ejemplares: 8, ejemplaresDisponibles: 0, idioma: 'Español', paginas: 1214, edicion: '8ª' },
  { id: '5', isbn: '978-84-291-3443-6', codigo: 'PSI-001', titulo: 'Psicología del Desarrollo Humano', autor: 'Diane E. Papalia', editorial: 'McGraw-Hill', anio: 2018, materia: 'Psicología', categoria: 'Desarrollo', ubicacion: 'Estante D-15', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=280&fit=crop', descripcion: 'Visión panorámica del desarrollo desde la concepción.', ejemplares: 6, ejemplaresDisponibles: 4, idioma: 'Español', paginas: 724, edicion: '12ª' },
  { id: '6', isbn: '978-84-7978-312-8', codigo: 'ADM-001', titulo: 'Principios de Administración', autor: 'Harold Koontz', editorial: 'McGraw-Hill', anio: 2020, materia: 'Administración', categoria: 'Gestión', ubicacion: 'Estante E-02', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=280&fit=crop', descripcion: 'Fundamentos de la teoría y práctica administrativa.', ejemplares: 5, ejemplaresDisponibles: 3, idioma: 'Español', paginas: 684, edicion: '14ª' },
  { id: '7', isbn: '978-0-13-110362-7', codigo: 'INF-003', titulo: 'El Lenguaje de Programación C', autor: 'Brian W. Kernighan', editorial: 'Prentice Hall', anio: 2018, materia: 'Informática', categoria: 'Programación', ubicacion: 'Estante A-11', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200&h=280&fit=crop', descripcion: 'El libro de referencia definitivo para el lenguaje C.', ejemplares: 3, ejemplaresDisponibles: 2, idioma: 'Español', paginas: 274, edicion: '2ª' },
  { id: '8', isbn: '978-607-07-1764-8', codigo: 'QUI-001', titulo: 'Química General', autor: 'Raymond Chang', editorial: 'McGraw-Hill', anio: 2021, materia: 'Química', categoria: 'Química General', ubicacion: 'Estante F-07', estado: 'prestado', portada: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&h=280&fit=crop', descripcion: 'Texto completo para química universitaria de primer año.', ejemplares: 7, ejemplaresDisponibles: 0, idioma: 'Español', paginas: 1046, edicion: '11ª' },
  { id: '9', isbn: '978-84-9003-817-5', codigo: 'HIS-001', titulo: 'Historia de Chile Contemporáneo', autor: 'Gonzalo Vial', editorial: 'Zigzag', anio: 2019, materia: 'Historia', categoria: 'Historia Nacional', ubicacion: 'Estante G-04', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=280&fit=crop', descripcion: 'Recorrido histórico por el Chile del siglo XX y XXI.', ejemplares: 4, ejemplaresDisponibles: 3, idioma: 'Español', paginas: 892, edicion: '1ª' },
  { id: '10', isbn: '978-0-13-659454-7', codigo: 'INF-004', titulo: 'Sistemas Operativos Modernos', autor: 'Andrew S. Tanenbaum', editorial: 'Pearson', anio: 2017, materia: 'Informática', categoria: 'Sistemas', ubicacion: 'Estante A-03', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=200&h=280&fit=crop', descripcion: 'Conceptos fundamentales de los sistemas operativos.', ejemplares: 4, ejemplaresDisponibles: 2, idioma: 'Español', paginas: 1080, edicion: '4ª' },
  { id: '11', isbn: '978-84-9022-756-1', codigo: 'MED-001', titulo: 'Gray Anatomía para Estudiantes', autor: 'Richard Drake', editorial: 'Elsevier', anio: 2022, materia: 'Medicina', categoria: 'Anatomía', ubicacion: 'Estante H-01', estado: 'disponible', portada: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=280&fit=crop', descripcion: 'Atlas anatómico completo para estudiantes de medicina.', ejemplares: 6, ejemplaresDisponibles: 4, idioma: 'Español', paginas: 1138, edicion: '3ª' },
  { id: '12', isbn: '978-607-15-0517-3', codigo: 'ECO-001', titulo: 'Macroeconomía', autor: 'N. Gregory Mankiw', editorial: 'Cengage', anio: 2020, materia: 'Economía', categoria: 'Macroeconomía', ubicacion: 'Estante E-09', estado: 'reservado', portada: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=280&fit=crop', descripcion: 'Principios de macroeconomía con enfoque latinoamericano.', ejemplares: 5, ejemplaresDisponibles: 0, idioma: 'Español', paginas: 548, edicion: '8ª' },
];

export const MOCK_LOANS: Loan[] = [
  { id: '1', libroId: '2', libro: 'Introducción a los Algoritmos', usuarioId: '1', usuario: 'Ana García', fechaPrestamo: '2026-06-01', fechaDevolucion: '2026-06-15', estado: 'atrasado', bibliotecario: 'María López', comprobante: 'PRES-2026-001' },
  { id: '2', libroId: '8', libro: 'Química General', usuarioId: '2', usuario: 'Carlos Mendoza', fechaPrestamo: '2026-06-08', fechaDevolucion: '2026-06-22', estado: 'prestado', bibliotecario: 'María López', comprobante: 'PRES-2026-002' },
  { id: '3', libroId: '1', libro: 'El arte de escribir código limpio', usuarioId: '8', usuario: 'Diego Morales', fechaPrestamo: '2026-06-10', fechaDevolucion: '2026-06-24', estado: 'prestado', bibliotecario: 'María López', comprobante: 'PRES-2026-003' },
  { id: '4', libroId: '3', libro: 'Derecho Constitucional Chileno', usuarioId: '1', usuario: 'Ana García', fechaPrestamo: '2026-05-15', fechaDevolucion: '2026-05-29', estado: 'devuelto', bibliotecario: 'María López', comprobante: 'PRES-2026-004' },
  { id: '5', libroId: '5', libro: 'Psicología del Desarrollo Humano', usuarioId: '7', usuario: 'Sofía Herrera', fechaPrestamo: '2026-05-20', fechaDevolucion: '2026-06-03', estado: 'atrasado', bibliotecario: 'María López', comprobante: 'PRES-2026-005' },
  { id: '6', libroId: '9', libro: 'Historia de Chile Contemporáneo', usuarioId: '2', usuario: 'Carlos Mendoza', fechaPrestamo: '2026-06-05', fechaDevolucion: '2026-06-19', estado: 'prestado', bibliotecario: 'María López', comprobante: 'PRES-2026-006' },
];

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: '1', libroId: '4', libro: 'Cálculo: Trascendentes Tempranas', portada: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=200&h=280&fit=crop', usuarioId: '1', usuario: 'Ana García', fechaReserva: '2026-06-14', fechaExpiracion: '2026-06-15', estado: 'activa', horasRestantes: 18 },
  { id: '2', libroId: '12', libro: 'Macroeconomía', portada: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=280&fit=crop', usuarioId: '8', usuario: 'Diego Morales', fechaReserva: '2026-06-15', fechaExpiracion: '2026-06-16', estado: 'activa', horasRestantes: 6 },
  { id: '3', libroId: '2', libro: 'Introducción a los Algoritmos', portada: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop', usuarioId: '2', usuario: 'Carlos Mendoza', fechaReserva: '2026-06-10', fechaExpiracion: '2026-06-11', estado: 'expirada', horasRestantes: 0 },
  { id: '4', libroId: '7', libro: 'El Lenguaje de Programación C', portada: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200&h=280&fit=crop', usuarioId: '1', usuario: 'Ana García', fechaReserva: '2026-06-01', fechaExpiracion: '2026-06-02', estado: 'completada', horasRestantes: 0 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', tipo: 'devolucion', titulo: 'Devolución próxima', mensaje: 'El libro "Introducción a los Algoritmos" vence en 2 días.', fecha: '2026-06-14T09:00:00', leida: false, usuarioId: '1' },
  { id: '2', tipo: 'reserva', titulo: 'Reserva disponible', mensaje: 'Tu reserva del libro "Cálculo: Trascendentes Tempranas" está lista para retirar.', fecha: '2026-06-15T08:30:00', leida: false, usuarioId: '1' },
  { id: '3', tipo: 'alerta', titulo: 'Préstamo atrasado', mensaje: 'Tienes un préstamo vencido. Por favor devuelve el material a la brevedad.', fecha: '2026-06-13T10:00:00', leida: true, usuarioId: '1' },
  { id: '4', tipo: 'info', titulo: 'Nuevos materiales disponibles', mensaje: 'Se han agregado 15 nuevos libros al catálogo de Ingeniería.', fecha: '2026-06-12T14:00:00', leida: true, usuarioId: '1' },
  { id: '5', tipo: 'devolucion', titulo: 'Devolución atrasada', mensaje: 'El usuario Ana García tiene 1 libro con devolución atrasada.', fecha: '2026-06-16T07:00:00', leida: false, usuarioId: '3' },
  { id: '6', tipo: 'alerta', titulo: 'Usuario bloqueado', mensaje: 'Sofía Herrera ha sido bloqueada por multas pendientes.', fecha: '2026-06-15T16:00:00', leida: false, usuarioId: '5' },
];

export const DEMO_ACCOUNTS = [
  { correo: 'ana.garcia@unilib.edu', contrasena: '123456', userId: '1' },
  { correo: 'carlos.mendoza@unilib.edu', contrasena: '123456', userId: '2' },
  { correo: 'maria.lopez@unilib.edu', contrasena: '123456', userId: '3' },
  { correo: 'pedro.soto@unilib.edu', contrasena: '123456', userId: '4' },
  { correo: 'laura.ramirez@unilib.edu', contrasena: '123456', userId: '5' },
  { correo: 'jorge.vargas@unilib.edu', contrasena: '123456', userId: '6' },
];
