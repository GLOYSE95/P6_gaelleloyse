const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Schéma de données User
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

//Exportation du schéma : modèle Mongoose User
module.exports = mongoose.model("User", userSchema);
