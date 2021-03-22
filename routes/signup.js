const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const db = require('../db/database.js');
const { host, port, gmailhost, gmailport, gmailuser, gmailpassword } = require('../config');
const loggedInCheck = require('../middleware.js').loggedInCheck;
// Import shared validation function
const validation = require('../public/js/shared_signup_validation.js');

const router = express.Router();

// GET route for signup page
router.get('/', loggedInCheck, (req, res) => res.render('pages/signup', {
  title: 'Sign Up | TODO',
  currentUser: req.session.user,
  modal: req.query.modal,
  firstname: req.query.firstname,
  lastname: req.query.lastname,
  email: req.query.email,
  firstnameEmptyAlert: req.query.firstnameEmptyAlert,
  firstnameInvalidAlert: req.query.firstnameInvalidAlert,
  lastnameEmptyAlert: req.query.lastnameEmptyAlert,
  lastnameInvalidAlert: req.query.lastnameInvalidAlert,
  emailExistsAlert: req.query.emailExistsAlert,
  emailEmptyAlert: req.query.emailEmptyAlert,
  emailInvalidAlert: req.query.emailInvalidAlert,
  passwordEmptyAlert: req.query.passwordEmptyAlert,
  passwordInvalidAlert: req.query.passwordInvalidAlert,
  confirmPasswordEmptyAlert: req.query.confirmPasswordEmptyAlert,
  confirmPasswordMatchAlert: req.query.confirmPasswordMatchAlert,
}));

// POST route for signup page
router.post('/', (req, res) => {
  let queryParams = {
    firstname: '',
    lastname: '',
    email: '',
    firstnameEmptyAlert: false,
    firstnameInvalidAlert: false,
    lastnameEmptyAlert: false,
    lastnameInvalidAlert: false,
    emailExistsAlert: false,
    emailEmptyAlert: false,
    emailInvalidAlert: false,
    passwordEmptyAlert: false,
    passwordInvalidAlert: false,
    confirmPasswordEmptyAlert: false,
    confirmPasswordMatchAlert: false,
  };
  let validForm = true;
  const setInvalid = (inputAlert) => {
    queryParams[inputAlert] = true;
    validForm = false;
  };
  db.oneOrNone('SELECT * FROM users WHERE email = $1;', req.body.email.toLowerCase())
  .then((user) => {
    // Check if user with submitted email (req.body.email) exists in database
    if (user !== null) {
      setInvalid('emailExistsAlert');
    } else {
      // Validate inputs (req.boby)
      validation(
        req.body.firstname,
        'firstnameEmptyAlert',
        'firstnameInvalidAlert',
        req.body.lastname,
        'lastnameEmptyAlert',
        'lastnameInvalidAlert',
        req.body.email,
        'emailEmptyAlert',
        'emailInvalidAlert',
        req.body.password,
        'passwordEmptyAlert',
        'passwordInvalidAlert',
        req.body.confirmPassword,
        'confirmPasswordEmptyAlert',
        'confirmPasswordMatchAlert',
        setInvalid
      );
    };
    if (!validForm) {
      // If invalid form, redirect to form with alerts and values (except passwords) that were entered before submit
      queryParams.firstname = req.body.firstname;
      queryParams.lastname = req.body.lastname;
      queryParams.email = req.body.email;
      const query = querystring.stringify(queryParams);
      res.redirect(`/signup?${query}`);
    } else {
      // If valid form, add new user to database
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        const newUser = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email.toLowerCase(),
          password: hash,
          active: false
        };
        db.none('INSERT INTO users (firstname, lastname, email, password, active) VALUES (${newUser.firstname}, ${newUser.lastname}, ${newUser.email}, ${newUser.password}, ${newUser.active});', {newUser})
        .then(() => {
          // Genereate hash for email confirmation link and save it in database
          const emailConfHash = crypto.randomBytes(30).toString('hex');
          db.none('INSERT INTO email_confirmation (email, hash) values ($1, $2);', [newUser.email, emailConfHash])
          .then(() => {
            // TODO: Move email sending function to a separate module
            // Send email with link to confirm entered email address
            const transporter = nodemailer.createTransport({
              host: gmailhost,
              port: gmailport,
              secure: false,
              auth: {
                user: gmailuser,
                pass: gmailpassword,
              },
              tls: {
                rejectUnauthorized: false
              }
            });
            const mailOptions = {
              from: '"TODO" <hi.i.am.anastasia@gmail.com>',
              to: `${newUser.email}`,
              subject: 'Please confirm your email address for TODO',
              html: `
              <h3>Thank you for creating your account on TODO</h3>
              <p>Please confirm your email address:</p>
              <a href="http://${host}:${port}/email/${emailConfHash}">http://${host}:${port}/email/${emailConfHash}</a>
              `
            };
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                res.render('pages/error', {
                  err: err,
                  title: 'Error | TODO',
                  currentUser: req.session.user})
              } else {
                // console.log('Message sent: %s', info.messageId);
                // Redirect back to signup page with modal opened
                const query = querystring.stringify({modal: 'opened'});
                res.redirect(`/signup?${query}`);
              };
            });
          })
          .catch((err) => res.render('pages/error', {
            err: err,
            title: 'Error | TODO',
            currentUser: req.session.user}));
        })
        .catch((err) => res.render('pages/error', {
          err: err,
          title: 'Error | TODO',
          currentUser: req.session.user}));
      });
    };
  })
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    currentUser: req.session.user}));
});

module.exports = router;