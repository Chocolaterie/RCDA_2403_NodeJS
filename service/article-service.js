const Article = require('../mongoose/models/mongoose-article');
const helpers = require('../shared/helpers');
const { v4: uuidv4 } = require('uuid');

module.exports = {

    getAll: async () => {
        // récupérer les articles en base
        const articles = await Article.find();

        return helpers.performServiceReponseAPI("200", `La liste des articles a été récupérés avec succès`, articles)
    },

    getById: async (idParam) => {
        // Trouver un article dans la BDD selon l'id
        const foundArticle = await Article.findOne({ id: idParam });

        // Si je trouve pas d'article
        if (!foundArticle) {
            return helpers.performServiceReponseAPI("702", `Impossible de récupérer un article avec l'UID ${idParam}`, null);
        }

        // retourner l'article trouvé en json
        return helpers.performServiceReponseAPI("200", `Article récupéré avec succès`, foundArticle);
    },

    save: async (id, article) => {
        // Si id renseigné
        if (id) {
            // Si edition

            // -- Recupérer l'id dans l'url
            const idParam = id;

            // Tester que le titre saisie n'existe pas en base
            const articleWithTitle = await Article.findOne({ id: { $ne: idParam }, title: article.title });

            // erreur : si titre existant
            if (articleWithTitle) {
                // retourner la réponse json
                return helpers.performServiceReponseAPI("701", `Impossible de modifier un article dont un autre article possède un titre similaire`, null);
            }

            // Récupérer l'article à modifier
            let articleToUpdate = await Article.findOne({ id: idParam });

            // modifier les valeurs (adresse mémoire donc pas besoin de modifier le tableau)
            articleToUpdate.title = article.title;
            articleToUpdate.content = article.content;
            articleToUpdate.author = article.author;

            // sauvegarder en base
            await articleToUpdate.save();

            // retourner la réponse json
            return helpers.performServiceReponseAPI("200", `Article modifié avec succès`, articleToUpdate);
        }
        // Sinon creation
        let articleToCreate = article;

        // Tester que le titre saisie n'existe pas en base
        const articleWithTitle = await Article.findOne({ title: articleToCreate.title });

        // erreur : si titre existant
        if (articleWithTitle) {
            // retourner la réponse json
            return helpers.performServiceReponseAPI("701", `Impossible d'ajouter un article avec un titre déjà existant`, null);
        }

        // -- générer un id unique
        articleToCreate.id = uuidv4();

        // -- ajouter dans le tableau
        const createdArticle = await Article.create(articleToCreate);

        // retourner la réponse json
        return helpers.performServiceReponseAPI("200", `Article ajouté avec succès`, createdArticle);
    },

    delete: async (idParam) => {

        // Trouver l'article à supprimer
        const articleToDelete = await Article.findOne({ id: idParam });

        // Erreur : Pas d'article en base à supprimer
        if (!articleToDelete) {
            return helpers.performServiceReponseAPI("702", `Impossible de supprimer un article dont l'UID n'existe pas`, null);
        }

        // Supprimer un element/article dans la tableau à partir de l'index
        await articleToDelete.deleteOne();

        // retourner l'article trouvé en json
        return helpers.performServiceReponseAPI("200", `L'article ${idParam} a été supprimé avec succès`, articleToDelete);
    }
};