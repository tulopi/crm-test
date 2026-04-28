import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DireccionClienteModalData {
    calle?: string;
    ciudad?: string;
    provincia?: string;
    codigoPostal?: string;
}

@Component({
    selector: 'app-direccion-cliente-modal',
    standalone: true,
    imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './direccion-cliente-modal.component.html',
    styleUrl: './direccion-cliente-modal.component.scss',
})
export class DireccionClienteModalComponent {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(
        MatDialogRef<DireccionClienteModalComponent, DireccionClienteModalData | null>,
    );
    readonly data = inject<DireccionClienteModalData>(MAT_DIALOG_DATA);

    readonly form = this.fb.nonNullable.group({
        calle: [this.data.calle ?? ''],
        ciudad: [this.data.ciudad ?? ''],
        provincia: [this.data.provincia ?? ''],
        codigoPostal: [this.data.codigoPostal ?? ''],
    });

    close(): void {
        this.dialogRef.close(null);
    }

    save(): void {
        this.dialogRef.close(this.form.getRawValue());
    }
}
