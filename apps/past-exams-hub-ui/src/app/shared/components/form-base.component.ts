import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  concatMap,
  finalize,
  of,
  shareReplay,
  tap,
} from 'rxjs';
import { isEqual } from 'lodash';

@Component({
  template: '',
})
export abstract class FormBaseComponent<
  TData extends {
    [K in keyof TData]: AbstractControl<any>;
  } = any
> implements OnInit
{
  private _isSaving = new BehaviorSubject<boolean>(false);
  isSaving$ = this._isSaving.asObservable().pipe(shareReplay());

  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  showValidation = false;
  form!: FormGroup<TData>;

  showSavingIndicator(obs$: Observable<any>): Observable<any> {
    return of(null).pipe(
      tap(() => {
        this._isSaving.next(true);
        this.form?.disable();
      } ),
      concatMap(() => obs$),
      finalize(() => {
        this._isSaving.next(false);
        this.form?.enable();
      } )
    );
  }

  ngOnInit() {
    this.form?.valueChanges.pipe(tap(() => this.cd.markForCheck())).subscribe();
  }

  getName(control: AbstractControl): string | null {
    const group = control?.parent as UntypedFormGroup;
    if (!group) {
      return null;
    }
    let name = '';
    Object.keys(group.controls).forEach((key) => {
      const childControl = group.get(key);
      if (childControl !== control) {
        return;
      }
      name = key;
    });
    return name;
  }

  protected mapControlsToModel<TCommand extends object>(): TCommand {
    return this.form.value as TCommand;
  }

  protected checkFormValidity(): boolean {
    if (this.form.invalid) {
      this.showValidation = true;
      this.form.markAllAsTouched();
      this.cd.markForCheck();
      return true;
    }
    return false;
  }

  areAllFormValuesDefault(defaultValues: unknown[]): boolean {
    for (const field in defaultValues) {
      if (Object.prototype.hasOwnProperty.call(defaultValues, field)) {
        const formValue = this.form.get(field)?.value || null;
        const defaultValue = defaultValues[field];
        if (!isEqual(formValue, defaultValue)) {
          return false;
        }
      }
    }
    return true;
  }
}
