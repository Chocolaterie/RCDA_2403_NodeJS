const express = require('express');
const router = express.Router();
const middlewares = require('../../shared/middlewares');
const articleService = require('../../service/article-service');

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

router.post('/save', middlewares.checkTokenMiddleware, async (request, response) => {

    const responseService = await articleService.save(request.body.id, request.body);
    
    return response.json(responseService);

});

router.delete('/delete/:id', middlewares.checkTokenMiddleware, async (request, response) => {
    const responseService = await articleService.delete(request.params.id);
    
    return response.json(responseService);
});

// Exporter la route v2 article
module.exports = router;