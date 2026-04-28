import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CuentaDeuda } from '../clientes.model';

export interface CrearDeudaDraft {
    acreedor: string;
    deudaTotal: number;
    pagoAcordado?: number;
    judicializado?: boolean;
}

@Component({
    selector: 'app-cuenta-deudas',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CurrencyPipe,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
    ],
    templateUrl: './cuenta-deudas.component.html',
    styleUrl: './cuenta-deudas.component.scss',
})
export class CuentaDeudasComponent {
    private readonly fb = inject(FormBuilder);

    @Input() deudas: CuentaDeuda[] = [];
    @Input() saldo = 0;
    @Input() readonly = false;

    @Output() deudaCreated = new EventEmitter<CrearDeudaDraft>();
    @Output() deudaPagada = new EventEmitter<string>();
    @Output() solicitudPagoCreada = new EventEmitter<number>();

    readonly columns = ['acreedor', 'estado', 'total', 'pagoAcordado', 'acciones'];

    readonly form = this.fb.nonNullable.group({
        acreedor: ['', [Validators.required, Validators.minLength(2)]],
        deudaTotal: [0, [Validators.required, Validators.min(1)]],
        pagoAcordado: [0, [Validators.min(0)]],
    });

    mostrarAlta = false;

    abrirAlta(): void {
        this.mostrarAlta = true;
    }

    cancelarAlta(): void {
        this.mostrarAlta = false;
        this.form.reset({ acreedor: '', deudaTotal: 0, pagoAcordado: 0 });
    }

    crear(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const payload = this.form.getRawValue();
        this.deudaCreated.emit({
            acreedor: payload.acreedor,
            deudaTotal: payload.deudaTotal,
            pagoAcordado: payload.pagoAcordado || undefined,
            judicializado: false,
        });
        this.cancelarAlta();
    }

    pagar(deudaId: string): void {
        this.deudaPagada.emit(deudaId);
    }

    registrarSolicitud(deuda: CuentaDeuda): void {
        this.solicitudPagoCreada.emit(deuda.pagoAcordado ?? deuda.deudaTotal);
    }
}
