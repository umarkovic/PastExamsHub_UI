import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CurrentUserService } from '../shared/services/current-user.service';
import { ProfileService } from './profile.service';
import { TeachersService, UsersService } from '@org/portal/data-access';
import { tap } from 'rxjs';

@Component({
  selector: 'pastexamshub-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  providers: [ProfileService, UsersService, TeachersService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent extends FormBaseComponent {
  currentUser = this.currentUserService.currentUser;

  data$ =
    this.currentUser.role === 'Student'
      ? this.profileService.fetchDataStudent(this.currentUser.sub).pipe(
          tap((x) => {
            this.form.patchValue({
              firstName: x.user?.firstName,
              lastName: x.user?.lastName,
              email: x.user?.email,
              index: x.user?.index,
              gender: x.user?.gender,
              yearOfStudy: x.user?.studyYear,
            });
          })
        )
      : this.profileService.fetchDataProfessor(this.currentUser.sub).pipe(
          tap((x) => {
            const courses =
              x.user && x.user.courses
                ? x.user.courses.map((course) => course.name).join(', ')
                : undefined;
            this.form.patchValue({
              firstName: x.user?.firstName,
              lastName: x.user?.lastName,
              email: x.user?.email,
              gender: x.user?.gender,
              courses: courses,
            });
          })
        );

  genders = [
    { value: 'Musko', viewValue: 'Musko' },
    { value: 'Zensko', viewValue: 'Zensko' },
  ];

  constructor(
    private currentUserService: CurrentUserService,
    private profileService: ProfileService
  ) {
    super();
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      index: ['', Validators.required],
      gender: ['', Validators.required],
      yearOfStudy: ['', Validators.required],
      courses: ['', Validators.required],
    });
  }

  submit() {
    this.profileService.editProfile(this.currentUser, this.form.getRawValue());
  }
}
