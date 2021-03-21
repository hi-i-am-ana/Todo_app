const express = require('express');
const querystring = require('querystring');
const bcrypt = require('bcrypt');
const db = require('../db/database.js');
const loggedInCheck = require('../middleware.js').loggedInCheck;
const router = express.Router();

// Import shared validation function
const validation = require('../public/js/shared_login_validation.js');

// GET route for login page
loginRouter.get('/', loggedInCheck, (req, res) => res.render('pages/login', {
  title: 'Login | TODO',
  currentUser: req.session.user,
  email: req.query.email,
  emailEmptyAlert: req.query.emailEmptyAlert,
  emailInvalidAlert: req.query.emailInvalidAlert,
  emailMissingAlert: req.query.emailMissingAlert,
  emailUnconfirmedAlert: req.query.emailUnconfirmedAlert,
  passwordEmptyAlert: req.query.passwordEmptyAlert,
  passwordInvalidAlert: req.query.passwordInvalidAlert,
  passwordIncorrectAlert: req.query.passwordIncorrectAlert,
}));

// POST route for login page
loginRouter.post('/', (req, res) => {
  let queryParams = {
    email: '',
    emailEmptyAlert: false,
    emailInvalidAlert: false,
    emailMissingAlert: false,
    emailUnconfirmedAlert: false,
    passwordEmptyAlert: false,
    passwordInvalidAlert: false,
    passwordIncorrectAlert: false,
  };
  let validForm = true;
  const setInvalid = (inputAlert) => {
    queryParams[inputAlert] = true;
    validForm = false;
  };
  db.oneOrNone('SELECT * FROM users WHERE email = $1;', req.body.email.toLowerCase())
  .then((user) => {
    // Validate inputs (req.boby)
    validation(
      req.body.email,
      'emailEmptyAlert',
      'emailInvalidAlert',
      req.body.password,
      'passwordEmptyAlert',
      'passwordInvalidAlert',
      setInvalid
    );
    if (validForm) {
      // Check if user with submitted email (req.body.email) missing in database
      if (user === null) {
        setInvalid('emailMissingAlert');
      };
    };
    if (!validForm) {
      // If invalid form, redirect to form with alerts and email value that was entered before submit (req.body.email)
      queryParams.email = req.body.email;
      const query = querystring.stringify(queryParams);
      res.redirect(`/login?${query}`);
    } else {
      // If valid form, compare password from database (user.password) and submitted password (req.body.password)
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result === false) {
          // If incorrect password, redirect to form with alert and email value that was entered before submit (req.body.email)
          setInvalid('passwordIncorrectAlert');
          queryParams.email = req.body.email;
          const query = querystring.stringify(queryParams);
          res.redirect(`/login?${query}`);
        } else if (!user.active) {
          // If correct password but email hasn't been confirmed, redirect to form with alert and email value that was entered before submit (req.body.email)
          setInvalid('emailUnconfirmedAlert');
          queryParams.email = req.body.email;
          const query = querystring.stringify(queryParams);
          res.redirect(`/login?${query}`);
        } else {
          // If correct password and email has been confirmed, create session
          req.session.user = user.user_id;
          res.redirect('/');
        };
      });
    };
  })  
  .catch((err) => res.render('pages/error', {err: err, title: 'Error | TODO', currentUser: req.session.user}));
});

module.exports = router;
