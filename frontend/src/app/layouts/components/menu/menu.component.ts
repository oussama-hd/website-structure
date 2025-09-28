import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})

export class MenuComponent {
  ngOnInit(): void {}

  menus: any[] = [
    { name: 'Accueil', link: '' },
    {
      name: 'Qui Sommes Nous ?',
      children: [
        { name: 'Des Valeurs', link: '/our-values' },
        { name: 'Mot du PDG', link: '/mot-pdg' },
      ],
    },
    {
      name: 'Produits',
      children: [
        {
          name: 'Particuliers',
          link: 'products/particuliers',
          children: [
            { name: 'CIARiti', link: '/products/particuliers/ciariti'  },
            { name: 'DIAR', link: '/products/particuliers/diar' },
            { name: 'Madania', link: '/products/particuliers/madania' },
            { name: 'CatNat', link: '/products/particuliers/catnat' },
          ],
        },
        {
          name: 'Professionnels',
          link: 'products/professinnels',
          children: [
            { name: 'CIARiti Pro', link: '/products/professionnels/ciariti-pro' },
            { name: 'MultiPro', link: '/products/professionnels/multipro' },
            { name: 'Madania Pro', link: '/products/professionnels/madania-pro' },
            { name: 'CatNat', link: '/products/professionnels/cat-nat-pro' },
            { name: 'Filachti', link: '/products/filachti' },
          ],
        },
        {
          name: 'Entreprises',
          link: 'products/entreprises',
          children: [
            { name: 'CIARite', link: '/products/entreprises/ciarite' },
            { name: 'charikati', link: '/products/entreprises/charikati' },
            { name: 'madania', link: '/products/entreprises/madania-en' },
            { name: 'binayati', link: '/products/entreprises/binayati' },
            { name: 'catNat', link: '/products/entreprises/cat-nat' },
            { name: 'Filachti', link: '/products/entreprises/filachti' },
          ],
        },
      ],
    },
    { name: 'Carrière', link: '/carriere' },
    { name: 'Contactez-Nous', link: '/contact' },
  ];
}
