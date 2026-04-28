export type CuentaWhatsapp = 'tramideudas' | 'admin' | null;

export interface AgentWaLead {
    empresa: string;
    recibir: boolean;
    sectores: string[];
}

export interface RolOption {
    _id: string;
    name: string;
}

export interface ProductoOption {
    _id: string;
    nombre: string;
    categoriaNombre: string;
}

export interface DepartamentoOption {
    _id: string;
    nombre: string;
}

export interface EstadisticaOpcion {
    value: string;
    label: string;
}

/** Agente / perfil (alineado con el CRM legacy). */
export interface Agente {
    username: string;
    password: string;
    name: string;
    position: string;
    email: string;
    /** Activo en CRM (legacy: `actived`). */
    actived: boolean;
    dni: string;
    numero: number | null;
    role: string | null;
    extension: number | null;
    gmail_showName: string;
    gmail_username: string;
    cuentaWhatsapp: CuentaWhatsapp;
    estadistica: string;
    capacidades: string[];
    departamento: string[];
    gestionarPotenciales: string[];
    waLead: AgentWaLead;
    puedeVerDocumentosWsp: boolean;
    /** URL o ruta de imagen de perfil (servidor o blob temporal). */
    avatarUrl?: string | null;
}
