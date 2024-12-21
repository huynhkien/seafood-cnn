const { query } = require('express');
const Supplier = require('../models/supplier.model');
const asyncHandler = require('express-async-handler');

const createSupplier = asyncHandler(async (req, res) => {
    const { name, phone, email, address, status } = req.body;
    
    if (!name || !phone || !email || !address) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
      }
    const response = await Supplier.create(req.body);
      return res.status(200).json({
        success: response ? true : false,
        message: response ? 'Thêm thành công' : 'Thêm thất bại',
      });
  });
const getSupplier = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await Supplier.findById(sid);
    return res.status(200).json({
        success: response ? true : false,
        data: response
    });
});
const getSuppliers = asyncHandler(async(req, res) => {
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
    let queryCommand = Supplier.find(formatQueries);

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
    const counts = await Supplier.countDocuments(formatQueries);
    return res.status(200).json({
        success: queryExecute.length > 0,
        data: queryExecute,
        counts
    });
})
const updateSupplier = asyncHandler(async (req, res) => {
    const { sid } = req.params;
    const response = await Supplier.findByIdAndUpdate(sid, req.body, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Cập nhật thành công' : 'Cập nhật thất bại'
      });
  });
const deleteSupplier = asyncHandler(async(req, res) => {
    const {sid} = req.params;
    const response = await Supplier.findByIdAndDelete(sid);
    return res.status(200).json({
        success: response? true : false,
        message: response ? 'Xóa thành công' : 'Xóa thất bại'
    });
});


  

module.exports = {
    createSupplier,
    getSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
}
