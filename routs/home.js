const {Router} = require('express');

const router = new Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Main page',
    isHomePage: true,
  });
});

module.exports = router;
