const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes"); 

console.log("authRoutes type =", typeof authRoutes);
console.log("taskRoutes type =", typeof taskRoutes);

const startServer = async () => {
  console.log("🚀 Démarrage serveur...");

  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Serveur opérationnel ✓" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
  
  
  const PORT = process.env.PORT || 5000;


  app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur le port ${PORT}`);
  });
};

startServer();