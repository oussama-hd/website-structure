import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}

  isMenuOpen = false;
  openSubmenus: { [key: string]: boolean } = {};

  toggleMenu(state: boolean) {
    this.isMenuOpen = state;
  }
}
