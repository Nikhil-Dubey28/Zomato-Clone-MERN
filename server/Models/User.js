const mongoose = require('mongoose');
const Address = require('./Address'); // Importing the Address model

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }], // Reference to Address model
  favoriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  // Add more fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
