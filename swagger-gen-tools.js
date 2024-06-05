const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

// La base de la doc (le nom de l'app, son url, son port)
const doc = {
    info : {
        title: 'TP Article',
        description : 'La documentation TP Article',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

// Le chemin ou sera générée ta documentation swagger
const outputFile = './swagger-output.json';

// La liste des fichiers .js ou sont écrites mes routes (qu'il doit scanner)
const endpointFiles = ['./app.js'];

// générer la doc
/**
 * 1 : Ou est stocké la doc
 * 2 : La liste des fichiers à scanner pour la génération
 * 3 : La base de la définition de votre swagger (le nom du site, le port, etc)
 */
swaggerAutogen(outputFile, endpointFiles, doc);