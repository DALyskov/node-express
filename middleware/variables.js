module.exports = function(req, res, next) {
  try {
    if (res) {
      res.locals.isAuth = req.session.isAuthenticated;
      res.locals.csrf = req.csrfToken();
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
