import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlanPagoDraft } from '../clientes.repository';

@Component({
    selector: 'app-plan-de-pagos-modal',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './plan-de-pagos-modal.component.html',
    styleUrl: './plan-de-pagos-modal.component.scss',
})
export class PlanDePagosModalComponent {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef<PlanDePagosModalComponent, PlanPagoDraft | null>);

    readonly form = this.fb.nonNullable.group({
        deudaTotal: [3500, [Validators.required, Validators.min(1)]],
        honorarios: [750, [Validators.required, Validators.min(0)]],
        mesesPlan: [24, [Validators.required, Validators.min(1), Validators.max(84)]],
        ingresosNetos: [1500, [Validators.required, Validators.min(1)]],
        gastosFijos: [950, [Validators.required, Validators.min(0)]],
    });

    close(): void {
        this.dialogRef.close(null);
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.dialogRef.close(this.form.getRawValue());
    }
}
