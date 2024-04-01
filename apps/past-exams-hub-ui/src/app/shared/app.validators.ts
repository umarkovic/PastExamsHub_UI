import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class AppValidators {
  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const newPassword = group.controls.password?.value;
    const confirmNewPassword = group.controls.confirmPassword?.value;
    return newPassword !== confirmNewPassword ? { passwordMatch: true } : null;
  }

  static isMatching(matchTo: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent.controls as any)[matchTo].value
        ? null
        : { isMatching: false };
    };
  }
}
