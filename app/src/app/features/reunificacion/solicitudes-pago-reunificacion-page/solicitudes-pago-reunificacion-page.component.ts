import { Component, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageBreadcrumbComponent } from '../../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

export interface SolicitudPagoMock {
    createdAt: string;
    fechaPago: string | null;
    cliente: string;
    acreedor: string;
    monto: number;
    acuerdo: string;
    estado: 'pendiente' | 'aprobada' | 'rechazada' | 'ejecutada';
}

@Component({
    selector: 'app-solicitudes-pago-reunificacion-page',
    imports: [
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        FormsModule,
        PageBreadcrumbComponent,
        DatePipe,
        DecimalPipe,
    ],
    templateUrl: './solicitudes-pago-reunificacion-page.component.html',
    styleUrl: './solicitudes-pago-reunificacion-page.component.scss',
})
export class SolicitudesPagoReunificacionPageComponent {
    readonly pageTitle = 'Reunificación';
    readonly currentLabel = 'Solicitudes de pago';

    readonly displayedColumns: string[] = [
        'createdAt',
        'fechaPago',
        'cliente',
        'acreedor',
        'monto',
        'acuerdo',
        'estado',
        'acciones',
    ];

    protected readonly filtrosColapsados = signal(false);
    filtroEstado: 'pendiente' | 'pagadas' | 'rechazadas' | 'todas' = 'pendiente';
    limitePorPagina = 10;
    totalSolicitudes = 0;
    cargando = false;

    solicitudes: SolicitudPagoMock[] = [
        {
            createdAt: '2026-04-21T11:20:00',
            fechaPago: null,
            cliente: 'Cliente Alpha',
            acreedor: 'Acreedor X',
            monto: 350,
            acuerdo: 'Cuota 3/12',
            estado: 'pendiente',
        },
        {
            createdAt: '2026-04-20T08:00:00',
            fechaPago: '2026-04-21T09:00:00',
            cliente: 'Cliente Beta',
            acreedor: 'Acreedor Y',
            monto: 120.5,
            acuerdo: 'Pago parcial',
            estado: 'ejecutada',
        },
    ];

    constructor(public themeService: CustomizerSettingsService) {
        this.totalSolicitudes = this.solicitudes.length;
    }

    toggleFiltros(): void {
        this.filtrosColapsados.update((v) => !v);
    }

    actualizarVista(): void {
        this.cargando = true;
        setTimeout(() => (this.cargando = false), 400);
    }

    isPagada(s: SolicitudPagoMock): boolean {
        return s.estado === 'ejecutada' || s.estado === 'aprobada';
    }
}
