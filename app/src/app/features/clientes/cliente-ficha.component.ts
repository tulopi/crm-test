import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageBreadcrumbComponent } from '../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { CuentaNegociacionComponent } from './cuenta-negociacion/cuenta-negociacion.component';
import {
    ClienteDetalle,
    CuentaNegociacion,
    ExpedienteCliente,
} from './clientes.model';
import { ClienteFichaSnapshot, ClientesRepository } from './clientes.repository';
import {
    DatosCrucialesClienteModalComponent,
    DatosCrucialesClienteModalData,
} from './modals/datos-cruciales-cliente-modal.component';
import {
    DireccionClienteModalComponent,
    DireccionClienteModalData,
} from './modals/direccion-cliente-modal.component';

@Component({
    selector: 'app-cliente-ficha',
    standalone: true,
    imports: [
        DatePipe,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        PageBreadcrumbComponent,
        CuentaNegociacionComponent,
    ],
    templateUrl: './cliente-ficha.component.html',
    styleUrl: './cliente-ficha.component.scss',
})
export class ClienteFichaComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly repo = inject(ClientesRepository);
    private readonly fb = inject(FormBuilder);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);
    private readonly location = inject(Location);
    private readonly destroyRef = inject(DestroyRef);

    readonly themeService = inject(CustomizerSettingsService);

    readonly loading = signal(true);
    readonly notFound = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly cliente = signal<ClienteDetalle | null>(null);
    readonly expedientes = signal<ExpedienteCliente[]>([]);
    readonly expedientesReunificacion = signal<ExpedienteCliente[]>([]);
    readonly expedienteSeleccionado = signal<ExpedienteCliente | null>(null);
    readonly cuentaNegociacion = signal<CuentaNegociacion | null>(null);
    readonly estrategiaMensaje = signal<string>('');

    readonly form = this.fb.nonNullable.group({
        nombrePreferido: [''],
        movil: [''],
        telefonoSecundario: [''],
        email: [''],
        horarioAtencionInicio: [''],
        horarioAtencionFin: [''],
        documento: [''],
        civilStatus: [''],
        gender: [''],
        calle: [''],
        ciudad: [''],
        provincia: [''],
        codigoPostal: [''],
    });

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const clienteId = params.get('id');
            if (!clienteId) {
                this.notFound.set(true);
                this.loading.set(false);
                return;
            }
            this.loadFicha(clienteId);
        });
    }

    volver(): void {
        this.location.back();
    }

    onExpedienteChange(expedienteId: string): void {
        const current = this.cliente();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .seleccionarExpediente(current.id, expedienteId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (snapshot) => {
                    this.applySnapshot(snapshot);
                    this.loading.set(false);
                },
                error: () => {
                    this.errorMessage.set('No se pudo cambiar el expediente.');
                    this.loading.set(false);
                },
            });
    }

    guardarCliente(): void {
        this.snackBar.open('Cambios del cliente guardados (mock)', 'Cerrar', { duration: 1800 });
    }

    abrirModalDatosCruciales(): void {
        const data: DatosCrucialesClienteModalData = this.form.getRawValue();
        this.dialog
            .open(DatosCrucialesClienteModalComponent, {
                width: 'min(900px, 96vw)',
                maxWidth: '96vw',
                data,
            })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                this.form.patchValue(result);
                this.guardarCliente();
            });
    }

    abrirModalDireccion(): void {
        const data: DireccionClienteModalData = {
            calle: this.form.controls.calle.value,
            ciudad: this.form.controls.ciudad.value,
            provincia: this.form.controls.provincia.value,
            codigoPostal: this.form.controls.codigoPostal.value,
        };
        this.dialog
            .open(DireccionClienteModalComponent, {
                width: 'min(700px, 96vw)',
                maxWidth: '96vw',
                data,
            })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                this.form.patchValue(result);
                this.guardarCliente();
            });
    }

    private loadFicha(clienteId: string): void {
        this.loading.set(true);
        this.notFound.set(false);
        this.errorMessage.set(null);
        this.repo
            .getClienteFichaById(clienteId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (snapshot) => {
                    if (!snapshot.cliente) {
                        this.notFound.set(true);
                        this.loading.set(false);
                        return;
                    }
                    this.applySnapshot(snapshot);
                    this.loading.set(false);
                },
                error: () => {
                    this.errorMessage.set('No fue posible cargar la ficha del cliente.');
                    this.loading.set(false);
                },
            });
    }

    private applySnapshot(snapshot: ClienteFichaSnapshot): void {
        this.cliente.set(snapshot.cliente);
        this.expedientes.set(snapshot.expedientes);
        this.expedientesReunificacion.set(snapshot.expedientesReunificacion);
        this.expedienteSeleccionado.set(snapshot.expedienteSeleccionado);
        this.cuentaNegociacion.set(snapshot.cuentaNegociacion);

        if (snapshot.expedientesReunificacion.length === 0) {
            this.estrategiaMensaje.set(
                'Este cliente no tiene expediente del producto de reunificacion/negociacion.',
            );
        } else if (snapshot.expedientesReunificacion.length > 1) {
            this.estrategiaMensaje.set(
                'Se ha seleccionado el expediente activo o mas reciente. Puedes cambiarlo en el selector.',
            );
        } else {
            this.estrategiaMensaje.set(
                'Expediente de reunificacion detectado para este cliente.',
            );
        }

        const cliente = snapshot.cliente;
        if (!cliente) {
            return;
        }
        this.form.patchValue({
            nombrePreferido: cliente.nombrePreferido ?? '',
            movil: cliente.movil,
            telefonoSecundario: cliente.telefonoSecundario ?? '',
            email: cliente.email,
            horarioAtencionInicio: cliente.horarioAtencionInicio ?? '',
            horarioAtencionFin: cliente.horarioAtencionFin ?? '',
            documento: cliente.documento,
            civilStatus: cliente.civilStatus ?? '',
            gender: cliente.gender ?? '',
            calle: cliente.address?.calle ?? '',
            ciudad: cliente.address?.ciudad ?? '',
            provincia: cliente.address?.provincia ?? '',
            codigoPostal: cliente.address?.codigoPostal ?? '',
        });
    }
}
