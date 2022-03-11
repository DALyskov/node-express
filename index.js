const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRouter = require('./routs/home');
const coursesRouter = require('./routs/courses');
const addRouter = require('./routs/add');
const cardRouter = require('./routs/card');

const PORT = process.env.PORT || 3000;

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRouter);
app.use('/courses', coursesRouter);
app.use('/add', addRouter);
app.use('/card', cardRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
