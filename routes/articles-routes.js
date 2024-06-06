const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Article = require('../mongoose/models/mongoose-article');
const helpers = require('../shared/helpers');
const middlewares = require('../shared/middlewares');

router.get('/articles', async (request, response) => {

    // récupérer les articles en base
    const articles = await Article.find();

    return helpers.performReponseAPI(response, "200", `La liste des articles a été récupérés avec succès`, articles)
});

router.get('/article/:id', async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    // Trouver un article dans la BDD selon l'id
    const foundArticle = await Article.findOne({ id : idParam});

    // Si je trouve pas d'article
    if (!foundArticle){
        return helpers.performReponseAPI(response, "702", `Impossible de récupérer un article avec l'UID ${idParam}`, null);
    }

    // retourner l'article trouvé en json
    return helpers.performReponseAPI(response, "200", `Article récupéré avec succès`, foundArticle);
});

/**
 * Ajouter/modifier un article
 */
router.post('/save-article', middlewares.checkTokenMiddleware, async (request, response) => {
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
            return helpers.performReponseAPI(response, "701", `Impossible de modifier un article dont un autre article possède un titre similaire`, null);
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
        return helpers.performReponseAPI(response, "200", `Article modifié avec succès`, articleToUpdate);
    }
    // Sinon creation
    let articleToCreate = request.body;

    // Tester que le titre saisie n'existe pas en base
    const articleWithTitle = await Article.findOne({ title : articleToCreate.title });

    // erreur : si titre existant
    if (articleWithTitle){
        // retourner la réponse json
        return helpers.performReponseAPI(response, "701", `Impossible d'ajouter un article avec un titre déjà existant`, null);
    }

    // -- générer un id unique
    articleToCreate.id = uuidv4();

    // -- ajouter dans le tableau
    const createdArticle = await Article.create(articleToCreate);

    // retourner la réponse json
    return helpers.performReponseAPI(response, "200", `Article ajouté avec succès`, createdArticle);
});

/**
 * Supprimer un article
 */
router.delete('/article/:id', middlewares.checkTokenMiddleware, async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    // Trouver l'article à supprimer
    const articleToDelete = await Article.findOne({id : idParam});

    // Erreur : Pas d'article en base à supprimer
    if (!articleToDelete) {
        return helpers.performReponseAPI(response, "702", `Impossible de supprimer un article dont l'UID n'existe pas`, null);
    }

    // Supprimer un element/article dans la tableau à partir de l'index
    await articleToDelete.deleteOne();

    // retourner l'article trouvé en json
    return helpers.performReponseAPI(response, "200", `L'article ${idParam} a été supprimé avec succès`, articleToDelete);
});

// exporter le router
module.exports = router;