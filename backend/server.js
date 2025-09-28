require("dotenv").config();
const express = require("express");
const { initOracle, closePool } = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API Node + Oracle 🚀"));

const PORT = process.env.PORT || 5000;

async function start() {
  await initOracle();
  app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));
}

process.on("SIGINT", async () => {
  await closePool();
  process.exit(0);
});

start();
