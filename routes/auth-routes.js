const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../mongoose/models/mongoose-user');
const helpers = require('../shared/helpers');

const JWT_SECRET = "chocolatine";

router.post('/auth', async (request, response) => {
    /* 
        #swagger.summary = 'Url de connexion'
        #swagger.description = "Se connecter à l'aide d'un email et mot de passe pour avoir un token"
    */

    // Tester que le couple email/password existe
    const loggingRequest = request.body;

    const loggedUser = await User.findOne({ email: loggingRequest.email, password : loggingRequest.password });

    // Si erreur 
    if (!loggedUser){
        return helpers.performReponseAPI(response, '703', `Couple email/mot de passe incorrect`, null);
    }

    // generer un token
    const token = jwt.sign({ email : loggedUser.email }, JWT_SECRET, { expiresIn : '1h' });

    // retourne la réponse avec le token
    return helpers.performReponseAPI(response, '203', `Authentifié(e) avec succès`, token);
});

module.exports = router;