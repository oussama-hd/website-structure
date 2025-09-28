mon-projet/
│── backend/               # API Node.js + Oracle
│   │── server.js
│   │── package.json
│   │── .env
│   │── config/
│   │   └── db.js
│   │── controllers/
│   │   └── userController.js
│   │── middleware/
│   │   └── authMiddleware.js
│   │── models/
│   │   └── userModel.js
│   │── routes/
│   │   └── userRoutes.js
│   └── utils/
│       └── token.js
│
│── frontend/              # Angular App
│   │── angular.json
│   │── package.json
│   │── tsconfig.json
│   │── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts
│   │   │   │   └── interceptors/
│   │   │   │       └── auth.interceptor.ts
│   │   │   ├── auth/       # module d'authentification
│   │   │   │   ├── login/
│   │   │   │   │   └── login.component.ts/html/scss
│   │   │   │   ├── register/
│   │   │   │   │   └── register.component.ts/html/scss
│   │   │   │   └── auth.module.ts
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts/html/scss
│   │   │   ├── shared/     # composants réutilisables
│   │   │   │   └── navbar/
│   │   │   │       └── navbar.component.ts/html/scss
│   │   │   └── app-routing.module.ts
│   │   └── assets/
│   │       └── styles/
│   │           └── global.scss
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
│
└── README.md