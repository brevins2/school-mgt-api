const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "jildev00@gmail.com",
    pass: "qamwyijvjcigcxcz",
  },
});

module.exports = transporter;