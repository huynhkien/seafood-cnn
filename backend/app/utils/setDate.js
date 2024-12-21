const cron = require('node-cron');
const Voucher = require('../models/voucher.model'); 
const Product = require('../models/product.model');

// Đặt một cron job để chạy mỗi ngày lúc 00:00
cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const vouchers = await Voucher?.find({
    endDate: {$lt: now},
    isShow: true
  });
  if (vouchers.length > 0) {
    for(const voucher of vouchers){
        voucher?.isShow = true;
        await voucher.save();
    }
  }
});
cron.schedule('0 * * * *', async () => {
    const now = new Date();
    const products = await Product?.find({
        "disCount.end_date": { $lt: now },
        "disCount.isValid": true
    })
    if (products.length > 0) {
        for (const product of products) {
              product.disCount.isValid = false;
              await product.save();
          }
      }
});