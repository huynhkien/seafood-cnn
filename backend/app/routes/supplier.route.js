const express = require('express');
const supplierController = require('../controllers/supplier.controller');
const { verifyAccessToken, isAdmin, isAdminOrStaff } = require('../middlewares/verifyToken');


const router = express.Router();

router.route('/')
    .post([verifyAccessToken, isAdminOrStaff], supplierController.createSupplier)
    .get(supplierController.getSuppliers);

router.route('/:sid')
    .get([verifyAccessToken, isAdminOrStaff],supplierController.getSupplier)
    .put([verifyAccessToken, isAdminOrStaff],supplierController.updateSupplier)
    .delete([verifyAccessToken, isAdminOrStaff], supplierController.deleteSupplier);

module.exports = router;
