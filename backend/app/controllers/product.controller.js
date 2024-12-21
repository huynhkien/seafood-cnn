const { query } = require('express');
const Product = require('../models/product.model');
const WaveHouse = require('../models/warehouse.model');
const Voucher = require('../models/voucher.model');
const asyncHandler = require('express-async-handler');
makeSKU = require('uniqid');


const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, origin, status, specifications, variant, disCount} = req.body;

  const thumb = req.files && req.files.thumb && req.files.thumb[0] ? {
    url: req.files.thumb[0].path,
    public_id: req.files.thumb[0].filename
  } : null;

  const images = req.files && req.files.images ? req.files.images.map(el => ({
    url: el.path,
    public_id: el.filename
  })) : [];

  if (thumb) req.body.thumb = thumb;
  if (images.length) req.body.images = images;

  if (!(name && price && description && category && origin && status && specifications && variant)) {
    return res.status(400).json({ success: false, message: 'Missing inputs' });
  }
  const newProduct = await Product.create(req.body);
  if (newProduct) {
    const io = req.app.get('io');

    io.emit('new_product_created', {
        success: true,
        message: 'Sản phẩm mới đã được tạo',
        product: newProduct
    });
  }
  return res.status(200).json({
    success: !!newProduct,
    message: newProduct ? 'Thêm sản phẩm thành công' : 'Thêm sản phẩm thất bại'
  });
});
// delete discount
const deleteDiscount = asyncHandler(async(req, res) => {
  const { pid } = req.params;
  const response = await Product.findByIdAndUpdate(
    pid,
    { $unset: { disCount: "" } }
  );
  return res.status(200).json({
    success: true,
    message: response ? 'Xóa mã giảm giá thành công' : 'Gặp lỗi khi xóa'
  })
})
// add variant
const addVariant = asyncHandler(async(req, res) => {
  const { variant, price, } = req.body;
  const {pid} = req.params;
  const thumb = req.file ? {
    url: req.file.path,
    public_id: req.file.filename
  } : null;

  if (thumb) req.body.thumb = thumb;
  if (!(price && variant)) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin ' });
  }
  const addVariant = await Product.findByIdAndUpdate(
    pid,
    {
        $push: {
            variants: {
                sku: makeSKU().toUpperCase(),
                price,
                variant,
                thumb,
            },
        },
    },
    { new: true }
);
  return res.status(200).json({
    success: true,
    message: addVariant ? 'Thêm thành công' : 'Thêm thất bại!'
  });
  

});
const getVariantById = asyncHandler(async (req, res) => {
  const { pid, _id } = req.params;
  const product = await Product.findById(pid);
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  const variant = product.variants.find(variant => variant._id.toString() === _id);
  if (!variant) {
    return res.status(404).json({ message: 'Không tìm thấy biến thể' });
  }
  res.status(200).json({
    success: true,
    data: variant
  });
});

