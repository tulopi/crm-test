import { Component, DestroyRef, effect, inject, signal, viewChild, ElementRef, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageBreadcrumbComponent } from '../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AgentPermissionsService } from './agent-permissions.service';
import {
    AGENTE_INICIAL_MOCK,
    DEPARTAMENTOS_MOCK,
    ESTADISTICAS_OPCIONES,
    GESTIONAR_POTENCIALES_OPCIONES,
    PRODUCTOS_MOCK,
    ROLES_MOCK,
} from './agente.data';
import type { Agente, AgentWaLead, ProductoOption } from './agente.model';
import { WaLeadDialogComponent } from './walead-dialog/walead-dialog.component';

@Component({
    selector: 'app-agente',
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        PageBreadcrumbComponent,
    ],
    templateUrl: './agente.component.html',
    styleUrl: './agente.component.scss',
})
export class AgenteComponent {
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly dialog = inject(MatDialog);
    readonly themeService = inject(CustomizerSettingsService);
    readonly permissions = inject(AgentPermissionsService);

    readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

    readonly roles = ROLES_MOCK;
    readonly departamentos = DEPARTAMENTOS_MOCK;
    readonly estadisticasOpciones = ESTADISTICAS_OPCIONES;
    readonly gestionarPotencialesOpciones = GESTIONAR_POTENCIALES_OPCIONES;

    /** Agrupación por categoría para `mat-optgroup`. */
    readonly productosPorCategoria: { categoria: string; items: ProductoOption[] }[] = (() => {
        const map = new Map<string, ProductoOption[]>();
        for (const p of PRODUCTOS_MOCK) {
            const list = map.get(p.categoriaNombre) ?? [];
            list.push(p);
            map.set(p.categoriaNombre, list);
        }
        return [...map.entries()].map(([categoria, items]) => ({ categoria, items }));
    })();

    readonly username = AGENTE_INICIAL_MOCK.username;
    readonly emailTrabajo = AGENTE_INICIAL_MOCK.email;

    readonly editando = signal(false);
    private readonly avatarPreviewObjectUrl = signal<string | null>(null);
    private readonly avatarFallback = signal(AGENTE_INICIAL_MOCK.avatarUrl ?? 'images/admin.png');

    readonly agentForm = this.fb.group({
        password: this.fb.nonNullable.control(''),
        name: this.fb.nonNullable.control(''),
        dni: this.fb.nonNullable.control(''),
        numero: this.fb.control<number | null>(null),
        gmail_showName: this.fb.nonNullable.control(''),
        gmail_username: this.fb.nonNullable.control(''),
        position: this.fb.nonNullable.control(''),
        role: this.fb.control<string | null>(null),
        extension: this.fb.control<number | null>(null),
        cuentaWhatsapp: this.fb.control<'tramideudas' | 'admin' | null>(null),
        estadistica: this.fb.nonNullable.control(''),
        capacidades: this.fb.nonNullable.control<string[]>([]),
        departamento: this.fb.nonNullable.control<string[]>([]),
        gestionarPotenciales: this.fb.nonNullable.control<string[]>([]),
        waLead: this.fb.group({
            empresa: this.fb.nonNullable.control(''),
            recibir: this.fb.nonNullable.control(false),
            sectores: this.fb.nonNullable.control<string[]>([]),
        }),
        actived: this.fb.nonNullable.control(false),
        puedeVerDocumentosWsp: this.fb.nonNullable.control(false),
    });

    constructor() {
        effect(() => {
            const ctrl = this.agentForm.controls.password;
            if (this.permissions.canChangePassword()) {
                ctrl.enable({ emitEvent: false });
            } else {
                ctrl.disable({ emitEvent: false });
            }
        });

        this.destroyRef.onDestroy(() => {
            const url = this.avatarPreviewObjectUrl();
            if (url && isPlatformBrowser(this.platformId)) {
                URL.revokeObjectURL(url);
            }
        });

        const a = AGENTE_INICIAL_MOCK;
        this.agentForm.patchValue({
            password: a.password,
            name: a.name,
            dni: a.dni,
            numero: a.numero,
            gmail_showName: a.gmail_showName,
            gmail_username: a.gmail_username,
            position: a.position,
            role: a.role,
            extension: a.extension,
            cuentaWhatsapp: a.cuentaWhatsapp,
            estadistica: a.estadistica,
            capacidades: [...a.capacidades],
            departamento: [...a.departamento],
            gestionarPotenciales: [...a.gestionarPotenciales],
            waLead: { ...a.waLead, sectores: [...a.waLead.sectores] },
            actived: a.actived,
            puedeVerDocumentosWsp: a.puedeVerDocumentosWsp,
        });
    }

    getAvatarUrl(): string {
        return this.avatarPreviewObjectUrl() ?? this.avatarFallback() ?? 'images/admin.png';
    }

    onAvatarError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = 'images/admin.png';
    }

    seleccionarImagen(): void {
        this.fileInput()?.nativeElement.click();
    }

    subirImagen(event: Event): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file || !file.type.startsWith('image/')) {
            return;
        }
        const prev = this.avatarPreviewObjectUrl();
        if (prev) {
            URL.revokeObjectURL(prev);
        }
        this.avatarPreviewObjectUrl.set(URL.createObjectURL(file));
    }

    estadoActivoTexto(): string {
        return this.agentForm.controls.actived.value ? 'Activo' : 'Inactivo';
    }

    onGestionarPotencialesChange(opcion: string, checked: boolean): void {
        const ctrl = this.agentForm.controls.gestionarPotenciales;
        const cur = new Set(ctrl.value);
        if (checked) {
            cur.add(opcion);
        } else {
            cur.delete(opcion);
        }
        ctrl.setValue([...cur]);
    }

    isPotencialSeleccionado(opcion: string): boolean {
        return this.agentForm.controls.gestionarPotenciales.value.includes(opcion);
    }

    abrirDialogoWaLead(): void {
        const wa = this.agentForm.controls.waLead.getRawValue() as AgentWaLead;
        this.dialog
            .open<WaLeadDialogComponent, { waLead: AgentWaLead }, AgentWaLead | undefined>(
                WaLeadDialogComponent,
                {
                    width: 'min(480px, 100vw - 32px)',
                    data: { waLead: { ...wa, sectores: [...wa.sectores] } },
                },
            )
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result) {
                    this.agentForm.controls.waLead.patchValue({
                        empresa: result.empresa,
                        recibir: result.recibir,
                        sectores: result.sectores,
                    });
                }
            });
    }

    conectarGmail(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        // TODO: sustituir por flujo OAuth real con el backend.
        window.open('https://accounts.google.com/', '_blank', 'noopener,noreferrer');
    }

    guardarAgente(): void {
        if (this.editando()) {
            return;
        }
        this.editando.set(true);
        const raw = this.agentForm.getRawValue();
        const payload: Partial<Agente> = {
            ...raw,
            waLead: {
                empresa: raw.waLead.empresa,
                recibir: raw.waLead.recibir,
                sectores: [...raw.waLead.sectores],
            },
        };
        void Promise.resolve()
            .then(() => new Promise((r) => setTimeout(r, 600)))
            .then(() => {
                console.info('[Agente] guardar (mock)', payload);
            })
            .finally(() => this.editando.set(false));
    }
}
