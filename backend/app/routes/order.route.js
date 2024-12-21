const express = require('express');
const Order = require('../controllers/order.controller');
const { route } = require('../../app');
const {verifyAccessToken, isAdmin , isStaff, isAdminOrStaff} = require('../middlewares/verifyToken');


const router = express.Router();
router.route('/').post(verifyAccessToken, Order.createOrder);
router.route('/day').get(Order.getTotalAmountByDay); 
router.route('/month').get(Order.getTotalAmountByMonth); 
router.route('/year').get(Order.getTotalAmountByYear); 
router.route('/status/:oid').put(verifyAccessToken, Order.updateStatus);
router.route('/admin').get([verifyAccessToken, isAdminOrStaff], Order.getOrderAdmin);
router.route('/count').get(Order.getCountStatus); 
router.route('/get-count').get(Order.getCountOrder); 
router.route('/').get(verifyAccessToken, Order.getOrderUser);
router.route('/:oid').get(Order.getOrderId);





module.exports = router;

// CREATE (POST) + (PUT) - body
// GET + DELETE - query