const updateVariantId = asyncHandler(async (req, res) => {
  const { pid, _id } = req.params;

  try {
    const product = await Product.findById(pid);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    const variantIndex = product?.variants?.findIndex((el) => el._id.toString() === _id);
    
    if (variantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể'
      });
    }

    // Kiểm tra req.body có dữ liệu cần cập nhật không
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    const updatedVariant = {
      ...product.variants[variantIndex].toObject(),
      ...req.body 
    };
    
    // Cập nhật biến thể
    product.variants[variantIndex] = updatedVariant;

    // Lưu sản phẩm
    const updatedProduct = await product.save();

    if (updatedProduct) {
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thành công',
        variant: updatedVariant
      });
    } else {
      throw new Error('Failed to save updated variant');
    }
  } catch (error) {
    console.error('Error updating variant:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Lỗi xảy ra khi cập nhật biến thể',
      error: error.message
    });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: 'ratings',
    populate: {
      path: 'postedBy',
      select: 'name'
    }
  });

  // Kiểm tra nếu không tìm thấy sản phẩm
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Lấy số lượng từ Warehouse cho các sản phẩm
  const warehouses = await WaveHouse.find({}); // Sửa `WaveHouse` thành `Warehouse`
  const quantityMap = {};

  // Tạo bản đồ số lượng cho từng biến thể
  warehouses.forEach(warehouse => {
    warehouse.products.forEach(product => {
      const key = `${product.product}-${product.variant}`;
      quantityMap[key] = (quantityMap[key] || 0) + (product.quantity || 0);
    });
  });

  // Tổ chức dữ liệu sản phẩm với số lượng và biến thể
  const result = {
    _id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    origin: product.origin,
    status: product.status,
    specifications: product.specifications,
    sold: product.sold,
    thumb: product.thumb,
    images: product.images,
    price: product.price,
    totalRatings: product.totalRatings,
    deleted: product.deleted,
    type: product.type,
    ratings: product.ratings,
    slug: product.slug,
    quantity: quantityMap[`${product._id}-${product.variant}`] || 0,
    variant: product.variant,
    sku: product.sku,
    disCount: product.disCount,
    __v: product.__v,
    variants: []
  };

  // Thêm thông tin biến thể với số lượng
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      result.variants.push({
        sku: variant.sku,
        variant: variant.variant,
        price: variant.price,
        quantity: quantityMap[`${product._id}-${variant.variant}`] || 0, 
        thumb: variant.thumb,
        _id: variant._id
      });
    });
  }

  return res.status(200).json({
    success: true,
    data: result
  });
});
const getAllProduct = asyncHandler(async (req, res) => {
  // Xử lý query parameters
  const queries = { ...req.query };
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach((el) => delete queries[el]);

  // Format các operators ($gte, $gt, etc)
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedEl) => `$${matchedEl}`);
  const formatQueries = JSON.parse(queryString);

  // Xử lý filtering
  let queryObject = {};
  if (queries?.q) {
    delete formatQueries.q;
    queryObject = {
      $or: [
        { name: { $regex: queries.q, $options: 'i' } },
        { category: { $regex: queries.q, $options: 'i' } },
        { status: { $regex: queries.q, $options: 'i' } },
      ],
    };
  }

  // Lọc theo category
  if (queries?.category) {
    queryObject.category = { $regex: queries.category, $options: 'i' };
  }
  if (queries?.name) {
    queryObject.name = { $regex: queries.name, $options: 'i' };
  }
  if (queries?.status) {
    queryObject.status = { $regex: queries.status, $options: 'i' };
  }

  // Kết hợp các query
  const qr = { ...formatQueries, ...queryObject };

  // Tạo query command cơ bản
  let queryCommand = Product.find(qr);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  } else {
      // Sắp xếp mặc định nếu không có sort được truyền vào
      queryCommand = queryCommand.sort("-createdAt");
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // Thực thi query để lấy tổng số sản phẩm
  const queryExecute = await queryCommand.exec();
  const counts = await Product.countDocuments(qr);

  // Lấy sản phẩm với variants
  const products = await Product.find(qr).populate('variants');

  // Phần còn lại của code giữ nguyên
  const warehouses = await WaveHouse.find({type: 'Phiếu nhập'});
  const quantityMap = {};

  warehouses.forEach(warehouse => {
    warehouse.products.forEach(product => {
      const key = `${product.product}-${product.variant}`;
      quantityMap[key] = (quantityMap[key] || 0) + (product.quantity || 0);
      
    });
  });

  const resultMap = {};
  // Cập nhật queryExecute để có cùng cấu trúc với resultsWithVariants
  const updatedQueryExecute = queryExecute.map(product => {
    const productData = {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      origin: product.origin,
      status: product.status,
      specifications: product.specifications,
      sold: product.sold,
      thumb: product.thumb,
      images: product.images,
      price: product.price,
      totalRatings: product.totalRatings,
      deleted: product.deleted,
      ratings: product.ratings,
      slug: product.slug,
      variant: product.variant,
      sku: product.sku,
      type: product.type,
      disCount: product.disCount,
      quantity: quantityMap[`${product._id}-${product.variant}`] || 0,
      __v: product.__v,
      variants: []
    };

    if (product.variants) {
      productData.variants = product.variants.map(variant => ({
        sku: variant.sku,
        variant: variant.variant,
        price: variant.price,
        quantity: quantityMap[`${product._id}-${variant.variant}`] || 0,
        thumb: variant.thumb,
      }));
    }

    return productData;
  });

  products.forEach(product => {
    if (!resultMap[product._id]) {
      resultMap[product._id] = {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        origin: product.origin,
        status: product.status,
        specifications: product.specifications,
        sold: product.sold,
        thumb: product.thumb,
        images: product.images,
        price: product.price,
        totalRatings: product.totalRatings,
        deleted: product.deleted,
        ratings: product.ratings,
        slug: product.slug,
        type: product.type,
        disCount: product.disCount,
        variant: product.variant,
        sku: product.sku,
        quantity: quantityMap[`${product._id}-${product.variant}`] || 0,
        __v: product.__v,
        variants: [],
      };
    }

    product.variants.forEach(variant => {
      resultMap[product._id].variants.push({
        sku: variant.sku,
        variant: variant.variant,
        price: variant.price,
        quantity: quantityMap[`${product._id}-${variant.variant}`] || 0,
        thumb: variant.thumb,
      });
    });
  });

  const resultsWithVariants = Object.values(resultMap);

  return res.status(200).json({
    success: resultsWithVariants.length > 0,
    data: resultsWithVariants,
    counts,
    setData: updatedQueryExecute
  });
});

  
const updateProduct = asyncHandler(async(req, res) => {
  const {pid} = req.params;
  const thumb = req.files && req.files.thumb && req.files.thumb[0] ? {
    url: req.files.thumb[0].path,
    public_id: req.files.thumb[0].filename
  } : null;

  const images = req.files && req.files.images ? req.files.images.map(el => ({
    url: el.path,
    public_id: el.filename
  })) : [];

  if (thumb) req.body.thumb = thumb;
  if (images.length) req.body.images = images;
  const updateProduct =  await Product.findByIdAndUpdate(pid, req.body, {new: true});
  return res.status(200).json({
    success: true,
    message: updateProduct ? 'Cập nhật thành công' : 'Cập nhật thất bại'
  });
  

});

