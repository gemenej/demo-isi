import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, startWith, take, takeUntil } from 'rxjs';
import { RolesListItem, User } from '../User';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() userId: number = 0;
  @Output() closeUpdate = new EventEmitter();
  subscriptions$: Subject<boolean> = new Subject<boolean>();

  hidePassword = true;

  public rolesList$ = new BehaviorSubject<Array<RolesListItem>>([]);

  userForm = this.fb.group(
    {
      username: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      first_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      last_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      email: this.fb.control('', [
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$'),
        Validators.required,
      ]),
      type: this.fb.control(0, [Validators.pattern('[0-9]*')]),
      password: this.fb.control('', [Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9]).{8,}')]),
      confirm_password: this.fb.control('', [Validators.pattern('(?=.*[a-zA-Z])(?=.*[0-9]).{8,}')]),
    },
    { validators: [this.checkPasswords()] },
  );

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected fb: FormBuilder,
    protected userService: UserService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'].currentValue) {
      this.userId = changes['userId'].currentValue;
      this.getUser();
    }
  }

  ngOnInit(): void {
    this.userService
      .getRoles()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((roles) => {
        this.rolesList$.next(roles);
      });
    this.initUserFilters();
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions$.next(true);
    this.subscriptions$.unsubscribe();
  }

  getUser(): void {
    this.userService
      .getUser(this.userId)
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((user: User) => {
        this.userForm.patchValue({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          type: Number(user.user_type),
        });
        this.type.setValue(user.user_type);
      });
  }

  submit() {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const request = this.getRequest(this.userForm.controls);

    this.userService
      .updateUser(this.userId, request)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.toastr.success('', `${'User updated successfully!'}`, {
            positionClass: 'toast-top-right',
            toastClass: 'ngx-toast-custom-success',
            closeButton: false,
          });
          this.userUpdated();
        },
        error: (err) => {
          this.toastr.error('', `${'Something went wrong!'}`, {
            positionClass: 'toast-top-left',
            toastClass: 'ngx-toast-custom-error',
            closeButton: false,
          });
        },
      });
  }

  private getRequest(form: any) {
    if (form.password.value === '') {
      return {
        username: form.username.value,
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        user_type: Number(form.type.value),
      };
    } else {
      return {
        username: form.username.value,
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        user_type: Number(form.type.value),
        password: form.password.value,
      };
    }
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
            if (res.length > 0 && res[0].id !== this.userId && res[0].username === this.username.value) {
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

  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe({
      next: (resp) => {
        this.toastr.success('', `${'User deleted successfully!'}`, {
          positionClass: 'toast-top-right',
          toastClass: 'ngx-toast-custom-success',
          closeButton: false,
        });
        this.userDeleted();
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

  closeUpdateUser() {
    this.closeUpdate.next('closed');
  }

  userUpdated() {
    this.closeUpdate.next('updated');
  }

  userDeleted() {
    this.closeUpdate.next('deleted');
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
