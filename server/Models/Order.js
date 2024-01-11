const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: {type: Object},
  cart: [{
    foodItemName: { type: String },
    isVeg: { type: Boolean },
    quantity: { type: Number },
    price: { type: Number },
  },],
  total: { type: Number },
  date: { type: Date, default: Date.now },
  paymentMode: { type: String},
  status: {type: String},
  razorpayOrderId : {type: String},
  razorpayPaymentId : {type: String},
  razorpaySignatureId : {type: String},
  address: {type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
  
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
