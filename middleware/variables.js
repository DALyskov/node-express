module.exports = function(req, res, next) {
  try {
    if (res) {
      res.locals.isAuth = req.session.isAuthenticated;
    }
    next();
  } catch (e) {
    console.log(e);
  }
};
