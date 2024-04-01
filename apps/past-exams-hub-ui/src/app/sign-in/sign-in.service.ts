import { Injectable, inject } from '@angular/core';
import {
  AuthenticationService,
  PastExamsHubAuthorityApplicationAuthenticationCommandsSignInSignInCommand,
} from '@org/authority/data-access';
import { EMPTY, catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SignInService {
  private authenticationService = inject(AuthenticationService);
  private snackBar = inject(MatSnackBar);

  signIn(
    formData: {
      email: string | undefined;
      password: string | undefined;
    },
    returnUrl: string | undefined
  ) {
    const command: PastExamsHubAuthorityApplicationAuthenticationCommandsSignInSignInCommand =
      {
        email: formData.email,
        password: formData.password,
        rememberMe: false,
        returnUrl,
      };

    return this.authenticationService.authenticationSignInPost(command).pipe(
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
    );
  }
}
