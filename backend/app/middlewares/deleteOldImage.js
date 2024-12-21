const mongoose = require('mongoose');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const cloudinary = require('cloudinary').v2;

const deleteOldImage = async (req, res, next) => {
  const { cid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Category ID',
    });
  }

  try {
    // Kiểm tra xem có ảnh mới được tải lên hay không
    if (req.file) {
      const currentCategory = await Category.findById(cid);
      console.log('Current Category:', currentCategory);

      // Nếu danh mục hiện tại có ảnh cũ thì xóa ảnh cũ trên Cloudinary
      if (currentCategory && currentCategory.image) {
        console.log('Deleting old image with public_id:', currentCategory.image.public_id);
        const result = await cloudinary.uploader.destroy(currentCategory.image.public_id);
        console.log('Old image deleted from Cloudinary:', result);
      }
    }

    next();
  } catch (error) {
    console.error('Error in deleteOldImage middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the old image',
      error: error.message,
    });
  }
};

const deleteOldAvatar = async (req, res, next) => {
  const { uid } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid User ID',
    });
  }

  try {
    // Kiểm tra xem có ảnh mới được tải lên hay không
    if (req.file) {
      const currentUser = await User.findById(uid);
      console.log('Current User:', currentUser);
      
      // Nếu người dùng hiện tại có avatar thì xóa avatar cũ
      if (currentUser && currentUser.avatar) {
        console.log('Deleting old image with public_id:', currentUser.avatar.public_id);
        const result = await cloudinary.uploader.destroy(currentUser.avatar.public_id);
        console.log('Old image deleted from Cloudinary:', result);
      }
    }

    next();
  } catch (error) {
    console.error('Error in deleteOldAvatar middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the old avatar',
      error: error.message,
    });
  }
};
const deleteOldImageProduct = async (req, res, next) => {
  const { cid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID',
    });
  }

  try {
    // Kiểm tra xem có ảnh mới được tải lên hay không
    if (req.file) {
      const currentProduct = await Product.findById(cid);
      console.log('Current Product:', currentProduct);

      // Nếu sản phẩm hiện tại có ảnh thumb cũ thì xóa ảnh cũ trên Cloudinary
      if (currentProduct && currentProduct.thumb) {
        console.log('Deleting old image with public_id:', currentProduct.thumb.public_id);
        const result = await cloudinary.uploader.destroy(currentProduct.thumb.public_id);
        console.log('Old image deleted from Cloudinary:', result);
      }
    }

    next();
  } catch (error) {
    console.error('Error in deleteOldImageProduct middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the old image',
      error: error.message,
    });
  }
};


module.exports = { deleteOldImage, deleteOldImageProduct, deleteOldAvatar };
