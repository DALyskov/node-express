const {Router} = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = new Router();


router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Auth',
    isLoginPage: true,
    error: req.flash('error'),
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('login#login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const condidate = await User.findOne({email});
    if (!condidate) {
      req.flash('error', 'email is not found');
      res.redirect('login#login');
      return;
    }

    const areSame = await bcrypt.compare(password, condidate.password);
    if (!areSame) {
      req.flash('error', 'invalid password');
      res.redirect('login#login');
      return;
    }

    req.session.user = condidate;
    req.session.isAuthenticated = true;
    req.session.save(err => {
      if (err) throw err;
      res.redirect('/');
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    const {email, password, name, repeat} = req.body;
    const condidate = await User.findOne({email});
    if (condidate) {
      req.flash('error', 'email is not unique');
      res.redirect('login#register');
    } else {
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: {items: []},
      });
      await user.save();
      res.redirect('login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
