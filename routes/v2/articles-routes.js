const express = require('express');
const router = express.Router();
const middlewares = require('../../shared/middlewares');
const articleService = require('../../service/article-service');
const Article = require('../../mongoose/models/mongoose-article');
const Category = require('../../mongoose/models/mongoose-category');
const Tag = require('../../mongoose/models/mongoose-tag');

router.get('/all', async (request, response) => {

    const responseService = await articleService.getAll();

    return response.json(responseService);
});

router.get('/get/:id', async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    const responseService = await articleService.getById(idParam);
    
    return response.json(responseService);
});

/**
 * Ajouter/modifier un article
 */
router.post('/save', middlewares.checkTokenMiddleware, async (request, response) => {

    const responseService = await articleService.save(request.body.id, request.body);
    
    return response.json(responseService);

});

/**
 * Supprimer un article
 */
router.delete('/delete/:id', middlewares.checkTokenMiddleware, async (request, response) => {
    const responseService = await articleService.delete(request.params.id);
    
    return response.json(responseService);
});

/**
 * Associer une category dans un article
 */
router.post('/set-category', async (request, response) => {
    // Find d'une category
    const category = await Category.findOne({ id : request.body.idCategory });

    // Find d'un article
    const article = await Article.findOne({ id : request.body.idArticle });

    // Associer la category à l'article
    article.category = category;

    // save
    await article.save();

    return response.json(article);

});

/**
 * Associer des tags dans un article
 */
router.post('/set-tags', async (request, response) => {
    // Find des tags
    // Select all de tout les tags qui ont un id dans une liste ids
    const tags = await Tag.find({ id : { $in : request.body.tagIds } });

    // Find d'un article
    const article = await Article.findOne({ id : request.body.idArticle });

    // Associer des tags dans l'article
    article.tags.push(...tags);

    // save
    await article.save();

    return response.json(article);

});

// Exporter la route v2 article
module.exports = router;