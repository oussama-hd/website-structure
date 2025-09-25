import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})

export class MobileMenuComponent {
  menus: any[] = [
    { name: 'Accueil', link: '' },
    {
      name: 'Qui Sommes Nous ?',
      children: [
        { name: 'Des Valeurs', link: '/valeurs' },
        { name: 'Mot du PDG', link: '/mot-pdg' },
      ],
    },
    {
      name: 'Produits',
      children: [
        {
          name: 'Particuliers',
          link: '/products/Particuliers',
          children: [
            { name: 'CIARiti', link: '/products/ciariti' },
            { name: 'DIAR', link: '/products/diar' },
            { name: 'Madania', link: '/products/madania' },
            { name: 'CatNat', link: '/products/catnat' },
          ],
        },
        {
          name: 'Professionnels',
          children: [
            { name: 'CIARiti Pro', link: '/products/ciariti-pro' },
            { name: 'MultiPro', link: '/products/multipro' },
            { name: 'Filachti', link: '/products/filachti' },
          ],
        },
      ],
    },
    { name: 'Carrière', link: '/carriere' },
    { name: 'Contactez-Nous', link: '/contact' },
  ];

  @Output() closeMenu = new EventEmitter<void>();

  constructor() {}

  onNavigate() {
    this.closeMenu.emit();
  }
}
