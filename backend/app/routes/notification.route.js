const express = require('express');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

router.route('/')
    .post(notificationController.createNotification)
    .get(notificationController.getNotifications);

router.route('/:nid')
    .get(notificationController.getNotification)
    .delete(notificationController.deleteNotification);
    



module.exports = router;
