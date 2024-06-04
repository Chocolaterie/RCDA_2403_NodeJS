// import express
const express = require('express');
const { v4: uuidv4 } = require('uuid');

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

// Routes
app.get('/articles', async (request, response) => {

    // récupérer les articles en base
    const articles = await Article.find();

    return response.json(articles);
});

app.get('/article/:id', async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    // Trouver un article dans la BDD selon l'id
    const foundArticle = await Article.findOne({ id : idParam});

    // retourner l'article trouvé en json
    return response.json(foundArticle);
});

/**
 * Ajouter/modifier un article
 */
app.post('/save-article', async (request, response) => {
    // Si id renseigné
    if (request.body.id){
        // Si edition

        // -- Recupérer l'id dans l'url
        const idParam = request.body.id;

        // Récupérer l'article à modifier
        let articleToUpdate = await Article.findOne({ id : idParam });

        // modifier les valeurs (adresse mémoire donc pas besoin de modifier le tableau)
        articleToUpdate.title = request.body.title;
        articleToUpdate.content = request.body.content;
        articleToUpdate.author = request.body.author;

        // sauvegarder en base
        await articleToUpdate.save();

        // retourner la réponse json
        return response.json(`L'article a été modifié avec succès`);
    }
    // Sinon creation
    let articleToCreate = request.body;

    // -- générer un id unique
    articleToCreate.id = uuidv4();

    // -- ajouter dans le tableau
    await Article.create(articleToCreate);

    // retourner la réponse json
    return response.json(`L'article a été ajouté avec succès`);
});

/**
 * Supprimer un article
 */
app.delete('/article/:id', async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    // Trouver l'article à supprimer
    const articleToDelete = await Article.findOne({id : idParam});

    // Erreur : Pas d'article en base à supprimer
    if (!articleToDelete){
        return response.json(`Article non trouvé`);
    }

    // Supprimer un element/article dans la tableau à partir de l'index
    await articleToDelete.deleteOne();

    // retourner l'article trouvé en json
    return response.json(`L'article ${idParam} a été supprimé avec succès !`);
});

// Lancer l'application serveur dans un port
app.listen(3000, () => {
    console.log(`Le serveur a démarré avec succès`);
});
