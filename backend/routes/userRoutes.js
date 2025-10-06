// routes/userRoutes.js
const express = require("express");
const { getAllUsers, addAgency } = require("../controllers/userController");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users from the Oracle database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   AUS_ID:
 *                     type: integer
 *                   AUS_FIRSTNAME:
 *                     type: string
 *                   AUS_EMAIL:
 *                     type: string
 */

router.get("/", getAllUsers);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer une nouvelle demande d'agence
 *     description: |
 *       Ce point d'entrée permet d'ajouter une nouvelle demande d'agence (AUS) dans la base Oracle.
 *       Il calcule automatiquement les totaux pour les business plans des 3 années et renvoie un identifiant unique.
 *     tags:
 *       - Agence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AUS_FIRSTNAME:
 *                 type: string
 *                 example: "Oussama"
 *               AUS_LASTNAME:
 *                 type: string
 *                 example: "Benali"
 *               AUS_PHONE:
 *                 type: string
 *                 example: "+213770000000"
 *               AUS_SEXE:
 *                 type: string
 *                 example: "Homme"
 *               AUS_ADDRESS:
 *                 type: string
 *                 example: "10 Rue Didouche Mourad"
 *               AUS_EMAIL:
 *                 type: string
 *                 example: "oussama@example.com"
 *               AUS_AGE:
 *                 type: integer
 *                 example: 29
 *               AUS_BIRTHDATE:
 *                 type: string
 *                 format: date
 *                 example: "1996-03-15"
 *               AUS_EDUCATION_LEVEL:
 *                 type: string
 *                 example: "Licence en commerce"
 *               AUS_INSURANCE_EXPERIENCE:
 *                 type: string
 *                 example: "2 ans d'expérience en assurance auto"
 *               AUS_DIPLOMAS:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Licence Gestion", "Master Assurance"]
 *               AUS_CERTIFICATES:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Certificat en gestion des risques"]
 *               AUS_HAS_LOCATION:
 *                 type: boolean
 *                 example: true
 *               AUS_LOCATION_STATUS:
 *                 type: string
 *                 example: "Propriétaire"
 *               AUS_WILAYA:
 *                 type: string
 *                 example: "Alger"
 *               AUS_COMMUNE:
 *                 type: string
 *                 example: "Hydra"
 *               AUS_EXACT_ADDRESS:
 *                 type: string
 *                 example: "12 Rue des Oliviers"
 *               AUS_MOTIVATION:
 *                 type: string
 *                 example: "Je souhaite développer mon activité dans le secteur des assurances."
 *               AUS_REASON_CHOICE:
 *                 type: string
 *                 example: "Ciar est une compagnie reconnue pour son sérieux."
 *               AUS_ROADMAP:
 *                 type: string
 *                 example: "Ouverture en 3 mois, recrutement de 2 collaborateurs."
 *               AUS_RECRUITMENT_COUNT:
 *                 type: integer
 *                 example: 2
 *               AUS_ESTIMATED_REVENUE:
 *                 type: number
 *                 example: 2500000
 *               AUS_BP_Y1_AUTO:
 *                 type: number
 *                 example: 800000
 *               AUS_BP_Y1_SIMPLE_RISKS:
 *                 type: number
 *                 example: 200000
 *               AUS_BP_Y1_FLEETS:
 *                 type: number
 *                 example: 100000
 *               AUS_BP_Y1_MULTIRISKS:
 *                 type: number
 *                 example: 150000
 *               AUS_BP_Y2_AUTO:
 *                 type: number
 *                 example: 1000000
 *               AUS_BP_Y2_SIMPLE_RISKS:
 *                 type: number
 *                 example: 300000
 *               AUS_BP_Y2_FLEETS:
 *                 type: number
 *                 example: 200000
 *               AUS_BP_Y2_MULTIRISKS:
 *                 type: number
 *                 example: 250000
 *               AUS_BP_Y3_AUTO:
 *                 type: number
 *                 example: 1200000
 *               AUS_BP_Y3_SIMPLE_RISKS:
 *                 type: number
 *                 example: 400000
 *               AUS_BP_Y3_FLEETS:
 *                 type: number
 *                 example: 250000
 *               AUS_BP_Y3_MULTIRISKS:
 *                 type: number
 *                 example: 300000
 *     responses:
 *       201:
 *         description: Agence créée avec succès
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
 *                   example: "ORA-00001: unique constraint violated"
 */
router.post("/", addAgency);

module.exports = router;
