import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    // this.snackBar.openFromComponent(SnackbarComponent, {
    //   data: { message, type: 'success' },
    //   duration: 3000,
    //   horizontalPosition: 'center',
    //   verticalPosition: 'bottom',
    //   panelClass: ['snackbar-panel'],
    // });
  }

  error(message: string) {
    // this.snackBar.openFromComponent(SnackbarComponent, {
    //   data: { message, type: 'error' },
    //   duration: 3000,
    //   horizontalPosition: 'center',
    //   verticalPosition: 'bottom',
    //   panelClass: ['snackbar-panel'],
    // });
  }
}
