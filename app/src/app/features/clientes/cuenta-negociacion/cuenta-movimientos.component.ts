import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CuentaMovimiento } from '../clientes.model';

@Component({
    selector: 'app-cuenta-movimientos',
    standalone: true,
    imports: [DatePipe, CurrencyPipe, MatButtonModule, MatTableModule],
    templateUrl: './cuenta-movimientos.component.html',
    styleUrl: './cuenta-movimientos.component.scss',
})
export class CuentaMovimientosComponent {
    @Input() movimientos: CuentaMovimiento[] = [];
    @Input() readonly = false;
    @Output() movimientoActualizado = new EventEmitter<void>();

    readonly columns = ['fecha', 'tipo', 'monto', 'comentario', 'acciones'];

    rectificar(_movimientoId: string): void {
        // Placeholder de rectificación para mantener paridad con el flujo legacy.
        this.movimientoActualizado.emit();
    }
}
