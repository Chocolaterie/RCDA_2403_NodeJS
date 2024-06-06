const mongoose = require('mongoose');

// Model User
const User = mongoose.model('User', { email : String, password : String }, 'users');

module.exports = User;