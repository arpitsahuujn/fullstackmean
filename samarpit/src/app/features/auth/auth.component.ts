import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})


export class AuthComponent implements OnInit {

  public loginForm!: FormGroup;
  public registerForm!: FormGroup;
  public authMode: string = 'login'

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {

  
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      usrnm: ['', [Validators.required]],
      pass: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      usrnm: ['', [Validators.required, Validators.minLength(3)]],
      nm: ['', [Validators.required]],
      email: ['', [Validators.required]],
      location: ['', [Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(3)]],
      cpass: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }



  //  form-level validator
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('pass')?.value;
    const confirm = form.get('cpass')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  isInvalid(controlName: string) {

    const control = this.authMode === 'login' ? this.loginForm.get(controlName) : this.registerForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  switchAuthMode() {
    this.authMode = this.authMode === 'login' ? 'register' : 'login'
  }

  onSubmit() {

// Login
    if (this.authMode === 'login') {
      if (this.loginForm.valid) {
        let formValue = this.loginForm.value;
        let param = {
          usrnm: formValue.usrnm,
          pass: formValue.pass,
        }
        this.authService.login(param).subscribe(user => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Simulate session
            this.authService.currentUser.set(user);
            this.router.navigate(['/dashboard']);
          } else {
            alert('Invalid credentials');
          }
        });
      } else {
        this.loginForm.markAllAsTouched();
      }
    }

// Register
    if (this.authMode === 'register') {
      if (this.registerForm.valid) {
        let formValue = this.registerForm.value;
        // Generate a 4-digit unique userId
        const cltId = 'clt' + Math.floor(1000 + Math.random() * 9000).toString();
        const param = {
          usrnm: formValue.usrnm,
          name: formValue.nm,
          pass: formValue.pass,
          email: formValue.email,
          location: formValue.location,
          cltId: cltId, // cltId - for client  ,  userId - for admin and super admin
          role: "3" // 1-super admin , 2-admin , 3-client
        }
        this.authService.register(param).subscribe(result => {
          if (result) {
            localStorage.setItem('user', JSON.stringify(result)); // Simulate session
            this.authService.currentUser.set(result);
            this.router.navigate(['/dashboard']);
          }
        }, err => {
          console.error('Registration failed', err);
        })
      } else {
        this.registerForm.markAllAsTouched();
      }
    }

  }

}


//  Auth Guard Example (auth.guard.ts)
// import { Injectable } from '@angular/core';
// import { CanActivateChild, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivateChild {
//   constructor(private router: Router) {}

//   canActivateChild(): boolean {
//     const isLoggedIn = !!localStorage.getItem('token'); // Or use a proper AuthService
//     if (!isLoggedIn) {
//       this.router.navigate(['/auth/login']);
//       return false;
//     }
//     return true;
//   }
// }