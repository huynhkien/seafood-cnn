const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String },
  sku: {type: String},
  origin: { type: String },
  status: { type: String },
  specifications: { type: String },
  variant: { type: String },
  sold: { type: Number, default: 0 },
  thumb: {
    url: String,
    public_id: String
  },
  disCount: {
    value: {type: Number},
    discountType: {
      type: String,
    },
    start_date: {type: Date},
    end_date: {type: Date},
    isValid: { type: Boolean, default: true }
  },
  images: [
    {
      url: String,
    }
  ],
  type: {type: String, require: true},
  price: { type: Number, required: true },
  slug: { type: String, slug: 'name', unique: true },
  ratings: [
    {
      star: { type: Number },
      postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
      postedByName: { type: String },
      comment: { type: String },
      likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }], 
      replies: [{
        comment: {type: String},
        postedBy: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
        postedByName: {type: String},
        parentCommentId: { type: String}, 
        createdAt: { type: Date, default: Date.now },
      }],
      updatedAt: { type: Date }
    }
  ],
  totalRatings: { type: Number, default: 0 },
  variants: [
    {
      sku: String,
      variant: String,
      price: Number,
      thumb: {
        url: String,
        public_id: String
      },
    }
  ],
}, {
  timestamps: true,
});

// Add plugins
mongoose.plugin(slug);
ProductSchema.plugin(mongooseDelete, { 
  deletedAt: true,
  overrideMethods: 'all',
});
ProductSchema.virtual('categoryName', {
  ref: 'Category', 
  localField: 'category',
  foreignField: '_id',
  justOne: true
});
ProductSchema.pre('save', function(next) {
  const now = new Date();
  if (this.disCount && this.disCount.end_date) {
      this.disCount.isValid = this.disCount.end_date > now;
  }
  next();
});
ProductSchema.pre('save', function(next) {
  if (this.disCount && this.disCount.end_date) {
    const now = new Date();
    this.disCount.isValid = (
      now >= this.disCount.start_date && 
      now <= this.disCount.end_date
    );
  } else {
    this.disCount.isValid = false;
  }
  next();
});
module.exports = mongoose.model('Product', ProductSchema);
