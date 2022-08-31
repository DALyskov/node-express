const sendMail = require('./sendMail');
const keys = require('../keys');

module.exports = function(addresses) {
  sendMail(addresses, {
    subject: 'Register', // Subject line
    text: `You have successfully created an account. ${keys.BASE_URL}`, // plain text body
  });
};
