const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const { verifyAccessToken, isAdmin, isAdminOrStaff } = require('../middlewares/verifyToken');


const router = express.Router();

router.route('/')
    .post([verifyAccessToken, isAdminOrStaff], voucherController.createVoucher)
    .get(voucherController.getVouchers);

router.route('/:vid')
    .get(voucherController.getVoucher)
    .put([verifyAccessToken, isAdminOrStaff],voucherController.updateVoucherItems)
    .delete([verifyAccessToken, isAdminOrStaff],voucherController.deleteVoucher);


router.route('/:vid/update-voucher-product/:_id')
  .put([verifyAccessToken, isAdminOrStaff], voucherController.updateVoucherProductId)
  .delete([verifyAccessToken, isAdminOrStaff], voucherController.deleteVoucherProduct);

router.route('/:vid/update-voucher-category/:_id')
  .delete([verifyAccessToken, isAdminOrStaff], voucherController.deleteVoucherCategories);
router.route('/:vid/update-voucher-user/:_id')
  .delete([verifyAccessToken, isAdminOrStaff], voucherController.deleteVoucherUsers);

 

module.exports = router;
