import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PageBreadcrumbComponent } from '../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { ClienteListado } from './clientes.model';
import { CLIENTES_MOCK } from './clientes.data';

@Component({
    selector: 'app-clientes',
    imports: [
        DatePipe,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        PageBreadcrumbComponent,
    ],
    templateUrl: './clientes.component.html',
    styleUrl: './clientes.component.scss',
})
export class ClientesComponent implements AfterViewInit {
    @ViewChild(MatPaginator) private paginator!: MatPaginator;

    filterForm: FormGroup;

    readonly displayedColumns: string[] = [
        'nombreCompleto',
        'documento',
        'movil',
        'creacion',
        'acciones',
    ];

    dataSource = new MatTableDataSource<ClienteListado & { nombreCompleto: string }>([]);

    private readonly baseRows: (ClienteListado & { nombreCompleto: string })[] =
        CLIENTES_MOCK.map((c) => ({
            ...c,
            nombreCompleto: `${c.nombre} ${c.apellido}`.trim(),
        }));

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        public themeService: CustomizerSettingsService,
    ) {
        this.filterForm = this.fb.group({
            nombre: [''],
            apellido: [''],
            telefono: [''],
            documento: [''],
            email: [''],
        });
        // Poblar antes del primer render (SSR/prerender) para evitar NG0100 en el subtítulo.
        this.aplicarFiltroInterno();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    buscarClientes(): void {
        this.aplicarFiltroInterno();
    }

    limpiarFiltros(): void {
        this.filterForm.reset({
            nombre: '',
            apellido: '',
            telefono: '',
            documento: '',
            email: '',
        });
        this.aplicarFiltroInterno();
    }

    crearCliente(): void {
        // Conectar a alta de cliente o ruta cuando exista.
    }

    abrirFicha(clienteId: string): void {
        void this.router.navigate(['/clientes/cliente', clienteId]);
    }

    private normalizar(s: string): string {
        return s.trim().toLowerCase();
    }

    private includesLoose(hay: string, needle: string): boolean {
        return this.normalizar(hay).includes(this.normalizar(needle));
    }

    private aplicarFiltroInterno(): void {
        const f = this.filterForm.value;
        const nombre = f['nombre'] ?? '';
        const apellido = f['apellido'] ?? '';
        const telefono = f['telefono'] ?? '';
        const documento = f['documento'] ?? '';
        const email = f['email'] ?? '';

        let rows = [...this.baseRows];
        if (this.normalizar(nombre)) {
            rows = rows.filter((r) => this.includesLoose(r.nombre, nombre));
        }
        if (this.normalizar(apellido)) {
            rows = rows.filter((r) => this.includesLoose(r.apellido, apellido));
        }
        if (this.normalizar(telefono)) {
            const t = telefono.replace(/\s/g, '');
            rows = rows.filter(
                (r) =>
                    r.movil.replace(/\s/g, '').includes(t) ||
                    this.includesLoose(r.movil, telefono),
            );
        }
        if (this.normalizar(documento)) {
            rows = rows.filter((r) => this.includesLoose(r.documento, documento));
        }
        if (this.normalizar(email)) {
            rows = rows.filter((r) => this.includesLoose(r.email, email));
        }
        this.dataSource.data = rows;
        this.paginator?.firstPage();
    }
}
