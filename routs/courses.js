const {Router} = require('express');
const Course = require('../models/course');
const authMiddleware = require('../middleware/auth');

const router = new Router();
const checkIsOwner = (course, req) => course.userId.toString() === req.user._id.toString();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('userId', 'email name');
    res.render('courses', {
      title: 'Courses',
      isCoursesPage: true,
      courses: courses,
      userId: req.user ? req.user._id.toString() : null,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('course', {
      layout: 'empty',
      title: `Course ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id/edit', authMiddleware, async (req, res) => {
  if (!req.query.allow) return res.redirect('/');
  try {
    const course = await Course.findById(req.params.id);
    if (!checkIsOwner(course, req)) return res.redirect('/courses');
    res.render('course-edit', {
      title: `Edit ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(3);
  }
});

router.post('/edit', authMiddleware, async (req, res) => {
  try {
    const {id} = req.body;
    delete req.body.id;
    const course = await Course.findById(id);
    if (!checkIsOwner(course, req)) {
      res.redirect('/courses');
      return;
    }
    // Так тоже работает, и не нужно assign и save, и главное findById(id) выше, что даже лучше было бы, но нам нужен course.
    // await Course.findByIdAndUpdate(id, req.body);
    Object.assign(course, req.body);
    await course.save();
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', authMiddleware, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
