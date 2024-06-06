// import express
const express = require('express');

// instancier le serveur
const app = express();

// pour autoriser l'envoie des données dans le body 
const cors = require('cors');
app.use(cors());

app.use(express.json());

// Init mongo connection
const initConnection = require('./mongoose/mongoose-config');
initConnection();
  
// ----------------------------------------------------------
// * SWAGGER UI
// ----------------------------------------------------------
const swaggerUI = require('swagger-ui-express');
// -- importer la doc swagger la doc swagger généré
const swaggerDocument = require('./swagger-output.json');
// utiliser le swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Injecter nos routes
const authRoutes = require('./routes/auth-routes');
const articleRoutes = require('./routes/articles-routes');

// v1 obseletes
app.use(authRoutes);
app.use(articleRoutes);

// v2
const articleRoutesv2 = require('./routes/v2/articles-routes');

app.use('/v2/article', articleRoutesv2);

// Lancer l'application serveur dans un port
app.listen(3000, () => {
    console.log(`Le serveur a démarré avec succès`);
});
