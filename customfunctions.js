const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

function mailup (subject, message, token, email) {
  var mailOptions = {
    from: process.env.school_email,
    to: email,
    subject: subject,
    text: message + token
  };

  return mailOptions;
}

function generateEncryptedPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password)
  return hash.digest('hex');
}


module.exports = {
  mailup,
  generateEncryptedPassword
};