import {
    Component,
    DestroyRef,
    Input,
    OnChanges,
    SimpleChanges,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
    ClienteDetalle,
    CuentaNegociacion,
    ExpedienteCliente,
    ProcesoReunificacion,
} from '../clientes.model';
import { ClientesRepository } from '../clientes.repository';
import { CuentaDeudasComponent, CrearDeudaDraft } from './cuenta-deudas.component';
import { CuentaMovimientosComponent } from './cuenta-movimientos.component';
import { PlanDePagosModalComponent } from './plan-de-pagos-modal.component';
import { PlanPagosTabComponent } from './plan-pagos-tab.component';
import { ProcesoTabComponent } from './proceso-tab.component';

@Component({
    selector: 'app-cuenta-negociacion',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DatePipe,
        CurrencyPipe,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        CuentaDeudasComponent,
        CuentaMovimientosComponent,
        PlanPagosTabComponent,
        ProcesoTabComponent,
    ],
    templateUrl: './cuenta-negociacion.component.html',
    styleUrl: './cuenta-negociacion.component.scss',
})
export class CuentaNegociacionComponent implements OnChanges {
    private readonly fb = inject(FormBuilder);
    private readonly repo = inject(ClientesRepository);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);
    private readonly destroyRef = inject(DestroyRef);

    @Input({ required: true }) cliente!: ClienteDetalle;
    @Input() expediente: ExpedienteCliente | null = null;
    @Input() agenteId = '';
    @Input() documentos: ExpedienteCliente['documentos'] = [];
    @Input() cuentaInicial: CuentaNegociacion | null = null;
    @Input() modoSoloLectura = false;

    readonly loading = signal(false);
    readonly cuenta = signal<CuentaNegociacion | null>(null);

    readonly infoForm = this.fb.nonNullable.group({
        motivo: [''],
        bienesMuebles: [false],
        bienesInmuebles: [false],
        ingresosBrutos: [0, [Validators.min(0)]],
        ingresosNetos: [0, [Validators.min(0)]],
        objetivoAhorro: [0, [Validators.min(0)]],
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cuentaInicial']) {
            this.syncCuenta(this.cuentaInicial);
            return;
        }
        if (changes['expediente'] && this.expediente?._id) {
            this.syncCuenta(this.cuentaInicial);
        }
    }

    abrirPlanPagoModal(): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.dialog
            .open(PlanDePagosModalComponent, {
                width: 'min(760px, 96vw)',
                maxWidth: '96vw',
            })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                this.loading.set(true);
                this.repo
                    .abrirPlanDePagos(current._id, result)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (cuenta) => {
                            this.syncCuenta(cuenta);
                            this.loading.set(false);
                            this.snackBar.open('Plan de pagos generado', 'Cerrar', { duration: 2500 });
                        },
                        error: () => {
                            this.loading.set(false);
                            this.snackBar.open('No fue posible abrir el plan de pagos', 'Cerrar', {
                                duration: 3000,
                            });
                        },
                    });
            });
    }

    guardarInfoCuenta(): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .actualizarInfoCuenta(current._id, this.infoForm.getRawValue())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cuenta) => {
                    this.syncCuenta(cuenta);
                    this.loading.set(false);
                    this.snackBar.open('Datos de cuenta guardados', 'Cerrar', { duration: 2200 });
                },
                error: () => {
                    this.loading.set(false);
                    this.snackBar.open('No se pudieron guardar los cambios', 'Cerrar', { duration: 3000 });
                },
            });
    }

    onDeudaCreated(payload: CrearDeudaDraft): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .crearDeuda(current._id, payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cuenta) => {
                    this.syncCuenta(cuenta);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                },
            });
    }

    onDeudaPagada(deudaId: string): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .pagarDeuda(current._id, deudaId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cuenta) => {
                    this.syncCuenta(cuenta);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                },
            });
    }

    onSolicitudPagoCreada(monto: number): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .registrarDevolucion(current._id, monto, 'Solicitud de pago de deuda registrada')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cuenta) => {
                    this.syncCuenta(cuenta);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                },
            });
    }

    onCuotaPagada(cuotaId: string): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .pagarCuota(current._id, cuotaId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cuenta) => {
                    this.syncCuenta(cuenta);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                },
            });
    }

    onDevolucionCreada(monto: number): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .registrarDevolucion(current._id, monto, 'Devolucion generada desde plan de pagos')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cuenta) => {
                    this.syncCuenta(cuenta);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                },
            });
    }

    onProcesoUpdated(proceso: ProcesoReunificacion): void {
        const current = this.cuenta();
        if (!current) {
            return;
        }
        this.loading.set(true);
        this.repo
            .actualizarProceso(current._id, proceso)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cuenta) => {
                    this.syncCuenta(cuenta);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                },
            });
    }

    private syncCuenta(cuenta: CuentaNegociacion | null): void {
        this.cuenta.set(cuenta);
        if (!cuenta) {
            this.infoForm.reset({
                motivo: '',
                bienesMuebles: false,
                bienesInmuebles: false,
                ingresosBrutos: 0,
                ingresosNetos: 0,
                objetivoAhorro: 0,
            });
            return;
        }
        this.infoForm.patchValue({
            motivo: cuenta.infoCuenta.motivo,
            bienesMuebles: cuenta.infoCuenta.bienesMuebles,
            bienesInmuebles: cuenta.infoCuenta.bienesInmuebles,
            ingresosBrutos: cuenta.infoCuenta.ingresosBrutos,
            ingresosNetos: cuenta.infoCuenta.ingresosNetos,
            objetivoAhorro: cuenta.infoCuenta.objetivoAhorro,
        });
    }
}
