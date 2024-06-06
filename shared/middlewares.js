const jwt = require('jsonwebtoken');
const helpers = require('./helpers');

const JWT_SECRET = "chocolatine";

module.exports = {

    // ----------------------------------------------------------
    // * Middleware
    // ----------------------------------------------------------
    checkTokenMiddleware : async (request, response, next) => {
        /* #swagger.security = [{
                "bearerAuth": []
        }] */

        console.log(request.headers.authorization)

        // si pas de token envoyé (erreur)
        if (!request.headers.authorization){
            return helpers.performReponseAPI(response, "798", "Token obligatoire");
        }

        // extraire le token (qui est bearer)
        const token = request.headers.authorization.substring(7);

        // verifier la validité
        let result = null;

        try {
            result = await jwt.verify(token, JWT_SECRET);
        } catch (e) {}

        if(!result){
            return helpers.performReponseAPI(response, "799", "Token invalide ou expiré");
        }

        // on passe le middleware/on passe le mur
        return next();
    }
};