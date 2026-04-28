import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProcesoReunificacion } from '../clientes.model';

@Component({
    selector: 'app-proceso-tab',
    standalone: true,
    imports: [ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './proceso-tab.component.html',
    styleUrl: './proceso-tab.component.scss',
})
export class ProcesoTabComponent implements OnChanges {
    private readonly fb = inject(FormBuilder);

    @Input() proceso!: ProcesoReunificacion;
    @Input() readonly = false;
    @Output() updated = new EventEmitter<ProcesoReunificacion>();

    readonly form = this.fb.nonNullable.group({
        envioEmailDocumentacion: false,
        contratoFirmado: false,
        negociacion: false,
        judicializado: false,
        comentario: '',
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['proceso'] || !this.proceso) {
            return;
        }
        this.form.patchValue({
            envioEmailDocumentacion: !!this.proceso.envioEmailDocumentacion,
            contratoFirmado: !!this.proceso.contratoFirmado,
            negociacion: !!this.proceso.negociacion,
            judicializado: !!this.proceso.judicializado,
            comentario: this.proceso.comentario ?? '',
        });
    }

    guardar(): void {
        this.updated.emit(this.form.getRawValue());
    }
}
