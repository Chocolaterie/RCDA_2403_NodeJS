// import express
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// JWT
const jwt = require('jsonwebtoken');
const JWT_SECRET = "chocolatine";

// instancier le serveur
const app = express();

// pour autoriser l'envoie des données dans le body 
app.use(express.json());

// ----------------------------------------------------------
// * MongoDB
// ----------------------------------------------------------
const mongoose = require('mongoose');

// Si connexion reussie
mongoose.connection.once('open', () => {
    console.log(`Connecté(e) à la base de données`);
});

// Si erreur bdd
mongoose.connection.on('error', (err) => {
    console.log(`Erreur à la base données`);
});

// Enclencher à la connexion
mongoose.connect('mongodb://127.0.0.1:27017/db_article');

// Model Article
const Article = mongoose.model('Article', { id: String, title : String, content : String, author : String }, 'articles');

// Model User
const User = mongoose.model('User', { email : String, password : String }, 'users');

/**
 * Réponse métier refactorisé
 * @param {*} response 
 * @param {*} code 
 * @param {*} message 
 * @param {*} data 
 * @returns 
 */
function performReponseAPI(response, code, message, data) {
    
    console.log(`code : ${code} | message : ${message}`);
    
    return response.json({ 
        code : code,
        message : message,
        data : data
    });
}

// ----------------------------------------------------------
// * SWAGGER UI
// ----------------------------------------------------------
const swaggerUI = require('swagger-ui-express');
// -- importer la doc swagger la doc swagger généré
const swaggerDocument = require('./swagger-output.json');
// utiliser le swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// ----------------------------------------------------------
// * Middleware
// ----------------------------------------------------------
async function checkTokenMiddleware(request, response, next) {
    // si pas de token envoyé (erreur)
    if (!request.headers.authorization){
        return performReponseAPI(response, "798", "Token obligatoire");
    }

    // extraire le token (qui est bearer)
    const token = request.headers.authorization.substring(7);

    // verifier la validité
    let result = null;

    try {
        result = await jwt.verify(token, JWT_SECRET);
    } catch (e) {}

    if(!result){
        return performReponseAPI(response, "799", "Token invalide ou expiré");
    }

    // on passe le middleware/on passe le mur
    return next();
}

// Configuer des routes
app.post('/auth', async (request, response) => {
    /* 
        #swagger.summary = 'Url de connexion'
        #swagger.description = "Se connecter à l'aide d'un email et mot de passe pour avoir un token"
    */

    // Tester que le couple email/password existe
    const loggingRequest = request.body;

    const loggedUser = await User.findOne({ email: loggingRequest.email, password : loggingRequest.password });

    // Si erreur 
    if (!loggedUser){
        return performReponseAPI(response, '703', `Couple email/mot de passe incorrect`, null);
    }

    // generer un token
    const token = jwt.sign({ email : loggedUser.email }, JWT_SECRET, { expiresIn : '1h' });

    // retourne la réponse avec le token
    return performReponseAPI(response, '203', `Authentifié(e) avec succès`, token);
});

app.get('/articles', async (request, response) => {

    // récupérer les articles en base
    const articles = await Article.find();

    return performReponseAPI(response, "200", `La liste des articles a été récupérés avec succès`, articles)
});

app.get('/article/:id', async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    // Trouver un article dans la BDD selon l'id
    const foundArticle = await Article.findOne({ id : idParam});

    // Si je trouve pas d'article
    if (!foundArticle){
        return performReponseAPI(response, "702", `Impossible de récupérer un article avec l'UID ${idParam}`, null);
    }

    // retourner l'article trouvé en json
    return performReponseAPI(response, "200", `Article récupéré avec succès`, foundArticle);
});

/**
 * Ajouter/modifier un article
 */
app.post('/save-article', checkTokenMiddleware, async (request, response) => {
    // Si id renseigné
    if (request.body.id){
        // Si edition

        // -- Recupérer l'id dans l'url
        const idParam = request.body.id;

        // Tester que le titre saisie n'existe pas en base
        const articleWithTitle = await Article.findOne({ id : {$ne : idParam}, title : request.body.title });

        // erreur : si titre existant
        if (articleWithTitle){
            // retourner la réponse json
            return performReponseAPI(response, "701", `Impossible de modifier un article dont un autre article possède un titre similaire`, null);
        }

        // Récupérer l'article à modifier
        let articleToUpdate = await Article.findOne({ id : idParam });

        // modifier les valeurs (adresse mémoire donc pas besoin de modifier le tableau)
        articleToUpdate.title = request.body.title;
        articleToUpdate.content = request.body.content;
        articleToUpdate.author = request.body.author;

        // sauvegarder en base
        await articleToUpdate.save();

        // retourner la réponse json
        return performReponseAPI(response, "200", `Article modifié avec succès`, articleToUpdate);
    }
    // Sinon creation
    let articleToCreate = request.body;

    // Tester que le titre saisie n'existe pas en base
    const articleWithTitle = await Article.findOne({ title : articleToCreate.title });

    // erreur : si titre existant
    if (articleWithTitle){
        // retourner la réponse json
        return performReponseAPI(response, "701", `Impossible d'ajouter un article avec un titre déjà existant`, null);
    }

    // -- générer un id unique
    articleToCreate.id = uuidv4();

    // -- ajouter dans le tableau
    const createdArticle = await Article.create(articleToCreate);

    // retourner la réponse json
    return performReponseAPI(response, "200", `Article ajouté avec succès`, createdArticle);
});

/**
 * Supprimer un article
 */
app.delete('/article/:id', checkTokenMiddleware, async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    // Trouver l'article à supprimer
    const articleToDelete = await Article.findOne({id : idParam});

    // Erreur : Pas d'article en base à supprimer
    if (!articleToDelete) {
        return performReponseAPI(response, "702", `Impossible de supprimer un article dont l'UID n'existe pas`, null);
    }

    // Supprimer un element/article dans la tableau à partir de l'index
    await articleToDelete.deleteOne();

    // retourner l'article trouvé en json
    return performReponseAPI(response, "200", `L'article ${idParam} a été supprimé avec succès`, articleToDelete);
});

// Lancer l'application serveur dans un port
app.listen(3000, () => {
    console.log(`Le serveur a démarré avec succès`);
});
