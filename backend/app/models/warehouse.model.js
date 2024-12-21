const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
  handledBy: { type: String, required: true }, 
  products: [{
      product: { type: String},
      thumb: {
        url: String,
        public_id: String
      },
      name: {type: String},
      variant: {type: String},
      price: { type: Number},
      quantity: { 
        type: Number, 
      },
      totalPrice: { type: Number},
      
  }],
  supplier: { type: String},
  type: { type: String },
  total: {type: Number},
  exportedTo: {
    name: { type: String }, 
    address: { type: String}, 
    phone: { type: String }, 
    email: { type: String } 
  },
}, {
  timestamps: true, 
});
// Export model
module.exports = mongoose.model('Warehouse', WarehouseSchema);
