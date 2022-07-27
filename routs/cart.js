const {Router} = require('express');
const Course = require('../models/course');
const authMiddleware = require('../middleware/auth');

const router = new Router();

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));
}
function calculatePrice(courses) {
  return courses.reduce((acc, cur) => acc += cur.price * cur.count, 0);
}

router.get('/', authMiddleware, async (req, res) => {
  const user = await req.user.populate('cart.items.courseId');
  const courses = mapCartItems(user.cart);

  res.render('cart', {
    title: 'Cart',
    isCardPage: true,
    courses: courses.map(course => ({...course, amount: course.price * course.count})),
    price: calculatePrice(courses),
  });
});

router.post('/add', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addCourse(course);
  // res.redirect('/cart');
  res.redirect('/courses');
});

router.delete('/remove/:id', authMiddleware, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId');

  const courses = mapCartItems(user.cart);
  const cart = {
    courses,
    price: calculatePrice(courses),
  };
  res.status(200).json(cart);
});

module.exports = router;
