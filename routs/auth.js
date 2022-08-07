const {Router} = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const sendRegistration = require('../email/sendRegistration');
const sendResetToken = require('../email/sendResetToken');

const router = new Router();

const ONE_HOUR = 60 * 60 * 1000;

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

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Fogot password?',
    error: req.flash('error'),
  });
});

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) return res.redirect('login');

  try {
    const condidate = await User.findOne({
      'resetInfo.token': req.params.token,
      'resetInfo.tokenExp': {$gt: Date.now()},
    });

    if (!condidate) return res.redirect('login');

    res.render('auth/password', {
      title: 'New password',
      error: req.flash('error'),
      userId: condidate._id.toString(),
      token: req.params.token,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const condidate = await User.findOne({email});
    if (!condidate) {
      req.flash('error', 'Email is not found');
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
    const {email, password, name/* , repeat */} = req.body;
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
      await sendRegistration([email]);
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/reset', async (req, res) => {
  try {
    const candidate = await User.findOne({email: req.body.email});
    if (!candidate) {
      req.flash('error', 'Email is not found');
      res.redirect('reset');
      return;
    }

    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Some mistake. Try again later');
        res.redirect('reset');
        return;
      }

      const token = buffer.toString('hex');

      candidate.resetInfo.token = token;
      candidate.resetInfo.tokenExp = Date.now() + ONE_HOUR;
      await candidate.save();
      await sendResetToken([candidate.email], token);
      res.redirect('login');
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/password', async (req, res) => {
  try {
    const candidate = await User.findOne({
      '_id': req.body.userId,
      'resetInfo.token': req.body.token,
      'resetInfo.tokenExp': {$gt: Date.now()},
    });

    if (!candidate) {
      req.flash('error', 'Token has expired');
      res.redirect('login');
      return;
    }

    candidate.password = await bcrypt.hash(req.body.password, 10);
    candidate.resetInfo = undefined;
    await candidate.save();
    res.redirect('login');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
