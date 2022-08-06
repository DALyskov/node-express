const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const keys = require('./keys');
const homeRouter = require('./routs/home');
const coursesRouter = require('./routs/courses');
const addRouter = require('./routs/add');
const cardRouter = require('./routs/cart');
const ordersRouts = require('./routs/orders');
const authRouts = require('./routs/auth');
// const User = require('./models/user');

const PORT = process.env.PORT || 3000;


const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: require('./utils/hbs-helpers'),
});

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URL,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById('62d1105933708a8dc72546fb');
//     req.user = user;
//     next();
//   } catch (e) {
//     console.log(e);
//   }
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouter);
app.use('/courses', coursesRouter);
app.use('/add', addRouter);
app.use('/cart', cardRouter);
app.use('/orders', ordersRouts);
app.use('/auth', authRouts);


async function start() {
  try {
    // const password = 'PUBM9NWrpj6jQgMx';
    // const url = `mongodb+srv://DALyskov:${password}@cluster0.xu09b.mongodb.net/shop?w=majority`;
    // await mongoose.connect(url, {useNewUrlParser: true});
    await mongoose.connect(keys.MONGODB_URL, {useNewUrlParser: true});

    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: 'dalyskov@gmail.com',
    //     name: 'Dmitry',
    //     cart: {items: []},
    //   });
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
