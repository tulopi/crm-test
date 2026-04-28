import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { PageBreadcrumbComponent } from '../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-usuario-seccion',
    imports: [MatCardModule, PageBreadcrumbComponent],
    templateUrl: './usuario-seccion.component.html',
    styleUrl: './usuario-seccion.component.scss',
})
export class UsuarioSeccionComponent {
    private readonly route = inject(ActivatedRoute);

    readonly pageTitle = this.route.snapshot.data['pageTitle'] as string;

    constructor(public themeService: CustomizerSettingsService) {}
}
