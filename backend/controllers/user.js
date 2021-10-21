const bcrypt = require("bcrypt"); //cryptage du mot de passe
const User = require("../models/user");
const jwt = require("jsonwebtoken"); //genere un token
const cryptojs = require("crypto-js"); //chiffrement via cle du mail
const dotenv = require("dotenv");
const result = dotenv.config();

exports.signup = (req, res, next) => {
  const emailCrypto = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOEMAIL}`)
    .toString();
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCrypto,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const emailCrypto = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOEMAIL}`)
    .toString();
  User.findOne({ email: emailCrypto })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${process.env.TOKENKEY}`, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
