const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  addressList: [{
    addressLine: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    userNumber: {
      type: String,
      required: true
    }
  }],
});
const Address = mongoose.model('address', addressSchema);
module.exports = Address;