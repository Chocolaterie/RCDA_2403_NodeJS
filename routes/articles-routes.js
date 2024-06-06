const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Article = require('../mongoose/models/mongoose-article');
const helpers = require('../shared/helpers');
const middlewares = require('../shared/middlewares');
const articleService = require('../service/article-service');

/** 
 * @deprecated Since version 2.0.0. Use `/v2/articles/all` instead.
*/
router.get('/articles', async (request, response) => {

    const responseService = await articleService.getAll();

    return response.json(responseService);
});

/** 
 * @deprecated Since version 2.0.0. Use `/v2/articles/get` instead.
*/
router.get('/article/:id', async (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = request.params.id;

    const responseService = await articleService.getById(idParam);

    return response.json(responseService);
});

/** 
 * @deprecated Since version 2.0.0. Use `/v2/articles/save` instead.
*/
router.post('/save-article', middlewares.checkTokenMiddleware, async (request, response) => {

    const responseService = await articleService.save(request.body.id, request.body);
    
    return response.json(responseService);
});


/** 
 * @deprecated Since version 2.0.0. Use `/v2/articles/delete` instead.
*/
router.delete('/article/:id', middlewares.checkTokenMiddleware, async (request, response) => {
    
    const responseService = await articleService.delete(request.params.id);
    
    return response.json(responseService);
    
});

// exporter le router
module.exports = router;