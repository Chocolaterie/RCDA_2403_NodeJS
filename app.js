// import express
const express = require('express');

// instancier le serveur
const app = express();

// pour autoriser l'envoie des données dans le body 
app.use(express.json());

// Simulation de données en mémoire
let DB_ARTICLES = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];

// Routes
app.get('/articles', (request, response) => {
    return response.json(DB_ARTICLES);
});

app.get('/article/:id', (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = parseInt(request.params.id);

    // Trouver un article dans la liste des articles selon l'id
    const foundArticle = DB_ARTICLES.find(article => article.id === idParam);

    // retourner l'article trouvé en json
    return response.json(foundArticle);
});

/**
 * Ajouter/modifier un article
 */
app.post('/save-article', (request, response) => {
    // Si id renseigné
    if (request.body.id){
        // Si edition

        // -- Recupérer l'id dans l'url
        const idParam = parseInt(request.body.id);

        // Récupérer l'article à modifier
        let articleToUpdate = DB_ARTICLES.find(article => article.id === idParam);

        // modifier les valeurs (adresse mémoire donc pas besoin de modifier le tableau)
        articleToUpdate.title = request.body.title;
        articleToUpdate.content = request.body.content;
        articleToUpdate.author = request.body.author;

        // retourner la réponse json
        return response.json(`L'article a été modifié avec succès`);
    }
    // Sinon creation
    let articleToCreate = request.body;

    // -- simuler auto increment
    articleToCreate.id = DB_ARTICLES.length + 1;

    // -- ajouter dans le tableau
    DB_ARTICLES.push(articleToCreate);

    // retourner la réponse json
    return response.json(`L'article a été ajouté avec succès`);
});

/**
 * Supprimer un article
 */
app.delete('/article/:id', (request, response) => {
    // Recupérer l'id dans l'url
    const idParam = parseInt(request.params.id);

    // Trouver l'index de l'article à supprimer
    const indexToDelete = DB_ARTICLES.findIndex(article => article.id === idParam);

    // Erreur : Pas d'article en base à supprimer
    if (indexToDelete < 0 ){
        return response.json(`Article non trouvé`);
    }

    // Supprimer un element/article dans la tableau à partir de l'index
    DB_ARTICLES.splice(indexToDelete, 1);

    // retourner l'article trouvé en json
    return response.json(`L'article ${idParam} a été supprimé avec succès !`);
});

// Lancer l'application serveur dans un port
app.listen(3000, () => {
    console.log(`Le serveur a démarré avec succès`);
});
