import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-user-menu',
  standalone: false,
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
})
export class UserMenuComponent {
  isXsScreen = false;
  constructor(
    // public authService: AuthenticationService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => {
        this.isXsScreen = result.matches;
      });
  }
  logout(): void {
    // this.authService.logout();
    this.router.navigate(['/login']);
  }
}
