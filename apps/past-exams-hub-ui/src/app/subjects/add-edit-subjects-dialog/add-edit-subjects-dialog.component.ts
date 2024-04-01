import { Component, Inject } from '@angular/core';
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
import { PastExamsHubCoreApplicationTeachersModelsTeacherListModel } from 'libs/portal/src/model/pastExamsHubCoreApplicationTeachersModelsTeacherListModel';
import { PastExamsHubCoreDomainEnumsCourseType } from 'libs/portal/src/model/pastExamsHubCoreDomainEnumsCourseType';
import { PastExamsHubCoreApplicationCoursesModelsCourseModel } from 'libs/portal/src/model/models';

type Professor = {
  value: string;
  viewValue: string;
};

interface CourseTypeOption {
  key: string;
  value: PastExamsHubCoreDomainEnumsCourseType;
}

@Component({
  selector: 'pastexamshub-add-edit-subjects-dialog',
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
  ],
  templateUrl: './add-edit-subjects-dialog.component.html',
  styleUrl: './add-edit-subjects-dialog.component.scss',
})
export class AddEditSubjectsDialogComponent extends FormBaseComponent {
  professorsData: PastExamsHubCoreApplicationTeachersModelsTeacherListModel[] =
    [];

  courseTypes: CourseTypeOption[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddEditSubjectsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dataSubject: PastExamsHubCoreApplicationCoursesModelsCourseModel;
      proffesorsData: PastExamsHubCoreApplicationTeachersModelsTeacherListModel[];
    }
  ) {
    super();
    this.initializeForm(data.dataSubject);
    this.professorsData = data.proffesorsData;
    this.courseTypes = Object.entries(PastExamsHubCoreDomainEnumsCourseType)
      .map(([key, value]) => ({
        key: key,
        value: value,
      }))
      .filter((courseType) => courseType.value !== 'Unknown');
  }

  private initializeForm(
    data: PastExamsHubCoreApplicationCoursesModelsCourseModel
  ) {
    this.form = this.fb.group({
      name: [data?.name ?? '', [Validators.required, Validators.minLength(1)]],
      type: [data?.courseType ?? ''],
      professorUid: [data?.lecturerUid ?? ''],
      year: [data?.studyYear ?? 1],
      semester: [data?.semester ?? 1],
      points: [data?.espb ?? 60],
    });
  }

  saveChanges() {
    if (this.checkFormValidity()) return;
    if (this.data.dataSubject && this.data.dataSubject?.uid) {
      this.dialogRef.close({
        name: this.form.controls['name'].getRawValue(),
        type: this.form.controls['type'].getRawValue(),
        professorUid: this.form.controls['professorUid'].getRawValue(),
        year: this.form.controls['year'].getRawValue(),
        semester: this.form.controls['semester'].getRawValue(),
        points: this.form.controls['points'].getRawValue(),
        uid: this.data.dataSubject.uid,
      });
    } else {
      this.dialogRef.close({
        name: this.form.controls['name'].getRawValue(),
        type: this.form.controls['type'].getRawValue(),
        professorUid: this.form.controls['professorUid'].getRawValue(),
        year: this.form.controls['year'].getRawValue(),
        semester: this.form.controls['semester'].getRawValue(),
        points: this.form.controls['points'].getRawValue(),
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