const deleteProduct = asyncHandler(async(req, res) => {
  const {pid} = req.params;
  const deleteProduct =  await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deleteProduct ? true : false,
    mes: deleteProduct ? 'Xóa sản phẩm thành công' : 'Xóa sản phẩm thất bại!'
  });
  

});
const deleteVariant = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $pull: { variants: { _id: variantId } } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa biến thể thành công',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
});

const ratings = asyncHandler(async(req,res) => {
  const {star, comment, pid, uid, postedByName} = req.body;
  if(!star || !pid) throw new Error('Thiếu thông tin!');
  await Product.findByIdAndUpdate(pid, {
      $push: {ratings: {star, comment, postedBy: uid ? uid : null, postedByName,  updatedAt: Date.now() }}

    },{new: true} );
  // totals ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce((sum, el) =>sum + +el.star, 0)
  updatedProduct.totalRatings = Math.round(sumRatings * 10/ratingCount) / 10;
  await updatedProduct.save();
  return res.status(200).json({
     status:true,
     updatedProduct
  })
})
const deleteRating = asyncHandler(async (req, res) => {
  const { productId, ratingId } = req.params;
  const product = await Product.findById(productId);
  
  if (!product) {
      return res.status(404).json({
          success: false,
          message: 'Không tìm thấy'
      });
  }

  // Find the rating index
  const ratingIndex = product.ratings.findIndex(r => r._id.toString() === ratingId);
  if (ratingIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy' });
  }

  product.ratings.splice(ratingIndex, 1);

  const ratingCount = product.ratings.length;
  const sumRatings = product.ratings.reduce((sum, el) => sum + +el.star, 0);
  product.totalRatings = ratingCount > 0 ? Math.round(sumRatings * 10 / ratingCount) / 10 : 0; 

  const updatedProduct = await product.save();
  if (updatedProduct) {
      return res.status(200).json({
          success: true,
          message: 'Xóa thành công',
          updatedProduct
      });
  } else {
      return res.status(500).json({
          success: false,
          message: 'Xóa thất bại'
      });
  }
});

