const express = require("express");
const mongoose = require("mongoose"); // Passerelle Node et Mongo db
const path = require("path"); //accéder et interagir avec le chemin de fichiers.
const dotenv = require("dotenv"); //déclaration des variables d’environnement
const result = dotenv.config();

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express(); //Création appli express
app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://${process.env.USERNAMEMONGO}:${process.env.MDPMONGO}@cluster0.gb5wz.mongodb.net/${process.env.apip6Mongo}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Pour gérer les problèmes de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
//path.dirname() : Renvoie la partie répertoire d'un chemin

module.exports = app; //exportation de l'app pour utilisation dans autres fichiers
