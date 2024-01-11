const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressTitle: { type: String, required: true, unique:'true' },
  flat: { type: String, required: true },
  area: { type: String }, 
  landmark: { type: String}, 
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: {type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Other address-related fields
});


const Address = mongoose.model('Address', addressSchema);

module.exports = Address;

