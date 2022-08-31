const sendMail = require('./sendMail');
const keys = require('../keys');

module.exports = function(addresses, token) {
  sendMail(addresses, {
    subject: 'Reset password', // Subject line
    html: `
    <h1>Forgot password?</h1>
    <p>If not then ignore the letter.</p>
    <p>Otherwise follow the link: <a href="${keys.BASE_URL}/auth/password/${token}">Restore access</a></p>
    `,
  });
};