// upload 
// const uploadImagesProduct = asyncHandler(async (req, res) => {
//   const { pid } = req.params;
//   if(!req.files) throw new Error('Missing Inputs!');
//   const response = await Product.findByIdAndUpdate(pid, {$push: {image:  { $each: req.files.map(el => el.path)}}});
//   res.status(200).json({
//     status: response  ? true : false,
//     updatedProduct: response ? response : 'Cannot upload images product'
//   })
// });
const getCountRatings = asyncHandler(async (req, res) => {
  const oneStarCount = await Product.countDocuments({ totalRatings: { $gte: 0, $lte: 1 } });
  const twoStarCount = await Product.countDocuments({ totalRatings: { $gte: 1, $lte: 2 } });
  const threeStarCount = await Product.countDocuments({ totalRatings: { $gte: 2, $lte: 3 } });
  const fourStartCount = await Product.countDocuments({ totalRatings: { $gte: 3, $lte: 4 } });
  const fiveStartCount = await Product.countDocuments({ totalRatings: { $gte: 4, $lte: 5 } });

  const result = {
      '0-1 sao': oneStarCount,
      '1-2 sao': twoStarCount,
      '2-3 sao': threeStarCount,
      '3-4 sao': fourStartCount,
      '4-5 sao': fiveStartCount,
  };

  res.status(200).json({
      success: result ? true : false,
      data: result
  });
});
// reply
const replyToComment = asyncHandler( async (req, res) => {
  const { productId, ratingId } = req.params;
  const { comment, parentCommentId, postedByName, postedBy} = req.body;
  const product = await Product.findOneAndUpdate(
      { _id: productId, 'ratings._id': ratingId },
      {
        $push: {
          'ratings.$.replies': {
            comment,
            parentCommentId: parentCommentId ? parentCommentId : null,
            postedByName: postedByName,
            postedBy: postedBy ? postedBy : null, 
            createdAt: new Date(),
          }
        }
      },
      { new: true } 
    );
  return res.status(200).json({
    success: true,
    message: product ? 'Phản hồi thành công' : 'Phản hồi thất bại'
  })
});
const replyToCommentChild = asyncHandler(async (req, res) => {
  const { productId, childId } = req.params;
  console.log(productId, childId);
  const { comment, parentCommentId, postedByName, userId } = req.body;

  // Tìm sản phẩm và cập nhật bình luận con
  const product = await Product.findOneAndUpdate(
    { _id: productId, 'ratings.replies._id': childId }, // Điều kiện tìm kiếm chính xác
    {
      $push: {
        'ratings.$.replies': {
          comment,
          parentCommentId: parentCommentId ? parentCommentId : null,
          postedByName: postedByName,
          postedBy: userId? userId : null,
          createdAt: new Date(),
        },
      },
    },
    { new: true } 
  );

  if (product) {
    return res.status(200).json({
      success: true,
      message: 'Phản hồi thành công',
    });
  } else {
    return res.status(200).json({
      success: false,
      message: 'Phản hồi thất bại', 
    });
  }
});
const updateReplyId = asyncHandler(async (req, res) => {
  const { productId, ratingId, replyId  } = req.params;
  const product = await Product.findById(productId);
    
  if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy'
      });
  }
  const rating = product.ratings.find(r => r._id.toString() === ratingId);
  if (!rating) {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }

  const replyIndex = rating?.replies?.findIndex((el) => el._id.toString() === replyId);
  console.log(replyIndex)
  if (replyIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy'
    });
  }
  const updatedReply = {
      ...rating.replies[replyIndex].toObject(),
      ...req.body 
  };
  rating.replies[replyIndex] = updatedReply;

  const update = await product.save();

    if (update) {
      return res.status(200).json({
        success: true,
        message:  update ? 'Cập nhật thành công' : 'Cập nhật thất bại',
      });
    }
});
const deleteReplyId = asyncHandler(async (req, res) => {
  const { productId, ratingId, replyId  } = req.params;
  const product = await Product.findById(productId);
    
  if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy'
      });
  }
  const rating = product.ratings.find(r => r._id.toString() === ratingId);
  if (!rating) {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }

  const replyIndex = rating?.replies?.findIndex((el) => el._id.toString() === replyId);
  console.log(replyIndex)
  if (replyIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy'
    });
  }
  rating.replies.splice(replyIndex, 1);

  const update = await product.save();

    if (update) {
      return res.status(200).json({
        success: true,
        message:  update ? 'Xóa thành công' : 'Xóa thất bại',
      });
    }
});
const deleteReply = asyncHandler(async (req, res) => {
  const { productId, ratingId, replyId } = req.params;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId, 'ratings._id': ratingId },
      {
        $pull: { 'ratings.$.replies': { _id: replyId } }
      },
      { new: true } 
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc bình luận' });
    }

    return res.status(200).json({ message: 'Xóa phản hồi thành công', product });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi xóa phản hồi', error });
  }
});
const getReplies = asyncHandler(async (req, res) => {
  const { productId, ratingId} = req.params;

  const product = await Product.findById(productId).select('ratings');
  if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  const rating = product.ratings.find(r => r._id.toString() === ratingId);
  if (!rating) {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }
  return res.status(200).json({
    success: true,
    data: rating
  })
});
const getReplyId = asyncHandler(async (req, res) => {
  const { productId, ratingId, replyId} = req.params;

  const product = await Product.findById(productId).select('ratings');
  if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  const rating = product.ratings.find(r => r._id.toString() === ratingId);
  if (!rating) {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }
  const reply = rating.replies.find(r => r._id.toString() === replyId);
  if (!reply) {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }
  return res.status(200).json({
    success: true,
    data: reply
  })
});
const getRepliesAdmin = asyncHandler(async (req, res) => {
  const { productId, ratingId, uid} = req.params;

  const product = await Product.findById(productId).select('ratings');
  if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  const rating = product.ratings.find(r => r._id.toString() === ratingId);
  if (!rating) {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }
  const adminReplies = rating.replies.filter(reply => reply.postedBy && reply.postedBy.toString() === uid);
  if (!adminReplies) {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }
  return res.status(200).json({
    success: true,
    data: adminReplies
  })
});


