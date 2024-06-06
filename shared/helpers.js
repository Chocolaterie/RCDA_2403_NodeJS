const logger = require('./logger');

module.exports = {
    /**
     * Réponse métier refactorisé
     * @param {*} response 
     * @param {*} code 
     * @param {*} message 
     * @param {*} data 
     * @returns 
     */
    performReponseAPI : (response, code, message, data) => {
        
        // Ancienne version
        //console.log(`code : ${code} | message : ${message}`);
        
        // Nouvelle version
        logger.info(`code : ${code} | message : ${message}`);
        
        return response.json({ 
            code : code,
            message : message,
            data : data
        });
    }
};