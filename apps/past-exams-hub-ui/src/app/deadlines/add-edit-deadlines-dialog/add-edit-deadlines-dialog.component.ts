import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBaseComponent } from '../../shared/components/form-base.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PastExamsHubCoreApplicationExamPeriodsExamPeriodModel } from 'libs/portal/src/model/models';
type Professor = {
  value: string;
  viewValue: string;
};

export const PastExamsHubCoreDomainEnumsExamPeriodType = {
  Januar: 'Januar',
  April: 'April',
  Jun: 'Jun',
  Jun2: 'Jun2',
  Septembar: 'Septembar',
  Oktobar: 'Oktobar',
  Oktobar2: 'Oktobar2',
  Decembar: 'Decembar',
};

@Component({
  selector: 'pastexamshub-add-edit-deadline-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-edit-deadlines-dialog.component.html',
  styleUrl: './add-edit-deadlines-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditDeadlineDialogComponent extends FormBaseComponent {
  professors: Professor[] = [{ value: 'urke', viewValue: 'Uros' }];
  examPeriodTypes = Object.entries(
    PastExamsHubCoreDomainEnumsExamPeriodType
  ).map(([key, value]) => ({ key, value }));
  constructor(
    public dialogRef: MatDialogRef<AddEditDeadlineDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: PastExamsHubCoreApplicationExamPeriodsExamPeriodModel,
    private dateAdapter: DateAdapter<Date>
  ) {
    super();
    this.initializeForm(data);
    this.dateAdapter.setLocale('en-GB');
  }

  private initializeForm(
    data: PastExamsHubCoreApplicationExamPeriodsExamPeriodModel
  ) {
    this.form = this.fb.group({
      name: [
        (data && data.name) ?? '',
        [Validators.required, Validators.minLength(1)],
      ],
      type: [(data && data.periodType) ?? 'Januar'],
      start: [(data && data.startDate) ?? ''],
      end: [(data && data.endDate) ?? ''],
    });
  }

  saveChanges() {
    if (this.checkFormValidity()) return;
    if (!this.data?.uid) {
      this.dialogRef.close({
        name: this.form.controls['name'].getRawValue(),
        type: this.form.controls['type'].getRawValue(),
        start: new Date(this.form.controls['start'].getRawValue()),
        end: new Date(this.form.controls['end'].getRawValue()),
      });
    } else {
      this.dialogRef.close({
        name: this.form.controls['name'].getRawValue(),
        type: this.form.controls['type'].getRawValue(),
        start: new Date(this.form.controls['start'].getRawValue()),
        end: new Date(this.form.controls['end'].getRawValue()),
        uid: this.data?.uid,
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
