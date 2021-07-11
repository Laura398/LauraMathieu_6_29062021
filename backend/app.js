/*Required modules*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

/*Routes parameters*/
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

/*Express app initialisation*/
const app = express();

/*Connecting to MongoDB*/
mongoose.connect('mongodb+srv://pekocko:pecocko.password48@cluster0.jpeop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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