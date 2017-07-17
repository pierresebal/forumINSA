/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  console.log("Session authenticated (policy): "+req.session.authenticated);
  if (req.session.authenticated && req.session.sessionType == "student") {
    return next();
  }
  else {
    return res.view('Connection_Password/Connection', {nexturl:req.originalUrl,error: "Vous devez être connecté comme étudiant pour acceder a cette pages", layout: 'layout'});
  }
};
