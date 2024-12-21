const mongoose = require('mongoose');

const Order = new  mongoose.Schema({
    products:[{
        product: {type: mongoose.Types.ObjectId, ref: 'Product'},
        quantity: Number,
        variant: String, 
        thumb: String,
        name: String,
        price: Number
    }] ,
    status: {
        type: String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Delivering', 'Succeed', 'Confirm']
    },
    applyVoucher: {type: mongoose.Types.ObjectId, ref: 'Voucher'},
    total: {type: Number},
    orderBy: {
        type:mongoose.Types.ObjectId, ref: 'user'
    },
    location: {
        lat: Number,
        lng: Number,
    }
    
}, {
  timestamps: true,
});


//Add plugins

module.exports = mongoose.model('Order', Order);