const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Mã voucher là bắt buộc'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'], 
    required: [true, 'Loại giảm giá là bắt buộc'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Giá trị giảm giá là bắt buộc'], 
  },
  minPurchaseAmount: {
    type: Number,
    default: 0, 
  },
  maxDiscount: {
    type: Number,
    default: null, 
  },
  startDate: {
    type: Date,
    required: [true, 'Ngày bắt đầu là bắt buộc'],
  },
  endDate: {
    type: Date,
    required: [true, 'Ngày hết hạn là bắt buộc'],
  },
  usageLimit: {
    type: Number,
    default: null, 
  },
  usedCount: {
    type: Number,
    default: 0, 
  },
  userUsageLimit: {
    type: Number,
    default: 1, 
  },
  applyType: {
    type: String,
    enum: ['all', 'categories', 'products', 'users'], 
    required: [true, 'Loại áp dụng là bắt buộc'],
    default: 'all' 
  },
  applicableProducts: [{
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: {type: String},
  }],
  applicableCategories: [{
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    name: {type: String}
  }],
  applicableUsers: [{
    name: {type: String}
  }],
  isShow: {
    type: Boolean,
    default: true, 
  }, 
},
{
    timestamps: true, 
  });
  voucherSchema.pre('save', function(next) {
    const now = new Date();
    if (this.endDate < now) {
      this.isShow = false;
    }
    next();
  });

module.exports = mongoose.model('Voucher', voucherSchema);

