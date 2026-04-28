export interface CrmAgentRow {
    agente: string;
    extension: string;
}

/** Listado mostrado en Inicio: agente y extensión. Actualizar aquí (referencia en AGENTS.md). */
export const CRM_AGENTS: CrmAgentRow[] = [
    { agente: 'nombreAgente', extension: 'nombreExtension' },
];
