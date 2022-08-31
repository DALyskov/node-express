const {body} = require('express-validator');

const User = require('../models/user');

exports.registerValidators = [
  // два способа задать сообщение об ошибке
  body('email')
      .isEmail().withMessage('invalid email')
      .custom(async (value, {req}) => {
        try {
          const user = await User.findOne({email: value});
          if ( user) {
            return Promise.reject(new Error('email is not unique'));
          }
        } catch (e) {
          console.log(e);
        }
      })
      .normalizeEmail(),
  body('name', 'the name must consist of 3 characters').isLength({min: 3}),
  body('password', 'the password length must be between 3 and 56 characters').isLength({min: 3, max: 56})
      .isAlphanumeric()
      .trim(),
  body('confirm')
      .custom((value, {req}) => {
        if (value !== req.body.password) throw new Error('passwords must match');
        return true;
      })
      .trim(),
];

exports.loginValidators = [
  body('email', 'invalid email')
      .normalizeEmail(),
  body('password', 'the password length must be between 3 and 56 characters').isLength({min: 3, max: 56})
      .isAlphanumeric()
      .trim(),
];

exports.courseValidators = [
  body('title', 'invalid email').isLength({min: 3}).trim(),
  body('price', 'invalid price').isNumeric(),
  body('img', 'invalid img url').isURL(),
];
