import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBaseComponent } from '../../shared/components/form-base.component';
import { ProfessorsService } from '../professors.service';
import { TeachersService } from '@org/portal/data-access';
import { tap } from 'rxjs';

@Component({
  selector: 'pastexamshub-add-edit-professors-dialog',
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
  providers: [TeachersService, ProfessorsService],
  templateUrl: './add-edit-professors-dialog.component.html',
  styleUrl: './add-edit-professors-dialog.component.scss',
})
export class AddEditProfessorsDialogComponent extends FormBaseComponent {
  dataProfessor$!: any;
  constructor(
    public dialogRef: MatDialogRef<AddEditProfessorsDialogComponent>,
    private professorsService: ProfessorsService,
    @Inject(MAT_DIALOG_DATA) public dataUid: string
  ) {
    super();

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(1)]],
      firstName: [''],
      lastName: [''],
      courses: this.fb.array([]),
    });

    if (this.dataUid) {
      this.populateFormWithData();
    }
  }

  private populateFormWithData() {
    this.dataProfessor$ = this.professorsService
      .getProfessorSingle(this.dataUid)
      .pipe(
        tap((x) => {
          this.form = this.fb.group({
            email: [
              x?.email ?? '',
              [Validators.required, Validators.minLength(1)],
            ],
            firstName: [x?.firstName ?? ''],
            lastName: [x?.lastName ?? ''],
            courses: this.fb.array(
              x?.courses
                ? x.courses.map((course) =>
                    this.fb.group({
                      uid: [course.uid],
                      name: [course.name],
                    })
                  )
                : []
            ),
          });
        })
      );
  }

  addCourse(course: string) {
    this.courses.push(this.fb.group(course));
  }

  get courses(): FormArray {
    return this.form.controls['courses'] as FormArray;
  }

  saveChanges() {
    if (this.checkFormValidity()) return;

    if (this.dataUid) {
      this.dialogRef.close({
        email: this.form.controls['email'].getRawValue(),
        firstName: this.form.controls['firstName'].getRawValue(),
        lastName: this.form.controls['lastName'].getRawValue(),
        courses: this.form.controls['courses'].getRawValue(),
        uid: this.dataUid,
      });
    } else {
      this.dialogRef.close({
        email: this.form.controls['email'].getRawValue(),
        firstName: this.form.controls['firstName'].getRawValue(),
        lastName: this.form.controls['lastName'].getRawValue(),
        courses: this.form.controls['courses'].getRawValue(),
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
