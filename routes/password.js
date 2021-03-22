const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const db = require('../db/database.js');
const { host, port, gmailhost, gmailport, gmailuser, gmailpassword } = require('../config');
const loggedInCheck = require('../middleware.js').loggedInCheck;
// Import shared validation functions
const validationForgot = require('../public/js/shared_password_forgot_validation.js');
const validationReset = require('../public/js/shared_password_reset_validation.js');

const router = express.Router();

// GET route for password FORGOT page
router.get('/forgot', loggedInCheck, (req, res) => res.render('pages/password_forgot', {
  title: 'Forgot Password | TODO',
  currentUser: req.session.user,
  modal: req.query.modal,
  email: req.query.email,
  emailEmptyAlert: req.query.emailEmptyAlert,
  emailInvalidAlert: req.query.emailInvalidAlert,
  emailMissingAlert: req.query.emailMissingAlert,
  emailUnconfirmedAlert: req.query.emailUnconfirmedAlert,
}));

// GET route for password RESET page
router.get('/reset/:id', loggedInCheck, (req, res) => res.render('pages/password_reset', {
  title: 'Forgot Password | TODO',
  currentUser: req.session.user,
  passwordResetHash: req.params.id,
  modal: req.query.modal,
  passwordEmptyAlert: req.query.passwordEmptyAlert,
  passwordInvalidAlert: req.query.passwordInvalidAlert,
  confirmPasswordEmptyAlert: req.query.confirmPasswordEmptyAlert,
  confirmPasswordMatchAlert: req.query.confirmPasswordMatchAlert,
}));

// POST route for password FORGOT page
router.post('/forgot', (req, res) => {
  let queryParams = {
    email: '',
    emailEmptyAlert: false,
    emailInvalidAlert: false,
    emailMissingAlert: false,
    emailUnconfirmedAlert: false,
  };
  let validForm = true;
  const setInvalid = (inputAlert) => {
    queryParams[inputAlert] = true;
    validForm = false;
  };
  db.oneOrNone('SELECT * FROM users WHERE email = $1;', req.body.email.toLowerCase())
  .then((user) => {
    // Validate inputs (req.boby)
    validationForgot(
      req.body.email,
      'emailEmptyAlert',
      'emailInvalidAlert',
      setInvalid
    );
    if (validForm) {
      // Check if user with submitted email (req.body.email) missing in database
      if (user === null) {
        setInvalid('emailMissingAlert');
      } else if (!user.active) {
        // If user exists but email hasn't been confirmed
        setInvalid('emailUnconfirmedAlert');
      };
    };
    if (!validForm) {
      // If invalid form, redirect to form with alerts and email value that was entered before submit (req.body.email)
      queryParams.email = req.body.email;
      const query = querystring.stringify(queryParams);
      res.redirect(`/password/forgot?${query}`);
    } else {
      // If valid form genereate hash for password reset link and save it in database
      db.none('DELETE FROM password_reset WHERE email = $1;', user.email)
      .then (() => {
        const passwordResetHash = crypto.randomBytes(30).toString('hex');
        db.none('INSERT INTO password_reset (email, hash) values ($1, $2);', [user.email, passwordResetHash]);
        return passwordResetHash;
      })
      .then((passwordResetHash) => {
        // TODO: Move email sending function to a separate module
        // Send email with link to reset password
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
          to: `${user.email}`,
          subject: 'Reset your password',
          html: `
          <h3>Reset your password</h3>
          <p>Please click on the following link to complete the process:</p>
          <a href="http://${host}:${port}/password/reset/${passwordResetHash}">http://${host}:${port}/password/reset/${passwordResetHash}</a>
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
            // Redirect back to password forgot page with modal opened
            const query = querystring.stringify({modal: 'opened', email: user.email});
            res.redirect(`/password/forgot?${query}`);
          };
        });
      })
      .catch((err) => res.render('pages/error', {
        err: err,
        title: 'Error | TODO',
        currentUser: req.session.user}));
    };
  })  
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | TODO',
    currentUser: req.session.user}));
});

// POST route for password RESET page
router.post('/reset/:id', (req, res) => {
  let queryParams = {
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
  db.one('SELECT * FROM password_reset WHERE hash = $1;', req.params.id)
  .then((row) => {
    // Validate inputs (req.boby)
    validationReset(
      req.body.password,
      'passwordEmptyAlert',
      'passwordInvalidAlert',
      req.body.confirmPassword,
      'confirmPasswordEmptyAlert',
      'confirmPasswordMatchAlert',
      setInvalid
    );
    if (!validForm) {
      // If invalid form, redirect to form with alerts
      const query = querystring.stringify(queryParams);
      res.redirect(`/password/reset/${req.params.id}?${query}`);
    } else {
      // If valid form, hash password and update it in database
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        db.none('UPDATE users SET password = $1 WHERE email = $2;', [hash, row.email])
        .then(() => {
          // Redirect back to password reset page with modal opened
          const query = querystring.stringify({modal: 'opened'});
          res.redirect(`/password/reset/${req.params.id}?${query}`);
        })
        .then(() => {
          db.none('DELETE from password_reset WHERE hash = $1;', req.params.id);
        })
        .catch((err) => res.render('pages/error', {
          err: err,
          title: 'Error | TODO',
          currentUser: req.session.user}));
      });
    };
  })
  .catch((err) => res.status(404).render('pages/error', {
    err: {message: 'HTTP ERROR 404. This page can not be found'},
    title: 'Error | TODO',
    currentUser: req.session.user
  }));
});

module.exports = router;