/**
 * Created by pierr on 18/09/2016.
 */

module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.isAdmin) {
    return next();
  }
  else {
    return res.view('Admin/AdminLogin',{layout:'layout'})
  }
};
