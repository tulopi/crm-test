import { Component, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PageBreadcrumbComponent } from '../../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

export interface SeguimientoMock {
    cliente: string;
    gestor: string;
    tienePlan: boolean;
    estadoCuota: string;
    saldo: number;
    proximaAccion: string;
}

export interface AgendaMock {
    titulo: string;
    cuando: string;
    tipo: string;
}

@Component({
    selector: 'app-seguimiento-reunificacion-page',
    imports: [
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        PageBreadcrumbComponent,
        DatePipe,
        DecimalPipe,
    ],
    templateUrl: './seguimiento-reunificacion-page.component.html',
    styleUrl: './seguimiento-reunificacion-page.component.scss',
})
export class SeguimientoReunificacionPageComponent {
    readonly pageTitle = 'Reunificación';
    readonly currentLabel = 'Seguimiento';

    readonly activeTab = signal<'seguimiento' | 'agenda'>('seguimiento');
    totalRegistros = 2;
    totalAgenda = 1;

    readonly displayedSegColumns: string[] = [
        'cliente',
        'gestor',
        'tienePlan',
        'estadoCuota',
        'saldo',
        'proximaAccion',
    ];

    readonly seguimiento: SeguimientoMock[] = [
        {
            cliente: 'María S.',
            gestor: 'a.gestor',
            tienePlan: true,
            estadoCuota: 'Al corriente',
            saldo: 3400,
            proximaAccion: 'Llamar 28/04',
        },
        {
            cliente: 'Juan T.',
            gestor: 'Sin asignar',
            tienePlan: false,
            estadoCuota: 'Atraso',
            saldo: 12100,
            proximaAccion: 'WhatsApp',
        },
    ];

    readonly agenda: AgendaMock[] = [
        {
            titulo: 'Revisar documentación DNI',
            cuando: '2026-04-30T10:00:00',
            tipo: 'Llamada',
        },
    ];

    readonly displayedAgendaColumns: string[] = ['titulo', 'cuando', 'tipo'];

    setTab(t: 'seguimiento' | 'agenda'): void {
        this.activeTab.set(t);
    }

    planChip(t: boolean): string {
        return t ? 'Sí' : 'No';
    }

    constructor(public themeService: CustomizerSettingsService) {}
}
