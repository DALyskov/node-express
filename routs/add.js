const {Router} = require('express');
const Course = require('../models/course');
const authMiddleware = require('../middleware/auth');
const router = new Router();

router.get('/', authMiddleware, (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAddPage: true,
  });
});

router.post('/', async (req, res) => {
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
