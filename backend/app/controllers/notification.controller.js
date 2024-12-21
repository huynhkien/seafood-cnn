const { query } = require('express');
const Notification = require('../models/notification.model');
const asyncHandler = require('express-async-handler');

const createNotification = asyncHandler(async (req, res) => {
      const response = await Notification.create(req.body);
      return res.status(200).json({
        success: response? true : false,
      });
  });
const getNotification = asyncHandler(async(req, res) => {
    const {nid} = req.params;
    const response = await Notification.findById(nid);
    return res.status(200).json({
        success: true,
        data: response
    });
});
const getNotifications = asyncHandler(async(req, res) => {
    const response = await Notification.find();
    return res.status(200).json({
        success: true,
        data: response
    })
})

const deleteNotification = asyncHandler(async(req, res) => {
    const {nid} = req.params;
    const deleteNotification = await Notification.findByIdAndDelete(nid);
    return res.status(200).json({
        success: deleteNotification? true : false,
        message: deleteNotification ? 'Xóa thành công' : 'Gặp lỗi khi xóa'
    });
});

  

module.exports = {
    createNotification,
    getNotification,
    getNotifications,
    deleteNotification,
}