const getAllProductVoucher = asyncHandler(async (req, res) => {
  // Lấy tất cả các voucher có `applyType` là 'products'
  const vouchers = await Voucher.find({ applyType: 'products' });

  // Tạo một Set để lưu trữ các ID sản phẩm duy nhất từ voucher
  const productIds = new Set();
  vouchers.forEach(voucher => {
    voucher.applicableProducts.forEach(item => {
      productIds.add(item.product);
    });
  });

  // Chuyển đổi Set thành mảng để tìm các sản phẩm theo ID
  const products = await Product.find({ _id: { $in: Array.from(productIds) } }).populate('variants');

  // Lấy thông tin kho để xác định số lượng của sản phẩm
  const warehouses = await WaveHouse.find({});
  const quantityMap = {};

  warehouses.forEach(warehouse => {
    warehouse.products.forEach(product => {
      const key = `${product.product}-${product.variant}`;
      quantityMap[key] = (quantityMap[key] || 0) + (product.quantity || 0);
    });
  });

  // Tạo một mảng chỉ chứa các sản phẩm cần thiết kèm thông tin `quantity`
  const productDetails = products.map(product => {
    const productData = {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      origin: product.origin,
      status: product.status,
      specifications: product.specifications,
      sold: product.sold,
      thumb: product.thumb,
      images: product.images,
      price: product.price,
      totalRatings: product.totalRatings,
      deleted: product.deleted,
      ratings: product.ratings,
      slug: product.slug,
      disCount: product.disCount,
      variant: product.variant,
      type: product.type,
      quantity: quantityMap[`${product._id}-${product.variant}`] || 0, // Thêm số lượng sản phẩm
      __v: product.__v,
      variants: []
    };

    // Nếu sản phẩm có variants, lấy thông tin và số lượng tương ứng từ `quantityMap`
    if (product.variants) {
      productData.variants = product.variants.map(variant => ({
        sku: variant.sku,
        variant: variant.variant,
        price: variant.price,
        quantity: quantityMap[`${product._id}-${variant.variant}`] || 0,
        thumb: variant.thumb,
      }));
    }

    return productData;
  });

  return res.status(200).json({
    success: productDetails.length > 0,
    data: productDetails,
    counts: productDetails.length,
    startDate: vouchers.length > 0 ? vouchers[0].startDate : null,
    endDate: vouchers.length > 0 ? vouchers[0].endDate : null,
  });
});




module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  ratings,
  addVariant,
  deleteVariant,
  getCountRatings,
  updateVariantId,
  getVariantById,
  replyToComment,
  deleteReply, 
  getReplies,
  getReplyId,
  replyToCommentChild,
  getRepliesAdmin,
  updateReplyId,
  deleteReplyId,
  deleteRating,
  getAllProductVoucher,
  deleteDiscount
  
}