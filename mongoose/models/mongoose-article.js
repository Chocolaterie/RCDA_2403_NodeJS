const mongoose = require('mongoose');

// Model Article
const Article = mongoose.model('Article', { 
    id: String, 
    title : String, 
    content : String, 
    author : String,
    category : { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
 }, 
    'articles');

module.exports = Article;