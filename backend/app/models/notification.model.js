const mongoose = require('mongoose');
const Notification = new  mongoose.Schema({
    voucher:
        {
            voucher: {type: mongoose.Schema.Types.ObjectId, ref: 'Voucher'},
            code: {type: String},
            startDate: {type: Date},
            endDate: {type: Date},
            discountType: {type: String},
            discountValue: {type: Number}
        },
    product: 
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            name: {type: String}
        },
    status_order:
        {
            status: {type: String},
            order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
            uid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        }   
   

}, {
  timestamps: true,
});


module.exports = mongoose.model('Notification', Notification);