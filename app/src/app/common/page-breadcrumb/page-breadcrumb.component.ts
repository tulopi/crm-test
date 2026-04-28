import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-page-breadcrumb',
    imports: [RouterLink],
    templateUrl: './page-breadcrumb.component.html',
})
export class PageBreadcrumbComponent {
    /** Título visible a la izquierda (p. ej. nombre de la pantalla). */
    @Input({ required: true }) pageTitle!: string;

    /** Texto del último segmento de migas (página actual). */
    @Input({ required: true }) currentLabel!: string;
}
