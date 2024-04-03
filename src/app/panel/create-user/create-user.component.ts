import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, startWith, take, takeUntil } from 'rxjs';
import { RolesListItem } from '../User';
import { UserService } from '../user.service';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit, OnDestroy {
  hidePassword = true;
  @Output() closeCreation = new EventEmitter();
  public rolesList$ = new BehaviorSubject<Array<RolesListItem>>([]);
  subscriptions$: Subject<boolean> = new Subject<boolean>();

  userForm = this.fb.group(
    {
      username: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      first_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      last_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      email: this.fb.control('', [
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$'),
        Validators.required,
      ]),
      type: this.fb.control(2, Validators.required),
      password: this.fb.control('', [
        Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9]).{8,}'),
        Validators.required,
      ]),
      confirm_password: this.fb.control('', [
        Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9]).{8,}'),
        Validators.required,
      ]),
    },
    { validators: [this.checkPasswords()] },
  );

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected userService: UserService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userService
      .getRoles()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((roles) => {
        this.rolesList$.next(roles);
      });
    this.initUserFilters();
    this.userForm.markAsUntouched();
  }

  ngOnDestroy(): void {
    this.subscriptions$.next(true);
    this.subscriptions$.unsubscribe();
  }

  submit() {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const request = this.getRequest(this.userForm.controls);

    this.userService
      .createUser(request)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.toastr.success('', `${'User Created Successfully'}`, {
            positionClass: 'toast-top-right',
            toastClass: 'ngx-toast-custom-success',
            closeButton: false,
          });
          this.userForm.reset();
          this.userCreated();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('', `${'Something went wrong!'}`, {
            positionClass: 'toast-top-left',
            toastClass: 'ngx-toast-custom-error',
            closeButton: false,
          });
        },
      });
  }

  private getRequest(form: any) {
    return {
      username: form.username.value,
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      user_type: form.type.value,
      password: form.password.value,
    };
  }

  checkPasswords() {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirm_password');
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return null;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  protected initUserFilters() {
    this.username.valueChanges
      .pipe(startWith(''), debounceTime(550), takeUntil(this.subscriptions$))
      .subscribe((value: string) => {
        if (value && value.length > 1) {
          const query = value;
          this.userService.checkUserExists(query).subscribe((res: any) => {
            if (res.length > 0 && res[0].username === this.username.value) {
              this.username.setErrors({
                similar_name: true,
              });
            } else {
              this.username.setErrors(null);
            }
          });
        } else if (!this.username.value) {
          this.username.setErrors({ required: true });
        }
      });
  }

  closeCreateUser() {
    this.closeCreation.next('closed');
  }

  userCreated() {
    this.closeCreation.next('created');
  }

  get username(): FormControl {
    return this.userForm.controls['username'] as FormControl;
  }
  get password(): FormControl {
    return this.userForm.controls['password'] as FormControl;
  }
  get confirm_password(): FormControl {
    return this.userForm.controls['confirm_password'] as FormControl;
  }
  get type(): FormControl {
    return this.userForm.controls['type'] as FormControl;
  }
}
