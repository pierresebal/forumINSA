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
                req.session.mailAddress = created.mailAddress;
                req.session.authenticated = true;
                req.session.studentConnectionTried = true;
                req.session.sessionType = "student";
                return res.redirect("/");
              });
            } else {
              console.log("Il y est :)");
              req.session.login = record.login;
              req.session.firstName = record.firstName;
              req.session.mailAddress = record.mailAddress;
              req.session.authenticated = true;
              req.session.sessionType = "student";
              req.session.studentConnectionTried = true;
              return res.redirect("/");
            }
          });


        } else { //If
          req.session.studentConnectionTried = true;
          req.session.authenticated = false;
          console.log("authentication failed.");
          return res.redirect("Student/Connection");
        }
      } else {
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
      res.redirect('/');
    }
    else
    {
      console.log("A unauthenticated user tried to disconnect himself");
      res.view('500');
    }
  },

  profile:function(req, res) {

    Student.findOne({login: req.session.login}).exec(function (err, record) {
      if (err)
        return res.negotiate(err);
      if (!record) {
        console.log("Profil non trouvé ! :O");
        return res.view('errorPage', {layout:'layout', ErrorTitle:"Login failed", ErrorDesc:"Etes-vous bien connecté ? Contacter le webmaster si le problème persiste"});
      } else {

        console.log("Specialities : " + Student.definition.speciality.enum);

        return res.view('StudentSpace/Profile', {
          layout: 'layout',
          login: record.login,
          firstName: record.firstName,
          lastName: record.lastName,
          mailAddress: record.mailAddress,
          year: record.year,
          speciality: record.speciality,
          frCVPath: record.frCVPath,
          enCVPath: record.enCVPath,
          personalWebsite: record.personalWebsite,
          linkedin: record.linkedin,
          viadeo: record.viadeo,
          github: record.github,
          specialities: Student.definition.speciality.enum
        });
      }
    });
  },


  setUserInfo:function(req, res) {

    var data = req.param('data').charAt(0);

    switch (data) {
      case 'y' :
        var year = req.param('year');
        //Todo: Verification de year;
        Student.update({login:req.session.login}, {year:year}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update year."});

          return res.redirect('/Student/Profile');
        });
        break;

      case 'w' :
        var personalWebsite = req.param('personalWebsite');
        //Todo: Verification de personnalWebsite;
        Student.update({login:req.session.login}, {personalWebsite:personalWebsite}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout:'layout', ErrorTitle:"prb update personalWebsite."});

          return res.redirect('/Student/Profile');
        });
        break;

      case 'l' :
        var linkedin = req.param('linkedin');
        //Todo: Verification de year;
        Student.update({login:req.session.login}, {linkedin:linkedin}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout:'layout', ErrorTitle:"prb update Linkedin."});

          return res.redirect('/Student/Profile');
        });
        break;

      case 'v' :
        var viadeo = req.param('viadeo');
        //Todo: Verification de year;
        Student.update({login:req.session.login}, {viadeo:viadeo}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout:'layout', ErrorTitle:"prb update Viadeo."});

          return res.redirect('/Student/Profile');
        });
        break;

      case 'g' :
        var github = req.param('github');
        //Todo: Verification de year;
        Student.update({login:req.session.login}, {github:github}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout:'layout', ErrorTitle:"prb update github."});

          return res.redirect('/Student/Profile');
        });
        break;

      case 's' :
        var speciality = req.param('speciality');
        //Todo: Verification de year;
        Student.update({login:req.session.login}, {speciality:speciality}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout:'layout', ErrorTitle:"prb update github."});

          return res.redirect('/Student/Profile');
        });
        break;

      default :
        console.log("Type de data inconnu");
    }

  },

};

