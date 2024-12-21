const { query } = require('express');
const WaveHouse = require('../models/warehouse.model');
const asyncHandler = require('express-async-handler');

const createReceiptImport = asyncHandler(async (req, res) => {
  try {
    if (req.body?.type === 'Phiếu xuất') {
      // Kiểm tra tồn kho trước khi xử lý
      for (const item of req.body?.products) {
        const warehouse = await WaveHouse.findOne({
          "products": {
            $elemMatch: {
              "product": item.product,
              "variant": item.variant,
              "quantity": { $gte: item.quantity }
            }
          },
          "type": 'Phiếu nhập'
        });

        if (!warehouse) {
          return res.status(400).json({
            success: false,
            message: `Sản phẩm ${item.name || 'không xác định'} không đủ số lượng trong kho hoặc không tìm thấy.`
          });
        }
      }

      // Tạo phiếu xuất
      const exportReceipt = await WaveHouse.create(req.body);

      // Cập nhật số lượng trong kho
      for (const item of req.body?.products) {
        await WaveHouse.findOneAndUpdate(
          {
            "type": 'Phiếu nhập',
            "products": {
              $elemMatch: {
                "product": item.product,
                "variant": item.variant
              }
            }
          },
          {
            $inc: {
              "products.$.quantity": -item.quantity
            }
          },
          { new: true }
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Tạo phiếu xuất thành công',
        data: exportReceipt
      });
    } else {
      // Xử lý phiếu nhập
      const importReceipt = await WaveHouse.create(req.body);
      return res.status(200).json({
        success: true,
        message: 'Tạo phiếu nhập thành công',
        data: importReceipt
      });
    }
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra trong quá trình thêm dữ liệu.',
      error: error.message
    });
  }
});
const getReceipt = asyncHandler(async(req, res) => {
    const {rid} = req.params;
    const response = await WaveHouse.findById(rid);
    return res.status(200).json({
        success: response ? true : false,
        data: response
    });
});
const getReceipts = asyncHandler(async(req, res) => {
    const queries = {...req.query};
  // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el])

    // Định dạng lại các operatirs cho đúng cú pháp của moogose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formatQueries = JSON.parse(queryString);

    // Filtering 
    if(queries?.q) {
        delete formatQueries.q;
        formatQueries.name = {$regex: queries.q, $options: 'i'}
    }
    let queryCommand = WaveHouse.find(formatQueries);

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
 
    // Execute  
    const queryExecute = await queryCommand.exec();
    const counts = await WaveHouse.countDocuments(formatQueries);
    return res.status(200).json({
        success: queryExecute.length > 0,
        data: queryExecute,
        counts
    });
})
const updateReceiptProductId = asyncHandler(async (req, res) => {
  const { rid, _id } = req.params;
  
  try {
    const receipt = await WaveHouse.findById(rid);
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy'
      });
    }

    const productIndex = receipt?.products?.findIndex((el) => el._id.toString() === _id);
    console.log(productIndex)
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tìm thấy trong phiếu'
      });
    }
    // Số lượng cũ của sản phẩm
    const oldQuantity = receipt.products[productIndex]?.quantity || 0;

    
    const updatedProduct = {
      ...receipt.products[productIndex].toObject(),
      ...req.body 
    };
    // Tính sự thay đổi về số lượng
    const quantityDifference = updatedProduct.quantity - oldQuantity;

    receipt.products[productIndex] = updatedProduct;

    const updatedReceipt = await receipt.save();
    if(receipt?.type === "Phiếu xuất"){
      await WaveHouse.findOneAndUpdate(
        {
          "type": "Phiếu nhập",
          "products": {
            $elemMatch: {
              "product": receipt.products[productIndex]?.product,
              "variant": receipt.products[productIndex]?.variant
            }
          }
        },
        {
          $inc: {
            "products.$.quantity": -quantityDifference 
          }
        },
        { new: true }
      );
    }else{
      await WaveHouse.findOneAndUpdate(
        {
          "products": {
            $elemMatch: {
              "product": receipt.products[productIndex]?.product,
              "variant": receipt.products[productIndex]?.variant
            }
          }
        },
        { new: true }
      );
    }
    

    if (updatedReceipt) {
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        data: updatedReceipt
      });
    } else {
      throw new Error('Lỗi khi cập nhật');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xảy ra khi cập nhật sản phẩm',
      error: error.message
    });
  }
});
const updateReceiptProducts= asyncHandler(async (req, res) => {
  const {rid} = req.params; 
  const {products, supplier, total, type, exportedTo } = req.body;
  
  try {
    const receipt = await WaveHouse.findById(rid);
    if(receipt?.type === 'Phiếu xuất' && type === 'Phiếu nhập'){
      await WaveHouse.findByIdAndUpdate(
          rid,
          { $unset: { exportedTo: "" } },
          { new: true }
        )
      }else if(receipt?.type === 'Phiếu nhập' && type === 'Phiếu xuất'){
        for (const item of products) {
          const warehouse = await WaveHouse.findOne({
            "products": {
              $elemMatch: {
                "product": item.product,
                "variant": item.variant,
                "quantity": { $gte: item.quantity }
              }
            },
            "type": 'Phiếu nhập'
          });
  
          if (!warehouse) {
            return res.status(400).json({
              success: false,
              message: `Sản phẩm ${item.name || 'không xác định'} không đủ số lượng trong kho hoặc không tìm thấy.`
            });
          }
        }
          await WaveHouse.findByIdAndUpdate(
            rid,
            { $set: { exportedTo: exportedTo } },
            { new: true }
          );
        }
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy'
      });
    }
    const updatedProducts = [...products];

    const updatedReceipt = await WaveHouse.findByIdAndUpdate(
      rid,
      {
          $push: {
              products: updatedProducts
          },
          $set: { 
            updatedAt: new Date(),
            supplier: supplier,
            type: type,
            total: total

           },
      },
      { new: true }
  );
  if(type === 'Phiếu xuất'){
    for (const item of products) {
      await WaveHouse.findOneAndUpdate(
        {
          "type": 'Phiếu nhập',
          "products": {
            $elemMatch: {
              "product": item.product,
              "variant": item.variant
            }
          }
        },
        {
          $inc: {
            "products.$.quantity": -item.quantity
          }
        },
        { new: true }
      );
    }
  }
 
  

    if (updatedReceipt) {
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        data: updatedReceipt
      });
    } else {
      throw new Error('Lỗi khi cập nhật');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xảy ra khi cập nhật sản phẩm',
      error: error.message
    });
  }
});
const updateReceiptInfo = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  console.log(rid)
  
  try {
    const receipt = await WaveHouse.findById(rid);
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy'
      });
    }
    if(receipt.type === 'Phiếu xuất'){
      const response = await WaveHouse.findByIdAndUpdate(
        rid,
        {exportedTo: req.body},
        {new: true}
      )
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công'
      })
    }else{
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thất bại'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xảy ra khi cập nhật',
      error: error.message
    });
  }
});
const deleteReceiptProductId = asyncHandler(async (req, res) => {
  const { rid, _id } = req.params;

  try {
    const receipt = await WaveHouse.findById(rid);

    const productIndex = receipt?.products?.findIndex((el) => el._id.toString() === _id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    // Xóa
    receipt.products.splice(productIndex, 1);
    // Cập nhật lại tổng giá
    receipt.total = receipt?.products?.reduce((acc, item) => acc + (item?.totalPrice || 0), 0)

    const updatedReceipt = await receipt.save();

    if (updatedReceipt) {
      return res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm thành công',
        data: updatedReceipt
      });
    } else {
      throw new Error('Lỗi');
    }
  } catch (error) {
    console.error('Lỗi xóa biên nhận sản phẩm:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xảy ra khi xóa sản phẩm',
      error: error.message
    });
  }
});

const updateReceipt = asyncHandler(async (req, res) => {
    const { rid } = req.params;
    const { products, type, handledBy, exportedTo, total } = req.body;
    try {
      const receiptData = { products, type, handledBy, total};
      if (type === 'export') {
        receiptData.exportedTo = exportedTo;
      }
      const response = await WaveHouse.findByIdAndUpdate(rid, receiptData, {new: true});
      
      return res.status(200).json({
        success: true,
        message: response ? 'Cập nhật phiếu thành công' : 'Cập nhật phiếu thất bại',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình cập nhật dữ liệu.', error: error.message });
    } 
});
const deleteReceipt = asyncHandler(async(req, res) => {
    const {rid} = req.params;
    const response = await WaveHouse.findByIdAndDelete(rid);
    return res.status(200).json({
        success: response? true : false,
        message: response ? 'Xóa thành công' : 'Xóa thất bại'
    });
});


  

module.exports = {
    createReceiptImport,
    getReceipt,
    getReceipts,
    updateReceipt,
    updateReceiptProductId,
    deleteReceiptProductId,
    updateReceiptInfo,
    updateReceiptProducts,
    deleteReceipt
    
}
