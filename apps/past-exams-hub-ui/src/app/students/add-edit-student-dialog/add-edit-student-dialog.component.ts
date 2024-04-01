import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBaseComponent } from '../../shared/components/form-base.component';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  PastExamsHubCoreApplicationCommonUsersModelsUserModel,
  PastExamsHubCoreDomainEnumsGenderType,
} from '@org/portal/data-access';

@Component({
  selector: 'pastexamshub-add-edit-student-dialog',
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
  templateUrl: './add-edit-student-dialog.component.html',
  styleUrl: './add-edit-student-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditStudentDialogComponent extends FormBaseComponent {
  GenderOptions = [
    { value: PastExamsHubCoreDomainEnumsGenderType.Musko, viewValue: 'Muško' },
    {
      value: PastExamsHubCoreDomainEnumsGenderType.Zensko,
      viewValue: 'Žensko',
    },
  ];
  genders = this.GenderOptions;

  constructor(
    public dialogRef: MatDialogRef<AddEditStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      data: PastExamsHubCoreApplicationCommonUsersModelsUserModel;
      isVisibility: boolean;
    },
    private dateAdapter: DateAdapter<Date>
  ) {
    super();
    this.initializeForm(data.data);
    this.dateAdapter.setLocale('en-GB');
  }

  private initializeForm(
    data: PastExamsHubCoreApplicationCommonUsersModelsUserModel
  ) {
    this.form = this.fb.group({
      email: [
        data?.email ?? '',
        [Validators.required, Validators.minLength(1)],
      ],
      firstName: [data?.firstName ?? ''],
      lastName: [data?.lastName ?? ''],
      index: [data?.index ?? 1],
      studyYear: [data?.studyYear ?? 1],
      gender: [data?.gender ?? ''],
    });
  }

  saveChanges() {
    if (this.checkFormValidity()) return;
    if (!this.data.data?.uid) {
      this.dialogRef.close({
        firstName: this.form.controls['firstName'].getRawValue(),
        lastName: this.form.controls['lastName'].getRawValue(),
        index: this.form.controls['index'].getRawValue(),
        studyYear: this.form.controls['studyYear'].getRawValue(),
        gender: this.form.controls['gender'].getRawValue(),
      });
    } else {
      this.dialogRef.close({
        firstName: this.form.controls['firstName'].getRawValue(),
        lastName: this.form.controls['lastName'].getRawValue(),
        index: this.form.controls['index'].getRawValue(),
        studyYear: this.form.controls['studyYear'].getRawValue(),
        gender: this.form.controls['gender'].getRawValue(),
        uid: this.data.data?.uid,
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
