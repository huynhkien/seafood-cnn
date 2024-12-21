const express = require('express');
const products = require('../controllers/product.controller');
const { route } = require('../../app');
const {verifyAccessToken, isAdmin, isAdminOrStaff} = require('../middlewares/verifyToken');
const {deleteOldImageProduct} = require('../middlewares/deleteOldImage')
const uploader = require('../config/cloudinaryConfig');



const router = express.Router();

router.route('/').post([verifyAccessToken, isAdminOrStaff],
  uploader.fields([
    { name: 'thumb', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]), 
  products.createProduct
);

router.route('/').get(products.getAllProduct);
router.route('/get-all-product-voucher').get(products.getAllProductVoucher);
router.route('/ratings').put(products.ratings);

  
router.route('/:pid').delete([verifyAccessToken, isAdminOrStaff],products.deleteProduct);

router.route('/:pid').put([verifyAccessToken, isAdminOrStaff],
  uploader.fields(
    [
      {name: 'images', maxCount: 10},
      {name: 'thumb', maxCount: 1}
    ]),products.updateProduct);
router.route('/add-variant/:pid').put([verifyAccessToken, isAdminOrStaff], uploader.single('thumb'), products.addVariant);
router.route('/get-variant/:pid/:_id').get([verifyAccessToken, isAdminOrStaff], products.getVariantById);
router.route('/update-variant/:pid/:_id').put([verifyAccessToken, isAdminOrStaff], uploader.single('thumb'), products.updateVariantId);
router.route('/update-discount/:pid').put([verifyAccessToken, isAdminOrStaff], products.deleteDiscount);
router.route('/reply/:productId/:ratingId').post(products.replyToComment);
router.route('/reply-child/:productId/:childId').post(products.replyToCommentChild);
router.route('/update-reply/:productId/:ratingId/:replyId').put([verifyAccessToken, isAdminOrStaff], products.updateReplyId);
router.route('/reply/:productId/:ratingId').get(products.getReplies);
router.route('/reply-id/:productId/:ratingId/:replyId').get([verifyAccessToken, isAdminOrStaff], products.getReplyId);
router.route('/reply-id/:productId/:ratingId/:replyId').delete([verifyAccessToken, isAdminOrStaff], products.deleteReplyId);
router.route('/rating/:productId/:ratingId').delete([verifyAccessToken, isAdminOrStaff], products.deleteRating);
router.route('/reply-admin/:productId/:ratingId/:uid').get(products.getRepliesAdmin);
router.route('/count').get([verifyAccessToken, isAdminOrStaff], products.getCountRatings);
router.route('/:pid').get(products.getProduct);


module.exports = router;