const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
  // Destroy the session and unset the req.session property. Once complete, invoke callback
  req.session.destroy((err) => {
    if (err) {
      res.render('pages/error', {err: err, title: 'Error | Mr.Coffee Schedule Management', current_user: req.session.user})
    } else {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    };
  });
});

module.exports = logoutRouter;