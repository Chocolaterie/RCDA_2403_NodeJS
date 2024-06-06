const mongoose = require('mongoose');

// Model Tag
const Tag = mongoose.model('Tag', { id: String, label : String }, 'tags');

module.exports = Tag;