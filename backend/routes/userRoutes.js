// routes/userRoutes.js
const express = require("express");
const { addAgency, getAllAgencies , } = require("../controllers/userController");
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Ajouter une nouvelle demande d'agence
 *     description: |
 *       Crée une nouvelle demande d'agence avec les informations personnelles, professionnelles et de business plan.
 *       Les fichiers de diplômes et certificats peuvent être envoyés via `multipart/form-data`.
 *     tags:
 *       - Agency
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - AUS_FIRSTNAME
 *               - AUS_LASTNAME
 *               - AUS_PHONE
 *               - AUS_SEXE
 *               - AUS_ADDRESS
 *               - AUS_EMAIL
 *               - AUS_BIRTHDATE
 *               - AUS_EDUCATION_LEVEL
 *               - AUS_INSURANCE_EXPERIENCE
 *               - AUS_HAS_LOCATION
 *               - AUS_WILAYA
 *               - AUS_COMMUNE
 *               - AUS_MOTIVATION
 *               - AUS_REASON_CHOICE
 *               - AUS_ROADMAP
 *             properties:
 *               AUS_FIRSTNAME:
 *                 type: string
 *                 description: "*Prénom de l’agent"
 *                 example: "Oussama"
 *               AUS_LASTNAME:
 *                 type: string
 *                 description: "*Nom de l’agent"
 *                 example: "Benali"
 *               AUS_PHONE:
 *                 type: string
 *                 description: "*Numéro de téléphone"
 *                 example: "+213555000000"
 *               AUS_SEXE:
 *                 type: string
 *                 enum: [H, F]
 *                 description: "*Sexe de l’agent"
 *                 example: "H"
 *               AUS_ADDRESS:
 *                 type: string
 *                 description: "*Adresse postale"
 *                 example: "12 rue de la République, Alger"
 *               AUS_EMAIL:
 *                 type: string
 *                 format: email
 *                 description: "*Adresse e-mail"
 *                 example: "oussama@example.com"
 *               AUS_AGE:
 *                 type: integer
 *                 description: "Âge de l’agent"
 *                 example: 30
 *               AUS_BIRTHDATE:
 *                 type: string
 *                 format: date
 *                 description: "*Date de naissance (format YYYY-MM-DD)"
 *                 example: "1994-06-15"
 *               AUS_EDUCATION_LEVEL:
 *                 type: string
 *                 description: "*Niveau d’études"
 *                 example: "Licence en économie"
 *               AUS_INSURANCE_EXPERIENCE:
 *                 type: string
 *                 description: "*Expérience dans le domaine des assurances"
 *                 example: "5 ans d’expérience dans le secteur"
 *               AUS_DIPLOMAS:
 *                 type: array
 *                 description: "Fichiers de diplômes (upload)"
 *                 items:
 *                   type: string
 *                   format: binary
 *               AUS_CERTIFICATES:
 *                 type: array
 *                 description: "Fichiers de certificats (upload)"
 *                 items:
 *                   type: string
 *                   format: binary
 *               AUS_HAS_LOCATION:
 *                 type: boolean
 *                 description: "*Dispose déjà d’un local ?"
 *                 example: true
 *               AUS_LOCATION_STATUS:
 *                 type: string
 *                 description: "Statut du local (propriétaire / locataire)"
 *                 example: "Propriétaire"
 *               AUS_WILAYA:
 *                 type: string
 *                 description: "*Wilaya d’implantation"
 *                 example: "Alger"
 *               AUS_COMMUNE:
 *                 type: string
 *                 description: "*Commune d’implantation"
 *                 example: "Bab El Oued"
 *               AUS_EXACT_ADDRESS:
 *                 type: string
 *                 description: "Adresse exacte du local"
 *                 example: "Rue Didouche Mourad"
 *               AUS_MOTIVATION:
 *                 type: string
 *                 description: "*Motivation du candidat"
 *                 example: "Contribuer à la croissance du secteur des assurances"
 *               AUS_REASON_CHOICE:
 *                 type: string
 *                 description: "*Raison du choix de CIAR Assurance"
 *                 example: "Opportunité professionnelle et stabilité"
 *               AUS_ROADMAP:
 *                 type: string
 *                 description: "*Plan de développement (roadmap)"
 *                 example: "Développer la clientèle locale sur 3 ans"
 *               AUS_RECRUITMENT_COUNT:
 *                 type: integer
 *                 description: "Nombre d’employés à recruter"
 *                 example: 5
 *               AUS_ESTIMATED_REVENUE:
 *                 type: number
 *                 format: float
 *                 description: "Chiffre d’affaires prévisionnel"
 *                 example: 2500000
 *               AUS_BP_Y1_AUTO:
 *                 type: number
 *                 description: "Business plan — Année 1 — Auto"
 *                 example: 100000
 *               AUS_BP_Y1_SIMPLE_RISKS:
 *                 type: number
 *                 description: "Business plan — Année 1 — Risques simples"
 *                 example: 50000
 *               AUS_BP_Y1_FLEETS:
 *                 type: number
 *                 description: "Business plan — Année 1 — Flottes"
 *                 example: 75000
 *               AUS_BP_Y1_MULTIRISKS:
 *                 type: number
 *                 description: "Business plan — Année 1 — Multirisques"
 *                 example: 80000
 *               AUS_BP_Y2_AUTO:
 *                 type: number
 *                 example: 120000
 *               AUS_BP_Y2_SIMPLE_RISKS:
 *                 type: number
 *                 example: 60000
 *               AUS_BP_Y2_FLEETS:
 *                 type: number
 *                 example: 90000
 *               AUS_BP_Y2_MULTIRISKS:
 *                 type: number
 *                 example: 95000
 *               AUS_BP_Y3_AUTO:
 *                 type: number
 *                 example: 140000
 *               AUS_BP_Y3_SIMPLE_RISKS:
 *                 type: number
 *                 example: 70000
 *               AUS_BP_Y3_FLEETS:
 *                 type: number
 *                 example: 100000
 *               AUS_BP_Y3_MULTIRISKS:
 *                 type: number
 *                 example: 110000
 *     responses:
 *       201:
 *         description: Demande d'agence ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Demande d'agence ajoutée avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 42
 *                     reference:
 *                       type: string
 *                       example: "AA-000042"
 *                     diplomas:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["/uploads/diploma1.pdf", "/uploads/diploma2.pdf"]
 *                     certificates:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["/uploads/cert1.pdf"]
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Paramètres manquants"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "ORA-00904: invalid identifier"
 */

