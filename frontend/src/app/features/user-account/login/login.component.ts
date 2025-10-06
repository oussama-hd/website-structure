import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { AuthenticationService } from '../../../services/authentification/services/authentication.service';
import { Encryption } from '../../../services/authentification/utils/Encryption';
import { Router } from '@angular/router';
import { APPLICATION_PATH } from '../../../shared/utils/constans';
import { SnackbarService } from '../../../services/snackbar.service';
import { Field } from '../../../models/field';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent {
  signInForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  remindMe: boolean = false;
  token: string = '';
  otp: string = '';
  hide = false;

  fields : Field [] = [
    { code: 'username', label: 'Email', type: 'email', obligatoire:true, order:1 },
    { code: 'password', label: 'Password', type: 'password' , obligatoire:true, order:2},
  ];

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.email,
          // Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          // Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')
        ],
      ],
    });
  }

  getFormControl(name: string): FormControl {
    return this.signInForm.get(name) as FormControl;
  }

  onSubmit() {
    this.submitted = true;
    if (this.signInForm.invalid) {
      return;
    }

    this.loading = true;

    const formData = {
      username: this.signInForm.get('username')?.value,
      password: Encryption.encryptText(this.signInForm.get('password')?.value),
    };

    this.authenticationService.login(formData).subscribe({
      next: (data) => {
        this.loading = false;

        this.token = data.data.accessToken;
        this.authenticationService.setSession(this.token);
        this.otp = data.data.accessOtp;

        if (this.otp && this.otp !== '' && this.otp === '1>6Z7xb;Zfvs,H') {
          this.snackbarService.success(
            'Vous devez terminer votre inscription !'
          );
          setTimeout(() => {
            this.router.navigate(['/otp']);
          }, 500);
        } else {
          this.snackbarService.success('Connexion réussie.');
          setTimeout(() => {
            this.router.navigate([`${APPLICATION_PATH}/`]);
          }, 500);
        }
      },
      error: (error) => {
        this.loading = false;
        setTimeout(() => {
          this.snackbarService.error('Identifiants incorrects !');
        }, 1000);
      },
    });
  }
}
