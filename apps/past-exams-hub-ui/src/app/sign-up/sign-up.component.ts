import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpService } from './sign-up.service';
import { HeaderComponent } from '../shared/components/header/header.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { RegexPatterns } from '../shared/constants/regex-patterns';
import { AuthenticationService } from '@org/authority/data-access';
import { AppValidators } from '../shared/app.validators';
import { Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pastexamshub-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCheckboxModule,
    HeaderComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SignUpService, AuthenticationService],
})
export class SignUpComponent extends FormBaseComponent {
  private router = inject(Router);
  private signUpService = inject(SignUpService);
  private snackBar = inject(MatSnackBar);

  override form = this.fb.group({
    firstName: this.fb.nonNullable.control<string | undefined>('', [
      Validators.required,
    ]),
    lastName: this.fb.nonNullable.control<string | undefined>('', [
      Validators.required,
    ]),
    email: this.fb.nonNullable.control<string | undefined>('', [
      Validators.required,
      Validators.email,
    ]),
    passwords: this.fb.group(
      {
        password: this.fb.nonNullable.control<string | undefined>('', [
          Validators.required,
          Validators.pattern(RegexPatterns.PASSWORD_STRENGTH_REGEX),
        ]),
        confirmPassword: this.fb.nonNullable.control<string | undefined>('', [
          Validators.required,
          Validators.pattern(RegexPatterns.PASSWORD_STRENGTH_REGEX),
        ]),
      },
      { validators: AppValidators.passwordMatch }
    ),
  });

  isPasswordVisible = false;
  isConfirmPasswordVisible = false;

  get passwords() {
    return this.form.controls.passwords;
  }

  passwordVisibilityChanged(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  confirmPasswordVisibilityChanged(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  submit() {
    if (this.checkFormValidity()) return;

    const formData = this.form.getRawValue();
    

    this.showSavingIndicator(this.signUpService.signUp(formData)).pipe(
      catchError((error) => {
        console.log(error);
        let errorMessage = '';
        if (error.status === 400) {
          const validationErrors = [];
          for (const value of Object.values(error.error.errors)) {
            if (Array.isArray(value)) {
              validationErrors.push(...value);
            } else {
              validationErrors.push(value);
            }
          }
          errorMessage = validationErrors.join(', ');
        } else {
          errorMessage = error.error?.title;
        }

        this.snackBar.open(errorMessage, 'Close', {
          verticalPosition: 'top',
          panelClass: 'snack-error',
        });
        return EMPTY;
      })
    ).subscribe(
      () => {
        this.router.navigate(['']);
      }
    );
  }
}
