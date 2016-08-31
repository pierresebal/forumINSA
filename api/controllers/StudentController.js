/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /* */
  login: function(req, res) {

    var data = {login:req.param('login'), password:req.param('password')};
    var request = require('request');

    request.post({url:'https://etud.insa-toulouse.fr/~pnoel/fie/connection.php', form:data}, function(err, httpResponse, body) { //Demande de connection au ldap via le script php qui renvoie '0' si la connexion echoue
      if (!err && httpResponse.statusCode == 200) {
        if (body != '0') { // si la personne a pu se connecter au ldap
          var result = JSON.parse(body);

          Student.findOne({login: result.login}).exec(function find(err, record) {
            if (err)
              return res.negotiate(err);
            if (!record) { //Première connexion
              Student.create(result).exec(function setSessionVariables(err, created) {
                StudentSession.setStudentSessionVariables(req, created.login, created.firstName, created.mailAddress, true, "student");

                return res.view('StudentSpace/FirstConnection_1', {
                  layout: 'layout',
                  login: created.login,
                  firstName: created.firstName,
                  lastName: created.lastName,
                  mailAddress: created.mailAddress,
                  specialities: Student.definition.speciality.enum
                });
              });

            } else {
              StudentSession.setStudentSessionVariables (req, record.login, record.firstName, record.mailAddress, true, "student");
              return res.redirect("/");
            }
          });

        } else { //Personne non reconnu par le ldap
          StudentSession.setStudentSessionVariables (req, "", "", "", false, "");
          return res.view("Connection_Password/Connection", {layout:'layout', studentConnectionFailed:true, title:'Connexion - FIE'});
        }
      } else {
        console.log("erreur : " + err);
      }
    });

  },

  /* ---------------------------------------------------------------------------------------------- */
  // StudentLogout: set session var as an unauthentificated user
  StudentLogout:function(req,res){
    if(req.session.authenticated && req.session.sessionType == "student"){
      StudentSession.setStudentSessionVariables (req, "", "", "", false, "");
      res.redirect('/');
    }
    else
    {
      console.log("A unauthenticated user tried to disconnect himself");
      res.view('500');
    }
  },

  /* ----------------------------------------------------------------------------------------------- */

  //Affiche les informations du profil
  profile:function(req, res) {

    Student.findOne({login: req.session.login}).exec(function (err, record) {
      if (err)
        return res.negotiate(err);
      if (!record) {
        return res.view('errorPage', {layout:'layout', ErrorTitle:"Recherche du profil failed", ErrorDesc:"Etes-vous bien connecté ? Contacter le webmaster si le problème persiste"});
      } else {

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

  /* ---------------------------------------------------------------------------------------------- */

  //Modifie une information de l'utilisateur
  setAUserInfo:function(req, res) {

    var data = req.param('data').charAt(0); //Type d'info à modifier

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

      case 'm' :
        var mailAddress = req.param('mailAddress');
        //Todo: Verification de year;
        Student.update({login:req.session.login}, {mailAddress:mailAddress}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout:'layout', ErrorTitle:"prb update mailAddress."});

          return res.redirect('/Student/Profile');
        });
        break;

      default :
        console.log("Type de data inconnu");
    }

  },


  //Mofifie toutes les info que l'utilisateur veut modifier.
  setAllInfo: function(req,res) {
    var mailAddress = req.session.mailAddress;

    if (req.param('maillAddress') == "")
      mailAddress= req.param('mailAddress');

      //Todo : vérifier que l'adresse n'existe pas déjà

    Student.update({login:req.session.login}, {
      mailAddress: mailAddress,
      year: req.param('year'),
      speciality: req.param('speciality'),
      personalWebsite: req.param('personalWebsite'),
      linkedin: req.param('linkedin'),
      viadeo: req.param('viadeo'),
      github: req.param('github')
    }).exec(function update(err, updatedUser){
      if (err) {
        console.log(err);
        return res.view("ErrorPage", {layout: 'layout', ErrorTitle: "Update failed"});
      }

      return res.view('StudentSpace/FirstConnection_2', {layout:'layout', title:'Connexion - FIE'});
    });
  },

  companies: function(req, res) {

    const specialities = ['AE', 'GB', 'GP', 'GMM', 'GM', 'GPE', 'IR', 'GC']

    if (!req.param('speciality')) {//Si aucune spécialité choisi
      return res.view('StudentSpace/Companies', {layout:'layout', title:'Entreprises - FIE', specialities: specialities, specialitySelected: ''});
    }
    else {
      const actualYear = new Date().getFullYear();

      Sells.find({year: actualYear}).exec(function (err, sells) {
        if (err) {
          console.log('error : ' + err)
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Erreur: les ventes n'ont pas été récupérées."});
        }

        const companiesSiret = sells.map((sell) => sell.companySiret)
        var sortSettings = {siret: companiesSiret}
        sortSettings[req.param('speciality')] = true

        Company.find(sortSettings).exec(function (err, companies) {
          if (err) {
            console.log('error : ' + err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Les entreprises ne sont pas récupérées"});
          }
          return res.view('StudentSpace/Companies', {layout:'layout', companies:companies, specialities: specialities, specialitySelected: req.param('speciality')});
        })
      })
    }
  },

  displayACompany : function(req, res)  {
    Company.findOne({siret:req.param('siret')}).exec(function (err, company){
      const actualYear = new Date().getFullYear();

      if (err) {
        console.log('error : ' + err)
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "L'entreprise n'est pas récupérée"});
      }

      if (!company)
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "L'entreprise au siret " + req.param('siret') + " n'existe pas."});

      Sells.findOne({companySiret:req.param('siret'), year:actualYear}).exec(function(err, sell){
        if (err) {
          console.log('error : ' + err)
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Les ventes ne sont pas récupérées"});
        }

        var sellsExist = true
        if (!sell)
          sellsExist = false

          console.log('sells :', sell)

        return res.view('StudentSpace/CompanyInfo', {layout:'layout', company:company, sell:sell, sellsExist: sellsExist})
      })
    })
  },

  sjd: function(req, res) {
    return res.view('StudentSpace/Sjd', {layout:'layout', title:'Speed Job Dating - FIE'});
  },

  getSpecialities : function(req,res) {
    return res.json(Student.definition.speciality.enum);
  },

  getStudents : function(req, res) {
    Student.find().exec(function(err, records) {
      if (err) {
        console.log("Erreur renvoi students");
        return;
      }

      var lightRecords = records.map(function (found) {
        return {
          "login" : found.login,
          "lastName" : found.lastName,
          "firstName" : found.firstName,
          "year" : found.year,
          "speciality" : found.speciality,
          "personalWebsite" : found.personalWebsite,
          "linkedin" : found.linkedin,
          "viadeo" : found.viadeo,
          "github" : found.github,
          "frCVPath" : found.frCVPath,
          "enCVPath" : found.enCVPath
        };
      });

      return res.json(lightRecords);
    });
  }
};
