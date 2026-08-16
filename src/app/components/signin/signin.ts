import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { TranslatePipe } from '@ngx-translate/core'; // <-- Import TranslatePipe

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink ,TranslatePipe],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class SigninComponent {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  isLoading: boolean = false;
  errorMessage: string = '';

  signinForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  handleLogin(): void {
    if (this.signinForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';


      this._authService.login(this.signinForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message === 'success') {
            localStorage.setItem('userToken', res.token);
            this._authService.saveToken(res.token);

            this._router.navigate(['/home']);
          }

        },
      error: (err) => {
        this.isLoading = false; // Ensures spinner stops on error
        console.error('Login error details:', err);
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }
}
