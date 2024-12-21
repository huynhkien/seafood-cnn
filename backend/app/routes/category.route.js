const express = require('express');
const categoryController = require('../controllers/category.controller');
const { verifyAccessToken, isAdmin, isAdminOrStaff } = require('../middlewares/verifyToken');
const { deleteOldImage } = require('../middlewares/deleteOldImage');
const uploader = require('../config/cloudinaryConfig');

const router = express.Router();

router.route('/')
    .post([verifyAccessToken, isAdminOrStaff], uploader.single('image'), categoryController.createCategory)
    .get(categoryController.getCategories);

router.route('/:cid')
    .get([verifyAccessToken, isAdminOrStaff],categoryController.getCategory)
    .put([verifyAccessToken, isAdminOrStaff],deleteOldImage, uploader.single('image'),  categoryController.updateCategory)
    .delete([verifyAccessToken, isAdminOrStaff],deleteOldImage,categoryController.deleteCategory);
router.route('/:slug').get(categoryController.getCategoryNameBySlug);

module.exports = router;
