import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CuotaPlanPago } from '../clientes.model';

@Component({
    selector: 'app-plan-pagos-tab',
    standalone: true,
    imports: [DatePipe, CurrencyPipe, MatButtonModule, MatTableModule],
    templateUrl: './plan-pagos-tab.component.html',
    styleUrl: './plan-pagos-tab.component.scss',
})
export class PlanPagosTabComponent {
    @Input() cuotas: CuotaPlanPago[] = [];
    @Input() historialAccionesGlobal: string[] = [];
    @Input() readonly = false;

    @Output() cuotaPagada = new EventEmitter<string>();
    @Output() devolucionCreada = new EventEmitter<number>();

    readonly columns = ['cuota', 'fecha', 'estado', 'monto', 'acciones'];

    pagar(cuotaId: string): void {
        this.cuotaPagada.emit(cuotaId);
    }

    generarDevolucion(): void {
        this.devolucionCreada.emit(60);
    }
}
