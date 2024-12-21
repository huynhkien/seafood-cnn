const nodemailer = require("nodemailer");
const  asyncHandler = require('express-async-handler');


const sendMail = asyncHandler(async({email, html, subject}) => {
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

    const info = await transporter.sendMail({
      from: '"SeaFood" <no-reply@seafood.com', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
  
   
  })
module.exports = sendMail;
