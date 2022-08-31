const {Router} = require('express');
const check = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const sendRegistration = require('../email/sendRegistration');
const sendResetToken = require('../email/sendResetToken');
const {registerValidators, loginValidators} = require('../utils/validators');

const router = new Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfilePage: true,
    user: req.user.toObject(),
    // error: req.flash('error'),
  });
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const changing = {
      name: req.body.name,
    };


    console.log(req.file);

    if (req.file) {
      changing.avatarUrl = req.file.path;
    }

    Object.assign(user, changing);
    await user.save();
    res.redirect('/profile');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
