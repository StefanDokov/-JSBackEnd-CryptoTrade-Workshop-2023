const mongoose = require('mongoose');



const cryptoSchema = new mongoose.Schema({
   name : {
     type: String,
     required: true,
     minLength: 2,
   },
   imageUrl: {
    type: String,
    required: true,
    validate: /^https?:\/\//,
   },
   price: {
    type: Number,
    required: true,
    min: 0,
   },
   description: {
    type: String,
    required: true,
    minLength: 10,
   },
   payMethod: {
    type: String,
    enum: {
        values: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'], 
        message: 'Invalid wallet!'},
    required:true
   },
   owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
   },
   buyers: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
   }],



});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;