const {Router} = require('express');
const check = require('express-validator');

const Course = require('../models/course');
const authMiddleware = require('../middleware/auth');
const {courseValidators} = require('../utils/validators');

const router = new Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAddPage: true,
  });
});

router.post('/', authMiddleware, courseValidators, async (req, res) => {
  const error = check.validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add course',
      isAddPage: true,
      error: error.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      },
    });
  }

  const {title, price, img} = req.body;
  // т.к. userId является типом Schema.Types.ObjectId, то мы можем просто написать userId: req.user вместо userId: req.user._id
  const course = new Course({title, price, img, userId: req.user});

  try {
    await course.save();
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
