const logger = require('./logger');

module.exports = {

    performServiceReponseAPI: (code, message, data) => {

        // Nouvelle version
        logger.info(`code : ${code} | message : ${message}`);

        return {
            code: code,
            message: message,
            data: data
        };
    },

    /**
     * Réponse métier refactorisé
     * @param {*} response 
     * @param {*} code 
     * @param {*} message 
     * @param {*} data 
     * @returns 
     */
    performReponseAPI: (response, code, message, data) => {

        return response.json(module.exports.performServiceReponseAPI(code, message, data));
    }
};