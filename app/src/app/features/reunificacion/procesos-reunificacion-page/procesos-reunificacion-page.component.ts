import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageBreadcrumbComponent } from '../../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

export interface ProcesoReunifMockRow {
    cliente: string;
    gestor: string;
    cuota: number;
    saldo: number;
    objetivoAhorro: number;
    emailDoc: boolean;
    docDeudas: string;
    contrato: boolean;
    negociacion: boolean;
}

@Component({
    selector: 'app-procesos-reunificacion-page',
    imports: [
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        FormsModule,
        PageBreadcrumbComponent,
        DecimalPipe,
    ],
    templateUrl: './procesos-reunificacion-page.component.html',
    styleUrl: './procesos-reunificacion-page.component.scss',
})
export class ProcesosReunificacionPageComponent {
    readonly pageTitle = 'Reunificación';
    readonly currentLabel = 'Procesos';

    readonly displayedColumns: (keyof ProcesoReunifMockRow | 'indice')[] = [
        'indice',
        'cliente',
        'gestor',
        'cuota',
        'saldo',
        'objetivoAhorro',
        'emailDoc',
        'docDeudas',
        'contrato',
        'negociacion',
    ];

    protected readonly filtrosColapsados = signal(false);

    filtroEmail = '';
    filtroDocDeudas = '';
    filtroContrato = '';
    filtroNegociacion = '';
    filtroObjetivo = '';
    limit = 100;
    total = 3;

    /** Datos de demostración (sin API). */
    readonly filas: ProcesoReunifMockRow[] = [
        {
            cliente: 'Ana López García',
            gestor: 'm.gestor',
            cuota: 320,
            saldo: 12800,
            objetivoAhorro: 15000,
            emailDoc: true,
            docDeudas: 'Completo',
            contrato: true,
            negociacion: true,
        },
        {
            cliente: 'Carlos Ruiz',
            gestor: 'Sin asignar',
            cuota: 200,
            saldo: 9200,
            objetivoAhorro: 10000,
            emailDoc: false,
            docDeudas: 'Parcial',
            contrato: false,
            negociacion: true,
        },
        {
            cliente: 'Elena M.',
            gestor: 'a.gestor',
            cuota: 150,
            saldo: 4800,
            objetivoAhorro: 0,
            emailDoc: true,
            docDeudas: 'Pendiente',
            contrato: true,
            negociacion: false,
        },
    ];

    indiceFila(fila: ProcesoReunifMockRow): number {
        return this.filas.indexOf(fila) + 1;
    }

    toggleFiltros(): void {
        this.filtrosColapsados.update((c) => !c);
    }

    onFiltrar(): void {
        // Vista demo: sin lógica.
    }

    constructor(public themeService: CustomizerSettingsService) {}
}
