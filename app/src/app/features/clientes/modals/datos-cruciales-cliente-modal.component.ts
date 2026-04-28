import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface DatosCrucialesClienteModalData {
    nombrePreferido?: string;
    movil?: string;
    telefonoSecundario?: string;
    email?: string;
    documento?: string;
    horarioAtencionInicio?: string;
    horarioAtencionFin?: string;
    civilStatus?: string;
    gender?: string;
}

@Component({
    selector: 'app-datos-cruciales-cliente-modal',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
    ],
    templateUrl: './datos-cruciales-cliente-modal.component.html',
    styleUrl: './datos-cruciales-cliente-modal.component.scss',
})
export class DatosCrucialesClienteModalComponent {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(
        MatDialogRef<DatosCrucialesClienteModalComponent, DatosCrucialesClienteModalData | null>,
    );
    readonly data = inject<DatosCrucialesClienteModalData>(MAT_DIALOG_DATA);

    readonly form = this.fb.nonNullable.group({
        nombrePreferido: [this.data.nombrePreferido ?? ''],
        movil: [this.data.movil ?? '', [Validators.required]],
        telefonoSecundario: [this.data.telefonoSecundario ?? ''],
        email: [this.data.email ?? '', [Validators.email]],
        documento: [this.data.documento ?? '', [Validators.required]],
        horarioAtencionInicio: [this.data.horarioAtencionInicio ?? ''],
        horarioAtencionFin: [this.data.horarioAtencionFin ?? ''],
        civilStatus: [this.data.civilStatus ?? ''],
        gender: [this.data.gender ?? ''],
    });

    close(): void {
        this.dialogRef.close(null);
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.dialogRef.close(this.form.getRawValue());
    }
}
