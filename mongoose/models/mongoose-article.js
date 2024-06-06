const mongoose = require('mongoose');

// Model Article
const Article = mongoose.model('Article', { id: String, title : String, content : String, author : String }, 'articles');

module.exports = Article;