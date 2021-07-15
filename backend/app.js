/*Required modules*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

/*Security*/
const helmet = require('helmet');
const noCache = require('nocache');
const ENV = require('dotenv');
ENV.config();

/*Routes parameters*/
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

/*Express app initialisation*/
const app = express();

/*Express Rate Limit*/
const rateLimit = require('express-rate-limit');

/*Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc) :
(see https://expressjs.com/en/guide/behind-proxies.html)
app.set('trust proxy', 1);*/

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, /*15 minutes*/
  max: 100 /*limit each IP to 100 requests per windowMs*/
});

/*Apply to all requests*/
app.use(limiter);

/*HTTP request security with Helmet*/
app.use(helmet());

/*No Cache with Helmet*/
app.use(noCache());

/*Connecting to MongoDB*/
mongoose.connect(process.env.PATH_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/*CORS*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/*To parse JSON requests*/
app.use(bodyParser.json());

/*Images path*/
app.use('/images', express.static(path.join(__dirname, 'images')));

/*Routes path*/
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;