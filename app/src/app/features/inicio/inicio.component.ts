import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { PageBreadcrumbComponent } from '../../common/page-breadcrumb/page-breadcrumb.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { CRM_AGENTS, CrmAgentRow } from './crm-agents.data';

@Component({
    selector: 'app-inicio',
    imports: [MatCardModule, MatTableModule, PageBreadcrumbComponent],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
})
export class InicioComponent {
    readonly agents: readonly CrmAgentRow[] = CRM_AGENTS;
    readonly displayedColumns: (keyof CrmAgentRow)[] = ['agente', 'extension'];

    constructor(public themeService: CustomizerSettingsService) {}
}
