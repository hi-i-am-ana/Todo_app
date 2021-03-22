const express = require('express');
const db = require('../db/database.js');
const loggedInCheck = require('../middleware.js').loggedInCheck;

const router = express.Router();

router.get('/:id', loggedInCheck, (req, res) => {
  db.one('SELECT email FROM email_confirmation WHERE hash = $1;', req.params.id)
  .then((row) => {
    db.none('UPDATE users SET active = $1 WHERE email = $2;', [true, row.email])
    .then(() => {
      db.none('DELETE from email_confirmation WHERE hash = $1;', req.params.id)
    })
    .then(() => {
      res.render('pages/email_confirmation', {
        email: row.email,
        title: 'Email Confirmation | TODO',
        currentUser: req.session.user});
    })
    .catch((err) => res.render('pages/error', {
      err: err,
      title: 'Error | TODO',
      currentUser: req.session.user}));
  })
  .catch((err) => res.status(404).render('pages/error', {
    err: {message: 'HTTP ERROR 404. This page can not be found'},
    title: 'Error | TODO',
    currentUser: req.session.user
  }));
});

module.exports = router;