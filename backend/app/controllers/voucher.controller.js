const { query } = require('express');
const Voucher = require('../models/voucher.model');
const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

const createVoucher = asyncHandler(async (req, res) => {
    const response = await Voucher.create(req.body);
    if (response) {
      const io = req.app.get('io');

      io.emit('new_voucher_created', {
          success: true,
          message: 'Voucher mới đã được tạo',
          voucher: response
      });
    }

      return res.status(200).json({
        success: response ? true : false,
        message: response ? 'Thêm thành công' : 'Thêm thất bại',
      });
  });
const getVoucher = asyncHandler(async(req, res) => {
    const {vid} = req.params;
    const response = await Voucher.findById(vid);
    return res.status(200).json({
        success: response ? true : false,
        data: response
    });
});
const getVouchers = asyncHandler(async(req, res) => {
    const queries = {...req.query};
  // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el])

    // Định dạng lại các operatirs cho đúng cú pháp của moogose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const  formatQueries = JSON.parse(queryString);

    // Filtering 
    if(queries?.q) {
        delete formatQueries.q;
        formatQueries.applyType = {$regex: queries.q, $options: 'i'}
    }
    let queryCommand = Voucher.find(formatQueries);

    //sorting
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }
    // Field Limiting
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    //
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);
 
    // Execute  \query
    const queryExecute = await queryCommand.exec();
    const counts = await Voucher.countDocuments(formatQueries);
    return res.status(200).json({
        success: queryExecute.length > 0,
        data: queryExecute,
        counts
    });
})
const updateVoucherProductId = asyncHandler(async (req, res) => {
    const { vid, _id } = req.params;
    
    try {
      const voucher = await Voucher.findById(vid);
      
      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy'
        });
      }
  
      const voucherIndex = voucher?.applicableProducts?.findIndex((el) => el._id.toString() === _id);
      console.log(voucherIndex)
      
      if (voucherIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy'
        });
      }
  
      
      const updatedProduct = {
        ...voucher.applicableProducts[voucherIndex].toObject(),
        ...req.body 
      };
      voucher.applicableProducts[voucherIndex] = updatedProduct;
  
      const updatedVoucher = await voucher.save();
  
      if (updatedVoucher) {
        return res.status(200).json({
          success: true,
          message: 'Cập nhật thành công',
        });
      } else {
        throw new Error('Failed to save updated receipt');
      }
    } catch (error) {
      console.error('Error updating receipt product:', error);

      return res.status(500).json({
        success: false,
        message: 'Lỗi xảy ra khi cập nhật sản phẩm',
      });
    }
  });
  const updateVoucherItems = asyncHandler(async (req, res) => {
    const { vid } = req.params; 
    const { applicableProducts, applicableCategories, applicableUsers, ...data } = req.body;
    console.log(data?.applyType)
    try {
      const voucher = await Voucher.findById(vid);
      
      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Voucher không tồn tại',
        });
      }
  
      if (data.applyType === 'products' && applicableProducts) {
        if (voucher.applicableCategories.length > 0 || voucher.applicableUsers.length > 0) {
          await Voucher.findByIdAndUpdate(vid, {
            $set: { applicableCategories: [], applicableUsers: [] }
          });
        }
        await Voucher.findByIdAndUpdate(
          vid,
          { $push: { applicableProducts: { $each: applicableProducts } } }
        );
      } else if (data.applyType === 'categories' && applicableCategories) {
          if (voucher.applicableProducts.length > 0 || voucher.applicableUsers.length > 0) {
            await Voucher.findByIdAndUpdate(vid, {
              $set: { applicableProducts: [], applicableUsers: [] }
            });
          }
          await Voucher.findByIdAndUpdate(
            vid,
            { $push: { applicableCategories: { $each: applicableCategories } } }
          );
      } else if (data.applyType === 'users' && applicableUsers) {
          if (voucher.applicableProducts.length > 0 || voucher.applicableCategories.length > 0) {
            await Voucher.findByIdAndUpdate(vid, {
              $set: { applicableProducts: [], applicableCategories: [] }
            });
          }
          await Voucher.findByIdAndUpdate(
            vid,
            { $push: { applicableUsers: { $each: applicableUsers } } }
          );
      }
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        vid,
        { $set: data },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        data: updatedVoucher,
      });
    } catch (error) {
      console.error('Error updating voucher:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi xảy ra khi cập nhật voucher',
        error: error.message,
      });
    }
  });
  

const deleteVoucherProduct = asyncHandler(async (req, res) => {
    const { vid, _id } = req.params;
    console.log(vid);
    console.log(_id)
  
    try {
      const voucher = await Voucher.findById(vid);
  
      const productIndex = voucher?.applicableProducts?.findIndex((el) => el._id.toString() === _id);
      console.log(productIndex)
  
      if (productIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy product'
        });
      }
      // Xóa
      voucher.applicableProducts.splice(productIndex, 1);
      
  
      const updatedVoucher = await voucher.save();
  
      if ( updatedVoucher) {
        return res.status(200).json({
          success: true,
          message: 'Xóa sản phẩm thành công',
        });
      } else {
        throw new Error('Lỗi');
      }
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi xảy ra khi xóa sản phẩm',
      });
    }
});
const deleteVoucherCategories = asyncHandler(async (req, res) => {
    const { vid, _id } = req.params;
  
    try {
      const voucher = await Voucher.findById(vid);
  
      const categoryIndex = voucher?.applicableCategories?.findIndex((el) => el._id.toString() === _id);
  
      if (categoryIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy danh mục'
        });
      }
      // Xóa
      voucher.applicableCategories.splice(categoryIndex, 1);
      
  
      const updatedVoucher = await voucher.save();
  
      if ( updatedVoucher) {
        return res.status(200).json({
          success: true,
          message: 'Xóa danh mục thành công',
        });
      } else {
        throw new Error('Lỗi');
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi xảy ra khi xóa danh mục',
      });
    }
});
const deleteVoucherUsers = asyncHandler(async (req, res) => {
    const { vid, _id } = req.params;
  
    try {
      const voucher = await Voucher.findById(vid);
  
      const userIndex = voucher?.applicableUsers?.findIndex((el) => el._id.toString() === _id);
  
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy'
        });
      }
      // Xóa
      voucher.applicableUsers?.splice(userIndex, 1);
      
  
      const updatedVoucher = await voucher.save();
  
      if ( updatedVoucher) {
        return res.status(200).json({
          success: true,
          message: 'Xóa sản thành công',
        });
      } else {
        throw new Error('Lỗi');
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: 'Lỗi xảy ra khi xóa',
      });
    }
});
const deleteVoucher = asyncHandler(async(req, res) => {
    const {vid} = req.params;
    const response = await Voucher.findByIdAndDelete(vid);
    return res.status(200).json({
        success: response? true : false,
        message: response ? 'Xóa thành công' : 'Xóa thất bại'
    });
});

module.exports = {
    createVoucher,
    getVoucher,
    getVouchers,
    updateVoucherProductId,
    updateVoucherItems,
    deleteVoucherProduct,
    deleteVoucherCategories,
    deleteVoucherUsers,
    deleteVoucher
   
}
