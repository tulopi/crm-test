import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-reunificacion-inicio',
    imports: [MatCardModule, MatButtonModule, PageBreadcrumbComponent, RouterLink],
    templateUrl: './reunificacion-inicio.component.html',
    styleUrl: './reunificacion-inicio.component.scss',
})
export class ReunificacionInicioComponent {
    /** Enlaces replican el bloque "Reunificacion" de LSO (ley segunda oportunidad) en mCRM. */
    readonly accesos = [
        { label: 'Procesos Reunificacion', route: '/reunificacion/procesos', icon: 'sync' },
        { label: 'Morosos Reunificación', route: '/reunificacion/morosos', icon: 'gavel' },
        { label: 'Seguimiento Reunificación', route: '/reunificacion/seguimiento', icon: 'call' },
        { label: 'Solicitudes de Pago', route: '/reunificacion/solicitudes-pago', icon: 'payments' },
    ] as const;

    constructor(public themeService: CustomizerSettingsService) {}
}
