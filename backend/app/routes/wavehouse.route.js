const express = require('express');
const waveHouseController = require('../controllers/warehouse.controller');
const { verifyAccessToken, isAdminOrStaff } = require('../middlewares/verifyToken');


const router = express.Router();

router.route('/')
                .post([verifyAccessToken, isAdminOrStaff], waveHouseController.createReceiptImport)
                .get([verifyAccessToken, isAdminOrStaff], waveHouseController.getReceipts)

   
router.route('/:rid')
                    .get([verifyAccessToken, isAdminOrStaff], waveHouseController.getReceipt)   
                    .delete([verifyAccessToken, isAdminOrStaff], waveHouseController.deleteReceipt);   
router.route('/:rid/update-receipt-product/:_id')
  .put([verifyAccessToken, isAdminOrStaff], waveHouseController.updateReceiptProductId);
router.route('/update-receipt-info/:rid')
  .put([verifyAccessToken, isAdminOrStaff], waveHouseController.updateReceiptInfo);
router.route('/update-receipt/:rid')
  .put([verifyAccessToken, isAdminOrStaff], waveHouseController.updateReceiptProducts);
router.route('/:rid/update-receipt-product/:_id')
  .delete([verifyAccessToken, isAdminOrStaff], waveHouseController.deleteReceiptProductId);
module.exports = router;
