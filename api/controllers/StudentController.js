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

    req.session.test = "je suis là !";
    request.post({url:'https://etud.insa-toulouse.fr/~pnoel/fie/connection.php', form:data}, function(err, httpResponse, body) {
      if (!err && httpResponse.statusCode == 200) {
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
                req.session.sessionType = "student";
                return res.redirect("/");
              });
            } else {
              console.log("Il y est :)");
              req.session.login = record.login;
              req.session.firstName = record.firstName;
              req.session.authenticated = true;
              req.session.sessionType = "student";
              return res.redirect("/");
            }
          });
        Student.findOne({login:result.login}).exec(function(err, record) {
          if (err)
            return res.negotiate(err);
        Student.findOne({login:result.login}).exec(function(err, record) {
          if (err)
            return res.negotiate(err);

          if (!record) {
            console.log("A besoin d'être créé : " + result.login);
            Student.create(result).exec(function(err, created) {
              console.log("A été créé");
            });
          }
          else
            console.log("Il y est :)");
        });

          if (!record) {
            console.log("A besoin d'être créé : " + result.login);
            Student.create(result).exec(function(err, created) {
              console.log("A été créé");
            });
          }
          else
            console.log("Il y est :)");
        });


        } else { //If
          req.session.tried = true;
          req.session.authenticated = false;
          console.log("authentication failed.");
        }
      } else {
      }
      else
        console.log("erreur : " + err);
      }
    });

  },

  // StudentLogout: set session var as an unauthentificated user
  StudentLogout:function(req,res){
    if(req.session.authenticated && req.session.sessionType == "student"){
      console.log("User with email "+ req.session.mailAddress + " disconnected himself.");
      req.session.login='undefined';
      req.session.authenticated=false;
      res.view('homepage',{layout:'layout'});
    }
    else
    {
      console.log("A unauthenticated user tried to disconnect himself");
      res.view('500');
    }
  },
  }

};

