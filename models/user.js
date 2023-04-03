const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	
username: String,
shopping_cart: Array

});

const User = mongoose.model('User', userSchema);

module.exports = User;