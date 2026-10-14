export type Prioridad = 'Alta' | 'Media' | 'Baja';
export type EstadoTicket = 'Registrado' | 'En Proceso' | 'Atendido';

export interface Inspeccion {
  id: string;
  codigoRef: string;
  espacio: string;
  categoriaEspacio?: string;
  tipoNovedad: string;
  prioridad: Prioridad;
  descripcion: string;
  fechaRegistro: string;
  inspector: string;
  estado: EstadoTicket;
}

export interface CategoriaConfig {
  nombre: string;
  icono: string;
  color: string;
}

export const CATEGORIAS_ESPACIOS: CategoriaConfig[] = [
  { nombre: 'Aulas de Clase', icono: 'school-outline', color: '#2563eb' },
  { nombre: 'Laboratorios', icono: 'flask-outline', color: '#7c3aed' },
  { nombre: 'Salas de Cómputo', icono: 'desktop-outline', color: '#0284c7' },
  { nombre: 'Bibliotecas', icono: 'book-outline', color: '#059669' },
  { nombre: 'Auditorios y Teatros', icono: 'easel-outline', color: '#d97706' },
  { nombre: 'Zonas Comunes y Pasillos', icono: 'walk-outline', color: '#4b5563' }
];

export const ESPACIOS_PREDEFINIDOS = [
  'Aula Magna - Bloque A',
  'Aula 101 - Ciencias Básicas',
  'Aula 204 - Ingeniería',
  'Laboratorio de Redes & Cisco',
  'Laboratorio de Química & Biología',
  'Sala de Cómputo Mac Pro',
  'Biblioteca Central - Piso 2',
  'Auditorio Principal Los Fundadores',
  'Zona de Cafetería & Terrazas',
  'Baños y Servicios Bloque Central',
  'Otro espacio personalizado'
];

export const TIPOS_NOVEDADES_CONFIG = [
  { tipo: 'Falla Eléctrica o Iluminación', icono: 'flash-outline', tag: 'Eléctrico' },
  { tipo: 'Conectividad Wi-Fi o Cableado de Red', icono: 'wifi-outline', tag: 'Telecom' },
  { tipo: 'Mobiliario (Sillas, Mesas, Tableros)', icono: 'grid-outline', tag: 'Mobiliario' },
  { tipo: 'Equipos Audiovisuales / VideoBeam', icono: 'videocam-outline', tag: 'Multimedia' },
  { tipo: 'Climatización / Aire Acondicionado', icono: 'snow-outline', tag: 'HVAC' },
  { tipo: 'Limpieza y Aseo Especializado', icono: 'sparkles-outline', tag: 'Aseo' },
  { tipo: 'Infraestructura / Filtraciones y Pintura', icono: 'construct-outline', tag: 'Estructura' },
  { tipo: 'Seguridad / Puertas y Cerraduras', icono: 'shield-checkmark-outline', tag: 'Seguridad' },
  { tipo: 'Otra Novedad Institucional', icono: 'help-circle-outline', tag: 'General' }
];

export const PLANTILLAS_RAPIDAS = [
  'Tomacorrientes sin energía o en corto.',
  'Señal Wi-Fi intermitente o sin acceso a Internet.',
  'Sillas universitarias con respaldo suelto o deteriorado.',
  'Proyector / VideoBeam no enciende o con lámpara defectuosa.',
  'Aire acondicionado con goteo o sin enfriar adecuadamente.',
  'Luminarias parpadeando en la zona frontal del salón.'
];
