import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBaseComponent } from '../shared/components/form-base.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SignInService } from './sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexPatterns } from '../shared/constants/regex-patterns';
import { AuthenticationService } from '@org/authority/data-access';

@Component({
  selector: 'pastexamshub-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    HeaderComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SignInService, AuthenticationService],
})
export class SignInComponent extends FormBaseComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private signInService = inject(SignInService);

  private returnUrl = this.route.snapshot.queryParamMap.get('ReturnUrl') ?? undefined;

  override form = this.fb.group({
    email: this.fb.nonNullable.control<string | undefined>('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.nonNullable.control<string | undefined>('', [
      Validators.required,
      Validators.pattern(RegexPatterns.PASSWORD_STRENGTH_REGEX),
    ]),
  });

  isPasswordVisible = false;

  passwordVisibilityChanged(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  submit() {
    if (this.checkFormValidity()) return;

    const formData = this.form.getRawValue();

    console.log(formData);

    this.showSavingIndicator(this.signInService.signIn(formData, this.returnUrl)).subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
