/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var path = require('path');

module.exports = {


  //CreateCompany: Function that create a new user into the DB and send him a confirmation email (with confirmation URL)
  CreateCompany:function(req,res) {
    // TODO: Add verification of the form on controller or view (important: password similars)
    // Checking for existing companies
    Company.findOne({mailAddress:req.param('UserEmail')}).exec(function(err,record){
      if (!err) {
        if (typeof record !='undefined') {
          console.log('A company with the same mailAddress was found ...User result:'+record.mailAddress);
          console.log("Impossible to create a new user, the email is already used...");
          return res.view('Inscription/CompanyNotCreated', {mailAddress:req.param('UserEmail'),layout:'layout'});
        }
        else {

          var uploadFile = req.file('logo');
          uploadFile.upload({dirname: '../../assets/images/logos', saveAs: req.param('Siret') + ".png"},function onUploadComplete (err, files) { //Upload du logo, si ca se passe bien on passe au reste

            if (err) return res.serverError(err);
            //	IF ERROR Return and send 500 error with error

            var sha1 = require('sha1');
            console.log('No companies with the same email were found...');
            console.log("Attempting to create a new user inside the database...");
            var date = new Date();
            var ActivationUrl = sha1(date.getTime());
            Company.create({
              firstName: req.param('UserFirstName'),
              lastName: req.param('UserLastName'),
              position: req.param('Position'),
              phoneNumber: req.param('PhoneNumber'),
              mailAddress: req.param('UserEmail'),
              password: sha1(req.param('UserPassword')),
              siret:req.param('Siret'),
              companyName:req.param('CompanyName'),
              companyGroup:req.param('CompanyGroup'),
              description:req.param('CompanyDescription'),
              websiteUrl:req.param('CompanyWebsiteUrl'),
              careerUrl:req.param('CompanyCareerUrl'),
              road:req.param('CompanyAddressRoad'),
              complementaryInformation:req.param('complementaryInformation'),
              city:req.param('CompanyAddressCity'),
              postCode:req.param('CompanyPostCode'),
              country:req.param('CompanyCountry'),
              logoPath:req.param('Siret') + ".png",
              /* bFirstName: req.param('BUserFirstName'), Il ne faut pas le mettre là mais dans le bon de commande
               bLastName: req.param('BUserLastName'),
               bPosition: req.param('BPosition'),
               bPhoneNumber: req.param('BPhoneNumber'),s
               bMailAddress: req.param('BUserEmail'), */
              active:0,
              activationUrl:ActivationUrl
            },function (err, created) {
              if (!err) {
                console.log('[INFO] User created ;) : ' + created.firstName + ' ' + created.lastName);

                //Sending an activation email to the new created user
                var nodemailer = require("nodemailer");

                // create reusable transport method (opens pool of SMTP connections)
                var smtpTransport = nodemailer.createTransport("SMTP",{
                  service: "Gmail",
                  auth: {
                    user: "club.montagne@amicale-insat.fr",
                    pass: "insamontagne1"
                  }
                });

                // setup e-mail data with unicode symbols
                var mailOptions = {
                  from: "Pierre Hardy <pierre.hardy5@gmail.com>", // sender address
                  to: req.param('UserEmail'), // list of receivers
                  subject: "Message de confirmation de l'inscription", // Subject line
                  text: "Bonjour "+req.param('UserFirstName')+",\n\nVous êtes bien inscris sur notre site internet, vous pouvez maintenant activer votre compte à l'adresse suivante:\n"+"http://localhost:1337/Company/ActivateCompany?url="+ActivationUrl+"&email="+req.param('UserEmail')+"\nA très bientot !\nL'équipe de localhost.", // plaintext body
                  html: "" // html body
                };

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function(error, response){
                  if(error)
                    console.log(error);
                  else
                    console.log("Message sent: " + response.message);
                  smtpTransport.close();
                });

                // We show a positive result to the CompanySpace created
                return res.view('Inscription/UserCreated', {firstName: created.firstName,layout:'layout'});
              }
              else {
                console.log('Error while creating a new CompanySpace. Error: ' + err);
                return res.view('404', {error: err});
              }
            });
          });
        }
      }
      else {
        console.log('A problem occured during search for existing companies. Error: '+err);
      }
    });
  },




  //AuthentificateCompany: Check the email/password request sent by user and allow or not to set an Authentified User
  AuthentificateCompany:function(req,res){
    console.log('User try to authentificate... Email: '+req.param('login')+' Password: '+req.param('password'));
    var sha1 = require('sha1');
    Company.findOne({mailAddress:req.param('login'),password:sha1(req.param('password'))}).exec(function(err,record){
      if(!err) {

        if(typeof record !='undefined'){
          // Cas ou on a authentifié un utilisateur
          if(record.active==1){
            console.log('Authentification succeed: '+record.firstName);
            req.session.authenticated=true;
            req.session.mailAddress=record.mailAddress;
            req.session.sessionType = "company";
            req.session.connectionFailed = false;
            req.session.siret= record.siret;

            return res.redirect('/');
          }
          else{
            console.log("CompanySpace not activated...");
            return res.view('Connection_Password/Connection',{error:'Votre compte n\'est pas activé veuillez vous réfférer au mail d\'activation reçu à l\'inscription...',layout:'layout'});
          }
        }
        else
        {
          console.log("Wrong password/email, auth aborted...");
          //return res.view('Connection_Password/Connection',{error:'Mauvaise combinaison mot de passe - email',layout:'layout'});
          return res.view("Connection_Password/Connection", {layout:'layout', companyConnectionFailed:true});
        }
      }
      else
      {
        console.log('Error during authentification...');
        return res.view('500');
      }
    })
  },


  // Show space reserved to members (test page for authentification)
  MemberHomeShow:function(req,res){
    console.log('Showing member space...');
    res.view('CompanySpace/MemberSpace',{layout:'layout'});
  },

  // CompanyLogout: set session var as UnAuthentificated user
  CompanyLogout:function(req,res){
    if(req.session.authenticated){
      console.log("User with email "+ req.session.mailAddress + " disconnected himself.");
      req.session.mailAddress='undefined';
      req.session.authenticated=false;
      res.redirect('/');
    }
    else
    {
      console.log("A unauthenticated user tried to disconnect himself");
      res.view('500');
    }
  },

  // ActivateCompany: check URL request from email confirmation sent after User inscription in order to set Active:1 the Account
  // (this allow the user to connect)
  ActivateCompany:function(req,res){
    if(req.session.authenticated){
      // Error if the user is already authentificated
      res.view('404');
    }
    else
    {
      // Check for valid GET method args in url request: email and url wich are the IDs for confirmation in DB
      if(typeof req.param('url') != 'undefined' && req.param('email') != 'undefined' ){
        // We try to update an existing user to set him Active:1
        console.log("Trying to activate a new user");
        Company.update({mailAddress:req.param('email'),activationUrl:req.param('url'), active:0},{active:1}).exec(function afterwards(err, updated){
          if (err) { // If we hit an error during update
            console.log("Unable to activate user...");
            return res.view('ErrorPage',{layout:'layout',ErrorTitle:'Echec de l\'activation',ErrorDesc:'Erreur lors de la tentative d\'activation: Erreur interne au serveur'})
          }
          else { // We had no error
            if(typeof updated[0] != 'undefined') {
              // If we updated the user with succes
              console.log('A company has been activated: ' + updated[0].mailAddress);
              return res.view('Inscription/UserActivated', {layout: 'layout'});
            }
            else{
              // If the right user wasn't encountered
              console.log("User not find or bad authentification...");
              return res.view('ErrorPage',{layout:'layout',ErrorTitle:'Echec de l\'activation',ErrorDesc:'Erreur lors de la tentative d\'activation: Mauvaise identification ou compte déja actif...'})

            }
          }
        })
      }
      else{
        // If the url doesn't bring args
        console.log("Try for activation without GET args... Aborted.");
        return res.view('404');
      }
    }

  },

  // InitPasswd; We call this function when the user needs to receive a new password by email (because he losts it)
  // This function need POST arg named "email" wich corespond to the attribute Email of the user who need to reset password
  // TODO: This function still no works...
  InitPasswdCompany:function(req,res) {
    // Check if the user exists and we take his old password to create the new
    Company.findOne({mailAdress: req.param('UserAuthEmail')}).exec(function (err, record) {

      if (!err) {

        if (typeof record != 'undefined') {

          // A user with this email was found
          var old_pass = record.password;

          console.log("Old pass: "+old_pass);

          // Creation of a new password from part of the old
          var sha1 = require('sha1');
          var new_pass = sha1(old_pass).substring(0,8);

          // We update the password of the user
          Company.update({mailAdress: req.param('UserAuthEmail')}, {password:sha1(new_pass)}).exec(function afterwards(err, updated) {
            // Log: New password set for an user
            console.log("New password set: "+new_pass);

            Company.findOne({mailAdress: req.param('UserAuthEmail')}).exec(function (err, record) {
              console.log(record.password)
            });

            //Sending an email to the user with the new password
            var nodemailer = require("nodemailer");

            // create reusable transport method (opens pool of SMTP connections)
            var smtpTransport = nodemailer.createTransport("SMTP",{
              service: "Gmail",
              auth: {
                user: "club.montagne@amicale-insat.fr",
                pass: "insamontagne1"
              }
            });

            // setup e-mail data with unicode symbols
            var mailOptions = {
              from: "Pierre Hardy <pierre.hardy5@gmail.com>", // sender address
              to: req.param('UserAuthEmail'), // list of receivers
              subject: "FIE: Réinitialisation du mot de passe", // Subject line
              text: "Bonjour "+updated.firstName+",\n\nVous venez de réinitialiser votre mot de passe, votre nouveau mot de passe est le suivant:\n"+new_pass+"\nPour vous connecter, cliquez ici: http://localhost:1337/CompanySpace/Connexion\nA très bientot !\nL'équipe de localhost.", // plaintext body
              html: "" // html body
            };

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
              if(error){
                console.log(error);
              }else{
                console.log("Message sent: " + response.message);
              }

              smtpTransport.close();
            });

            // We display the confirmation view if reset passwd worked successfully
            return res.view('Inscription/ResetPassOK',{layout:'layout'})

          })
        }

        else {
          // No user was found
          return res.view('ErrorPage', {
            layout: 'layout',
            ErrorTitle: 'Erreur réinitialisation',
            ErrorDesc: 'Aucun utilisateur enregistré avec cet email...'
          });

        }
      }
      else {
        // No user was found
        return res.view('ErrorPage', {
          layout: 'layout',
          ErrorTitle: 'Erreur réinitialisation',
          ErrorDesc: 'Une erreur inconnue est survenue durant la réinitialisation du mot de passe...'
        });
      }

    })
  },

  Profile: function(req,res) {

    Company.findOne({mailAddress:req.session.mailAddress}).exec(function(err,found) {
      if (err)
        return res.negotiate(err);
      if (!found)
        return res.view('errorPage', {layout:'layout', ErrorTitle:"Recherche du profil failed", ErrorDesc:"Etes-vous bien connecté ? Contacter le webmaster si le problème persiste"});
      else {
        return res.view("CompanySpace/Profile", {
          layout:'layout',
          firstName: found.firstName,
          lastName: found.lastName,
          position: found.position,
          phoneNumber: found.phoneNumber,
          mailAddress: found.mailAddress,
          bFirstName: found.bFirstName,
          bLastName: found.bLastName,
          bPosition: found.bPosition,
          bPhoneNumber: found.bPhoneNumber,
          bMailAddress: found.bMailAddress,
          siret: found.siret,
          companyName: found.companyName,
          companyGroup: found.companyGroup,
          logoPath: found.logoPath,
          description: found.description,
          websiteUrl: found.websiteUrl,
          careerUrl: found.careerUrl,
          road: found.road,
          complementaryInformation: found.complementaryInformation,
          postCode: found.postCode,
          city: found.city,
          country: found.country
        });
      }
    });
  },

  CvTheque: function(req, res) {
    return res.view("CompanySpace/CvTheque", {layout:'layout'});
  },

  Command: function(req, res) {
    return res.view("CompanySpace/Command", {layout:'layout'});
  },

  //Modifie une information de l'utilisateur
  setAUserInfo:function(req, res) {

    var data = req.param('data').charAt(0); //Type d'info à modifier

    switch (data) {
      case 'a' :
        var firstName = req.param('firstName');
        var lastName = req.param('lastName');
        var position = req.param('position');
        var phoneNumber = req.param('phoneNumber');
        var mailAddress = req.param('mailAddress');
        //Todo: Verification de firstName;
        Company.update({mailAddress:req.session.mailAddress}, {
          firstName:firstName,
          lastName:lastName,
          position:position,
          phoneNumber:phoneNumber,
          mailAddress:mailAddress
        }).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update firstName."});

          var mailAddress = req.param('mailAddress');
          //Todo: Verification de mailAddress;
          //Différent d'une adresse mail qui existe déjà !
          Company.findOne({mailAddress:mailAddress}).exec(function(err,found){
            if (err)
              return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb trouver si adresse déjà existante."});

            if (!found || found.mailAddress == req.session.mailAddress) {
              Company.update({mailAddress:req.session.mailAddress}, {mailAddress:mailAddress}).exec(function(err, record) {
                if (err)
                  return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update firstName."});

                return res.redirect('/Company/Profile');
              });
            } else {
              return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Cette adresse existe déjà"});
            }
          });
        });
        break;

      case 'f' :
        var bFirstName = req.param('bFirstName');
        var bLastName = req.param('bLastName');
        var bPosition = req.param('bPosition');
        var bPhoneNumber = req.param('bPhoneNumber');
        var bMailAddress = req.param('bMailAddress');

        //Todo: Verification de firstName;
        Company.update({mailAddress:req.session.mailAddress}, {
          bFirstName:bFirstName,
          bLastName:bLastName,
          bPosition:bPosition,
          bPhoneNumber:bPhoneNumber,
          bMailAddress:bMailAddress
        }).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update bFirstName."});

          return res.redirect('/Company/Profile');
        });
        break;

      case 'k' :
        var siret = req.param('siret');
        Company.findOne({siret:siret}).exec(function(err,found){
          if (err)
            return res.negociate(err);

          if (!found) { //C'est bon, c'est pas le siret d'un autre.
            Company.findOne({mailAddress: req.session.mailAddress}).exec(function (err, found) {
              var oldLogoPath = found.logoPath;

              //Todo: Verification de siret;
              Company.update({mailAddress: req.session.mailAddress}, {
                siret: siret,
                logoPath: siret + ".png"
              }).exec(function (err, record) {
                if (err)
                  return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update siret."});
                fs = require('fs');
                oldPath = path.resolve("assets/images/logos", oldLogoPath);
                newPath = path.resolve("assets/images/logos", siret + ".png");
                fs.renameSync(oldPath, newPath);

                setTimeout(function () {
                  return res.redirect('/Company/Profile');
                }, 2000);
              });
            });
          } else {
            return res.redirect('/Company/profile');
          }
        });
        break;

      case 'l' :
        var companyName = req.param('companyName');

        //Todo: Verification de companyName;
        Company.update({mailAddress:req.session.mailAddress}, {companyName:companyName}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update companyName."});

          return res.redirect('/Company/Profile');
        });
        break;

      case 'm' :
        var companyGroup = req.param('companyGroup');

        //Todo: Verification de companyGroup;
        Company.update({mailAddress:req.session.mailAddress}, {companyGroup:companyGroup}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update companyGroup."});

          return res.redirect('/Company/Profile');
        });
        break;

      case 'n' :
        var description = req.param('description');
        //Todo: Verification de description;
        Company.update({mailAddress:req.session.mailAddress}, {description:description}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update description."});

          return res.redirect('/Company/Profile');
        });
        break;

      case 'o' :
        var websiteUrl = req.param('websiteUrl');
        //Todo: Verification de websiteUrl;
        Company.update({mailAddress:req.session.mailAddress}, {websiteUrl:websiteUrl}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update websiteUrl."});

          return res.redirect('/Company/Profile');
        });
        break;

      case 'p' :
        var careerUrl = req.param('careerUrl');
        //Todo: Verification de careerUrl;
        Company.update({mailAddress:req.session.mailAddress}, {careerUrl:careerUrl}).exec(function(err, record) {
          if (err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update careerUrl."});

          return res.redirect('/Company/Profile');
        });
        break;

      case 'q' :
        var road = req.param('road');
        var complementaryInformation = req.param('complementaryInformation');
        var postCode = req.param('postCode');
        var city = req.param('city');
        var country = req.param('country');
        //Todo: Verification de firstName;
        Company.update({mailAddress:req.session.mailAddress}, {
          road:road,
          complementaryInformation:complementaryInformation,
          postCode:postCode,
          city:city,
          country:country
        }).exec(function(err, record) {
          if (err) {
            console.log(err);
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "prb update postaddress."});
          }

          return res.redirect('/Company/Profile');
        });
        break;

      default :
        console.log("Type de data inconnu");
    }

  },

};

