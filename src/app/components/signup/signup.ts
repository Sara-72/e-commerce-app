import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  isLoading: boolean = false;
  errorMessage: string = '';

  // Custom validator to confirm passwords match
  confirmPasswordValidator(control: AbstractControl) {
    if (control.get('password')?.value !== control.get('rePassword')?.value) {
      control.get('rePassword')?.setErrors({ mismatch: true });
    } else {
      return null;
    }
    return null;
  }

  signupForm: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,10}$/)]],
    rePassword: [''],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }, { validators: this.confirmPasswordValidator });

  handleRegister(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this._authService.register(this.signupForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message === 'success') {
            this._router.navigate(['/signin']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message;
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
