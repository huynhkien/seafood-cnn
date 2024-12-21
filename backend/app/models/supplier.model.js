const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, 
  phone: { type: String, required: true }, 
  email: { type: String, required: true }, 
  address: {type: String, required: true},
  status: { type: String, required: true}, 
}, {
  timestamps: true, 
});

// Export model
module.exports = mongoose.model('Supplier', SupplierSchema);
