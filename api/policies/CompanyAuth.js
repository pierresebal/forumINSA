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
  if (req.session.authenticated && req.session.sessionType === "company") {
    return next();
  }
  else {
      errMessage = {account: 'Vous devez être connecté comme entreprise pour acceder à cette pages'};
      return res.view('Connection_Password/Connection', {
          nexturl:req.originalUrl,
          errMessage: errMessage,
          layout: 'layout'});
  }
};
