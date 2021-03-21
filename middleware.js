// Define middleware function to check for LOGGED-OUT users (for home, user profile and schedule management pages), will redirect to login page
const loggedOutCheck = (req, res, next) => {
  if (!req.session.user) {
    // Clear cookie in case server stopped after login
    res.clearCookie('connect.sid');
    return res.redirect('/login');
  } else {
    next();
  };
};

// Define middleware function to check for LOGGED-IN users (for login, signup, email confirmation and forgot password pages), will redirect to home page
const loggedInCheck = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  } else {
    next();
  };
};

module.exports.loggedOutCheck = loggedOutCheck;
module.exports.loggedInCheck = loggedInCheck;