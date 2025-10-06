import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  communes: any[] = [];
  loading: boolean = false;

  fields = [
    { code: 'AUS_FIRSTNAME', label: 'Prénom', obligatoire: true, size: 'w-50', order: 1, type: 'T' },
    { code: 'AUS_LASTNAME', label: 'Nom', obligatoire: false, size: 'w-50', order: 2, type: 'T' },
    { code: 'AUS_BIRTHDATE', label: 'Date de naissance', obligatoire: false, size: 'w-50', order: 3, type: 'D' },
    { code: 'AUS_AGE', label: 'Âge', obligatoire: false, size: 'w-50', order: 4, type: 'N' },
    { code: 'AUS_ADDRESS', label: 'Adresse', obligatoire: false, size: 'w-100', order: 5, type: 'T' },
    { code: 'AUS_EMAIL', label: 'Email', obligatoire: true, size: 'w-100', order: 6, type: 'T' },
    { code: 'AUS_PHONE', label: 'Téléphone', obligatoire: false, size: 'w-100', order: 7, type: 'T' },
    { code: 'AUS_SEXE', label: 'Sexe', obligatoire: false, size: 'w-50', order: 8, type: 'L', options: [] }
  ]
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private userService: UserService
  ) {
    this.signupForm = this.fb.group({
      AUS_FIRSTNAME: [null, [Validators.required]],   
      AUS_LASTNAME: [null],  
      AUS_BIRTHDATE: [null],   
      AUS_AGE: [null, [Validators.pattern(/^[0-9]+$/)]],
      AUS_ADDRESS: [null], 
      AUS_EMAIL: [null, [Validators.required, Validators.email]],
      AUS_PHONE: [null],
      AUS_SEXE: [null], 
    });    
  }

  ngOnInit(): void {}

  getFormControl(name: string): FormControl {
    return this.signupForm.get(name) as FormControl;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
  
    const formValue = {
      ...this.signupForm.value,
    };
  
    const encryptedFormGroup = new FormGroup({});
    Object.entries(formValue).forEach(([key, value]) => {
      encryptedFormGroup.addControl(key, new FormControl(value));
    });

    console.log("--------------------- ********************/////////\\\\\\\\\************************** ---------------------", this.signupForm.value)

this.userService.addUser(this.signupForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackbarService.success('Vous êtes enregistré avec succès !');
        this.router.navigate(['/otp']);
      },
      error: (error) => {
        this.loading = false;
        // this.snackbarService.error(error.error.msg || 'Une erreur est survenue.');
      }
    });
  }  
}
