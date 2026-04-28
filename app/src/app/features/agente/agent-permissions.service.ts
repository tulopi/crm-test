import { Injectable, signal } from '@angular/core';

/**
 * Capacidades del usuario actual respecto a la pantalla de agente / perfil.
 * Cuando exista sesión + API, rellenar vía {@link setFromSession} o {@link loadFromApi}.
 */
export interface AgentScreenPermissions {
    /** Bloque «Ajustes administrativos» (rol, extensión, capacidades, etc.). */
    canEditAdminFields: boolean;
    /** Campo contraseña editable (legacy: mismo que admin; se puede unificar desde API). */
    canChangePassword: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AgentPermissionsService {
    private readonly canEditAdminFieldsSig = signal(false);
    private readonly canChangePasswordSig = signal(false);

    /** Por defecto false hasta conectar auth (evita mostrar datos sensibles). */
    canEditAdminFields = this.canEditAdminFieldsSig.asReadonly();
    canChangePassword = this.canChangePasswordSig.asReadonly();

    /**
     * Punto de enganche cuando exista JWT / sesión con flags de permiso.
     * Ej.: `setFromSession({ canEditAdminFields: user.isAdmin, canChangePassword: user.isAdmin })`.
     */
    setFromSession(perms: Partial<AgentScreenPermissions>): void {
        if (perms.canEditAdminFields !== undefined) {
            this.canEditAdminFieldsSig.set(perms.canEditAdminFields);
        }
        if (perms.canChangePassword !== undefined) {
            this.canChangePasswordSig.set(perms.canChangePassword);
        }
    }

    /**
     * Reservado para cuando el backend exponga permisos explícitos del agente.
     */
    loadFromApi(agentId: string): Promise<AgentScreenPermissions> {
        void agentId;
        return Promise.reject(new Error('AgentPermissionsService.loadFromApi: no implementado'));
    }
}
