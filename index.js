const express = require('express');
const path = require('path');

const session = require('express-session');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const morgan = require('morgan');

const { port } = require('./config');

const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');
const signupRouter = require('./routes/signup.js');
const emailRouter = require('./routes/email.js');
const passwordRouter = require('./routes/password.js');
const homeRouter = require('./routes/home.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.use(methodOverride('_method')); // must be called after body parser
app.use(morgan('dev'));  // static routes won't be logged if logger is instantiated after static routes
app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout extractScripts', true);

// Configure session middleware
app.use(
  session({
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
    },
    secret: 'I like to sing, sing in the shower. Ah-ha!',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/email', emailRouter);
app.use('/password', passwordRouter);
app.use('/', homeRouter);

// Add route for handling 404 requests - unavailable routes (should be in the end)
app.use((req, res) => {
  res.status(404).render("pages/error", {
    err: { message: "HTTP ERROR 404. This page does not exist" },
    title: "Error | TODO",
  });
});

app.listen(port, () =>
  console.log(`Server is listening on localhost:${port}\n`)
);
