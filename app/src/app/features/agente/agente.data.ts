import type {
    Agente,
    DepartamentoOption,
    EstadisticaOpcion,
    ProductoOption,
    RolOption,
} from './agente.model';

export const GESTIONAR_POTENCIALES_OPCIONES: string[] = [
    'Nuevo',
    'Contactado',
    'En estudio',
    'Descartado',
];

export const ESTADISTICAS_OPCIONES: EstadisticaOpcion[] = [
    { value: 'general', label: 'General' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'operaciones', label: 'Operaciones' },
];

export const ROLES_MOCK: RolOption[] = [
    { _id: 'rol_admin', name: 'Administrador' },
    { _id: 'rol_gestor', name: 'Gestor' },
    { _id: 'rol_comercial', name: 'Comercial' },
];

export const PRODUCTOS_MOCK: ProductoOption[] = [
    { _id: 'p1', nombre: 'Reunificación de deudas', categoriaNombre: 'Financiación' },
    { _id: 'p2', nombre: 'Préstamo personal', categoriaNombre: 'Financiación' },
    { _id: 'p3', nombre: 'Mediación', categoriaNombre: 'Legal' },
    { _id: 'p4', nombre: 'Asesoría laboral', categoriaNombre: 'Legal' },
];

export const DEPARTAMENTOS_MOCK: DepartamentoOption[] = [
    { _id: 'd1', nombre: 'Comercial' },
    { _id: 'd2', nombre: 'Operaciones' },
    { _id: 'd3', nombre: 'Administración' },
];

export const AGENTE_INICIAL_MOCK: Agente = {
    username: 'mcorrales',
    password: '',
    name: 'Manuel Corrales',
    position: 'Gestor senior',
    email: 'manuel.corrales@tramitex.es',
    actived: true,
    dni: '12345678A',
    numero: 1001,
    role: 'rol_gestor',
    extension: 205,
    gmail_showName: 'Manuel Corrales',
    gmail_username: 'gestor@tramitex.es',
    cuentaWhatsapp: 'tramideudas',
    estadistica: 'general',
    capacidades: ['p1', 'p3'],
    departamento: ['d1', 'd2'],
    gestionarPotenciales: ['Nuevo', 'Contactado'],
    waLead: {
        empresa: '',
        recibir: false,
        sectores: [],
    },
    puedeVerDocumentosWsp: false,
    avatarUrl: 'images/admin.png',
};
