const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 

require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js + Oracle API",
      version: "1.0.0",
      description: "API documentation for your Node.js app connected to Oracle",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
