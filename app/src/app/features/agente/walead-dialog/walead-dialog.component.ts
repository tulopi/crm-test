import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogModule,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { AgentWaLead } from '../agente.model';

export interface WaLeadDialogData {
    waLead: AgentWaLead;
}

@Component({
    selector: 'app-walead-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './walead-dialog.component.html',
})
export class WaLeadDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef<WaLeadDialogComponent, AgentWaLead | undefined>);
    readonly data = inject<WaLeadDialogData>(MAT_DIALOG_DATA);

    readonly form = this.fb.group({
        empresa: [this.data.waLead.empresa],
        recibir: [this.data.waLead.recibir],
        /** Un sector por línea (sustituto del ng-select addTag). */
        sectoresText: [this.data.waLead.sectores.join('\n')],
    });

    cancelar(): void {
        this.dialogRef.close(undefined);
    }

    guardar(): void {
        const raw = this.form.getRawValue();
        const sectores = (raw.sectoresText ?? '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        this.dialogRef.close({
            empresa: raw.empresa ?? '',
            recibir: !!raw.recibir,
            sectores,
        });
    }
}
