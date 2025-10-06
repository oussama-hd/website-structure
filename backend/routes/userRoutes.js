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
 *     summary: Add a new agency user
 *     description: Inserts a new user (agency) record into the Oracle database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - AUS_ID
 *               - AUS_FIRSTNAME
 *               - AUS_EMAIL
 *             properties:
 *               AUS_FIRSTNAME:
 *                 type: string
 *                 example: Oussama
 *               AUS_LASTNAME:
 *                 type: string
 *                 example: Benali
 *               AUS_PHONE:
 *                 type: string
 *                 example: "+213551234567"
 *               AUS_SEXE:
 *                 type: string
 *                 enum: [Homme, Femme]
 *                 example: Homme
 *               AUS_ADDRESS:
 *                 type: string
 *                 example: "12 Rue Didouche Mourad, Alger"
 *               AUS_EMAIL:
 *                 type: string
 *                 format: email
 *                 example: "oussama@example.com"
 *               AUS_AGE:
 *                 type: integer
 *                 example: 28
 *               AUS_BIRTHDATE:
 *                 type: string
 *                 format: date
 *                 example: "1997-05-21"
 *     responses:
 *       201:
 *         description: User added successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */

router.post("/", addAgency);

module.exports = router;
