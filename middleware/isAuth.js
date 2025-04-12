export const isAuth = (req, res, next) => {
  if (!req.session.userId) {
    req.flash("error", "You must be signed in to access this page");
    return res.redirect("/login");
  }
  next();
};