router.post(
    "/",
    upload.fields([
      { name: 'AUS_DIPLOMAS', maxCount: 10 },
      { name: 'AUS_CERTIFICATES', maxCount: 10 }
    ]),
    addAgency
  );

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Récupérer toutes les demandes d'agence
 *     description: |
 *       Retourne la liste complète des demandes d'agence enregistrées dans la base Oracle.
 *       Chaque enregistrement inclut les informations personnelles, professionnelles, de business plan,
 *       ainsi que les fichiers (diplômes et certificats) sous forme d'URL accessibles.
 *     tags:
 *       - Agency
 *     responses:
 *       200:
 *         description: Liste des demandes d'agence récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       AUS_ID:
 *                         type: integer
 *                         example: 12
 *                       reference:
 *                         type: string
 *                         example: "AA-000012"
 *                       AUS_FIRSTNAME:
 *                         type: string
 *                         example: "Oussama"
 *                       AUS_LASTNAME:
 *                         type: string
 *                         example: "Benali"
 *                       AUS_PHONE:
 *                         type: string
 *                         example: "+213770112233"
 *                       AUS_EMAIL:
 *                         type: string
 *                         example: "exemple@mail.com"
 *                       AUS_SEXE:
 *                         type: string
 *                         example: "Homme"
 *                       AUS_ADDRESS:
 *                         type: string
 *                         example: "Cité des Jardins, Alger"
 *                       AUS_WILAYA:
 *                         type: string
 *                         example: "Alger"
 *                       AUS_COMMUNE:
 *                         type: string
 *                         example: "Hydra"
 *                       AUS_EDUCATION_LEVEL:
 *                         type: string
 *                         example: "Licence"
 *                       AUS_INSURANCE_EXPERIENCE:
 *                         type: string
 *                         example: "3 ans"
 *                       AUS_DIPLOMAS:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "http://localhost:5000/uploads/99365e41cd24366ee9036d44c2e2283d"
 *                       AUS_CERTIFICATES:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "http://localhost:5000/uploads/5a1b2c3d4e5f.pdf"
 *                       AUS_STATUS:
 *                         type: string
 *                         example: "EN_ATTENTE"
 *                       CREATED_AT:
 *                         type: string
 *                         example: "2025-10-08 09:32:00"
 *                       UPDATED_AT:
 *                         type: string
 *                         example: "2025-10-08 09:32:00"
 *       500:
 *         description: Erreur interne du serveur
 */

router.get("/all", getAllAgencies);

module.exports = router;
