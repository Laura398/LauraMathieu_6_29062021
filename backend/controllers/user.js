/*Crypting data*/
const bcrypt  = require('bcrypt');

const User = require('../models/User');

/*Generating TOKENs*/
const jwt = require('jsonwebtoken');
const ENV = require('dotenv');
ENV.config();

/*Crypto-js*/
const cryptojs = require('crypto-js');

/*Creating accounts when users sign up*/
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString(), /*Crypting email using 'HmacSHA256' method*/
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

/*Checking users loging in*/
exports.login = (req, res, next) => {
  User.findOne({ email: cryptojs.HmacSHA256(req.body.email, process.env.EMAIL_KEY).toString()})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_KEY,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };
