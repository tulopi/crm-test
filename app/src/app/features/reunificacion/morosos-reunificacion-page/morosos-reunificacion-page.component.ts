import { Component } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageBreadcrumbComponent } from '../../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

export interface MorosoMockRow {
    fechaPago: string;
    cliente: string;
    agente: string;
    categoria: 'Viable' | 'Posible' | 'Inviable' | 'Promesa' | 'Jura de Cuentas';
    ultContacto: string;
}

@Component({
    selector: 'app-morosos-reunificacion-page',
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
        NgClass,
    ],
    templateUrl: './morosos-reunificacion-page.component.html',
    styleUrl: './morosos-reunificacion-page.component.scss',
})
export class MorososReunificacionPageComponent {
    readonly pageTitle = 'Reunificación';
    readonly currentLabel = 'Morosos';

    readonly displayedColumns: string[] = [
        'i',
        'fechaPago',
        'cliente',
        'agente',
        'categoria',
        'ultContacto',
        'acciones',
    ];

    modoVista: 'mio' | 'todos' = 'mio';
    agenteId = 'a1';

    readonly filas: MorosoMockRow[] = [
        {
            fechaPago: '2026-04-15',
            cliente: 'Cliente Demo 1',
            agente: 'm.gestor',
            categoria: 'Viable',
            ultContacto: '2026-04-20',
        },
        {
            fechaPago: '2026-04-22',
            cliente: 'Cliente Demo 2',
            agente: 'a.gestor',
            categoria: 'Posible',
            ultContacto: '2026-04-19',
        },
    ];

    total = 2;
    cargando = false;

    rowIndex(row: MorosoMockRow): number {
        return this.filas.indexOf(row) + 1;
    }

    protected readonly agentes = [
        { id: 'a1', name: 'm.gestor' },
        { id: 'a2', name: 'a.gestor' },
    ];

    categoriaClass(c: MorosoMockRow['categoria']): string {
        const map: Record<string, string> = {
            Viable: 'row-viable',
            Posible: 'row-posible',
            Inviable: 'row-inviable',
            Promesa: 'row-promesa',
            'Jura de Cuentas': 'row-jura',
        };
        return map[c] ?? '';
    }

    onCobrarPendientes(): void {
        // Demostración
    }

    constructor(public themeService: CustomizerSettingsService) {}
}
