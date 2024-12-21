const express = require('express');
const users = require('../controllers/user.controller');
const { route } = require('../../app');
const {verifyAccessToken, isAdmin, isAdminOrStaff} = require('../middlewares/verifyToken');
const uploader = require('../config/cloudinaryConfig');
const {deleteOldAvatar} = require('../middlewares/deleteOldImage')

const router = express.Router();
router.route('/register').post(users.register);
router.route('/create-role').post([verifyAccessToken, isAdmin], uploader.single('avatar'), users.createRoleUser);
router.route('/registerApp').post(users.registerApp);
router.route('/login-google').post(users.loginGoogle);
router.route('/final-register/:token').get(users.finalRegister);
router.route('/final-register-app').post(users.finalRegisterApp);
router.route('/final-register-google/:token').get(users.finalRegisterGoogle);
router.route('/login').post(users.login);
router.route('/refreshToken').post(users.reFreshAccessToken);
router.route('/current').get(verifyAccessToken , users.getCurrent);
router.route('/address').put(verifyAccessToken , users.updateAddress );
router.route('/logout').get( users.logout);
router.route('/forgotPassword').post( users.forgotPassword);
router.route('/forgotPasswordApp').post( users.forgotPasswordApp);
router.route('/resetpassword').put( users.resetPassword);
router.route('/get-user/:uid').get(users.getUserId);
router.route('/:uid').delete([verifyAccessToken,isAdminOrStaff],users.deleteUsers);
router.route('/current').put(verifyAccessToken,users.updateCurrent);
router.route('/wishlist/:pid').put(verifyAccessToken, users.updateWishList);
router.route('/update-user/:uid').put([verifyAccessToken, isAdmin], deleteOldAvatar , uploader.single('avatar'), users.updateUser);
router.route('/:uid').put([verifyAccessToken,isAdminOrStaff],users.updateByAdmin);
router.route('/get-all-order').get(users.getAllUsersWithOrders);
router.route('/').get([verifyAccessToken,isAdminOrStaff],users.getUsers);


module.exports = router;

// CREATE (POST) + (PUT) - body
// GET + DELETE - query