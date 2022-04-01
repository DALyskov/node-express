const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const homeRouter = require('./routs/home');
const coursesRouter = require('./routs/courses');
const addRouter = require('./routs/add');
const cardRouter = require('./routs/cart');
const User = require('./models/user');

const PORT = process.env.PORT || 3000;

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('624746c1e771ba22ddd85081');
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRouter);
app.use('/courses', coursesRouter);
app.use('/add', addRouter);
app.use('/cart', cardRouter);


async function start() {
  try {
    const password = 'PUBM9NWrpj6jQgMx';
    const url = `mongodb+srv://DALyskov:${password}@cluster0.xu09b.mongodb.net/shop?w=majority`;
    await mongoose.connect(url, {useNewUrlParser: true});

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: 'dalyskov@gmail.com',
        name: 'Dmitry',
        cart: {items: []},
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
