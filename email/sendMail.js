const nodemailer = require('nodemailer');
const wellknown = require('nodemailer-wellknown');
const smtpTransport = require('nodemailer-smtp-transport');

const config = wellknown('Mail.ru');
config.auth = {
  user: 'lyskovda@mail.ru',
  pass: 'aNYA22sIS',
};

module.exports = async function sendMail(addresses, options) {
  const transporter = nodemailer.createTransport(smtpTransport(config));
  const info = await transporter.sendMail({
    ...options,
    from: '"Lyskov Dmitry" <lyskovda@mail.ru>', // sender address
    to: addresses.join(', '), // list of receivers
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
