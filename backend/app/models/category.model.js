const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const Category = new  mongoose.Schema({
    name: { type: String, unique: true, required: true, index: true},
    slug: {type: String, slug:'name', unique: true},
    description: {type: String, required: true},
    image: {
      url: String,
      public_id: String,
    },
   

}, {
  timestamps: true,
});
//Add plugins
mongoose.plugin(slug);

module.exports = mongoose.model('Category', Category);