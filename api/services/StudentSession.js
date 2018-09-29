/**
 * Created by pierre on 01/04/16.
 */

module.exports = {
  setStudentSessionVariables: function (req, login, firstName, lastName, mailAddress, authenticated, sessionType) {
    req.session.login = login;
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.mailAddress = mailAddress;
    req.session.authenticated = authenticated;
    req.session.sessionType = sessionType;
  }

}
