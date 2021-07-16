const express = require('express');
const router = express.Router();
const passwordSchema = require('../middleware/password-validator');

const rateLimit = require("express-rate-limit");

/*Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc):
(see https://expressjs.com/en/guide/behind-proxies.html)
app.set('trust proxy', 1);*/

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, /*1 hour window*/
  max: 3, /*start blocking after 3 requests*/
  message:
    "Too many tries, please try again after an hour"
});

const userCtrl = require('../controllers/user');

/*Paths*/
router.post('/signup', passwordSchema, userCtrl.signup);
router.post('/login', createAccountLimiter, userCtrl.login); /*Will block after 3 wrong passwords*/

module.exports = router;