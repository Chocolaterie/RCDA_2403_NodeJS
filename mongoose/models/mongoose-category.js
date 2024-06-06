const mongoose = require('mongoose');

// Model Category
const Category = mongoose.model('Category', { id: String, label : String }, 'categories');

module.exports = Category;