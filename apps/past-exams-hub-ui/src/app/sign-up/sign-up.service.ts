import { Injectable, inject } from '@angular/core';
import { AuthenticationService, PastExamsHubAuthorityApplicationAuthenticationCommandsSignUpSignUpCommand } from '@org/authority/data-access';

@Injectable()
export class SignUpService {
    private authenticationService = inject(AuthenticationService);
    

    signUp(formData: {
        firstName: string | undefined;
        lastName: string | undefined;
        email: string | undefined;
        passwords: {
            password: string | undefined;
            confirmPassword: string | undefined;
        };
    }) {
        const command: PastExamsHubAuthorityApplicationAuthenticationCommandsSignUpSignUpCommand = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.passwords.password,
            confirmPassword: formData.passwords.confirmPassword
        };
        return this.authenticationService.authenticationSignUpPost(command);
    }
}