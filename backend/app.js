
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
var cookieParser = require('cookie-parser');
const usersRouter = require('./app/routes/user.route');
const productsRouter = require('./app/routes/product.route');
const categoryRouter = require('./app/routes/category.route');
const orderRouter = require('./app/routes/order.route');
const supplierRouter = require('./app/routes/supplier.route');
const receiptRouter = require('./app/routes/wavehouse.route');
const voucherRouter = require('./app/routes/voucher.route');
const notificationRouter = require('./app/routes/notification.route');
const {notFound, errorHandler} = require('./app/middlewares/errHandle');


const app =express();


app.use(cookieParser());
const corsOptions ={
    origin: process.env.URL_CLIENT, 
    credentials:true,
    optionSuccessStatus:200
}
const allowedOrigins = [
    'http://localhost:3000',
    'exp://192.168.1.12:8081',
    'http://localhost:8081',
    'https://accounts.google.com',
    'https://apis.google.com'

  ];
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

app.use('/api/user', usersRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productsRouter);
app.use('/api/order', orderRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/receipt', receiptRouter);
app.use('/api/voucher', voucherRouter);
app.use('/api/notification', notificationRouter);


app.use(notFound);
app.use(errorHandler);


app.get('/', (req, res) => {
    res.json({message: "Welcome to backend web_seafood."});
});


module.exports = app;