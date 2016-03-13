/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  login: function(req, res) {
    var data = {login:req.param('login'), password:req.param('password')};
    var request = require('request');

    request.post({url:'https://etud.insa-toulouse.fr/~pnoel/fie/connection.php', form:data}, function(err, httpResponse, body) {
      if (!err && httpResponse.statusCode == 200) {
        if (body != '0') {
          var result = JSON.parse(body);

          Student.findOne({login: result.login}).exec(function (err, record) {
            if (err)
              return res.negotiate(err);
            if (!record) {
              console.log("A besoin d'être créé : " + result.login);
              Student.create(result).exec(function (err, created) {
                console.log("A été créé");
                req.session.login = created.login;
                req.session.firstName = created.firstName;
                req.session.authenticated = true;
                req.session.tried = true;
                return res.redirect("/");
              });
            } else {
              console.log("Il y est :)");
              req.session.login = record.login;
              req.session.firstName = record.firstName;
              req.session.authenticated = true;
              return res.redirect("/");
            }
          });


        } else { //If
          req.session.tried = true;
          req.session.authenticated = false;
          console.log("authentication failed.");
        }
      } else {
        console.log("erreur : " + err);
      }
    });

  }

};

