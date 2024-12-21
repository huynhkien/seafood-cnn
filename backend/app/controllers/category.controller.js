const { query } = require('express');
const Category = require('../models/category.model');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : null;
        if (!name || !description) {
      res.status(400);
      throw new Error('Thiếu thông tin');
    }    
    if (image) req.body.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
      const newCategory = await Category.create(req.body);
      return res.status(200).json({
        success: newCategory ? true : false,
        mes: newCategory ? 'Thêm thành công' : 'Thêm thất bại',
      });
  });
const getCategory = asyncHandler(async(req, res) => {
    const {cid} = req.params;
    const getCategory = await Category.findById(cid);
    return res.status(200).json({
        success: getCategory ? true : false,
        data: getCategory
    });
});
const getCategories = asyncHandler(async(req, res) => {
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
        formatQueries.name = {$regex: queries.q, $options: 'i'}
    }
    let queryCommand = Category.find(formatQueries);

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
    const counts = await Category.countDocuments(formatQueries);
    return res.status(200).json({
        success: queryExecute.length > 0,
        data: queryExecute,
        counts
    });
})
const updateCategory = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const image = req.file ? req.file.path : null;    
    if (image) req.body.image = {
      url: req.file.path,
      public_id: req.file.filename, 
    };
    const response = await Category.findByIdAndUpdate(cid, req.body, { new: true });
        return res.status(200).json({
            success: true,
            message: response ? 'Cập nhật thành công' : 'Cập nhật không thành công'
      });
  });
const deleteCategory = asyncHandler(async(req, res) => {
    const {cid} = req.params;
    const deleteCategory = await Category.findByIdAndDelete(cid);
    return res.status(200).json({
        success: deleteCategory? true : false,
        message: deleteCategory ? 'Xóa thành công' : 'Xóa thất bại!'
    });
});
const getCategoryNameBySlug = asyncHandler(async(req, res) => {
  const {slug} = req.params;
  const response = await Category.findOne({slug});
  return res.status(200).json({
    success: response ? true : false,
    data: response
  })
})

  

module.exports = {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategoryNameBySlug
}
