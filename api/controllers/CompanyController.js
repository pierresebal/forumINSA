/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var path = require('path');

module.exports = {


  //CreateCompany: Function that create a new user Company into the DB and send him a confirmation email (with confirmation URL)
  CreateCompany:function(req,res){
    // TODO: finish information check

    // var for redirecting decision
    var POSTerror = false;

    // Creation of a table with all fields form POST form
    // The fields are in the same order as in the file Inscription.ejs
    var data_tab = [
      req.param('isPME'),
      req.param('Siret'),
      req.param('CompanyName'),
      req.param('CompanyGroup'),
      "none", // Field for the logo of the company, we don't harvest any data from this
      req.param('CompanyDescription'),
      req.param('CompanyWebsiteUrl'),
      req.param('CompanyCareerUrl'),
      req.param('CompanyAddressRoad'),
      req.param('complementaryInformation'),
      req.param('CompanyPostCode'),
      req.param('CompanyAddressCity'),
      req.param('CompanyAddressCountry'),
      req.param('UserFirstName'),
      req.param('UserLastName'),
      req.param('Position'),
      req.param('PhoneNumber'),
      req.param('UserEmail'),
      req.param('UserPassword'),
    ];

    // Chack for errors.
    var posterr = [
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false"
    ];

    // Check for mandatory fields completion
    // Mandatory fields exists
    if( typeof req.param("isPME")!= 'undefined' && typeof req.param("Siret")!= 'undefined' && typeof req.param("CompanyName")!= 'undefined' && typeof req.param ("CompanyAddressRoad")!= 'undefined' && typeof req.param("CompanyPostCode")!= 'undefined' && typeof req.param("CompanyAddressCity")!="undefined" && typeof req.param("CompanyAddressCountry") !="undefined" && typeof req.param("UserFirstName") != "undefined" && typeof req.param("UserLastName") != "undefined" && typeof req.param("Position")!="undefined" && typeof req.param("PhoneNumber") != "undefined" && typeof req.param("UserEmail")!="undefined" && typeof req.param("UserPassword")!="undefined")
    {
      // Check for the length and content of fields

      // Table with regex objects used to check the data_tab
      // "none" means that no rules are applied
      var Regex = require("regex");
      var regex_tab = [
        new Regex("(true)|(false)"), // isPME
        new Regex("[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{5}"), // Siret
        "none", // company Name
        "none", // Company Group
        "none", // Company logo
        "none", // Company Description
        new Regex("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})"), // Url
        new Regex("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})"), // Url
        new Regex("#[a-z]#"), // Adresse (route)
        "none", // Adresse (complement)
        new Regex("([A-Z]+[A-Z]?\-)?[0-9]{1,2} ?[0-9]{3}"), // Postal Code
        "none", // City
        "none", // Country
        "none", // User name
        "none", // User name
        "none", // POsition
        new Regex("^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$"), // Phone number
        new Regex("^\S+@(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$"), // Mail
        new Regex("^[\S\s]{0,50}"), // Password
      ];


      // Table with min length
      // Set here the maximum length of each fields
      var minlength_tab = [
        0,//isPME
        0,//siret
        1,//CompanyName'
        0,//CompanyGroup
        0,// CompanyLogo
        0,//CompanyDescription
        0,//CompanyWebsiteUrl
        0,//CompanyCareerUrl
        0,//CompanyAddressRoad
        0,//complementaryInformation
        0,//CompanyAddressPostalCode
        0,//CompanyAddressCity
        0,//CompanyAddressCountry
        0,//UserFirstName
        0,//UserLastName
        1,//Position
        0,//phoneNumber
        0,//UserMail
        6,//UserPassword
      ];

      // Table with max length
      // Set here the max length of each fields
      var maxlength_tab = [
        5,//isPME
        17,//siret
        50,//CompanyName'
        50,//CompanyGroup
        50,// CompanyLogo
        500,//CompanyDescription
        200,//CompanyWebsiteUrl
        200,//CompanyCareerUrl
        50,//CompanyAddressRoad
        50,//complementaryInformation
        6,//CompanyAddressPostalCode
        200,//CompanyAddressCity
        50,//CompanyAddressCountry
        50,//UserFirstName
        50,//UserLastName
        50,//Position
        13,//phoneNumber
        150,//UserMail
        500,//UserPassword
      ];



      for ( var i=0; i<=18; i++){
        // We check the field i
        if (typeof data_tab[i] != "undefined") {
          // Validation of length
          if (data_tab[i].length >= minlength_tab[i] && data_tab[i].length <= maxlength_tab[i]) {
            if (typeof data_tab[i] != 'string') {
              // Validation of entry by regular expressions
              if (!regex_tab[i].test(data_tab[i])) {
                // Field not validated
                POSTerror = true;
                posterr[i] = "true";
              }
            }
          }
          else
          {
            POSTerror = true;
            posterr[i] = "true";
            console.log("error");
          }
        }
        // We skip to the next field
      }
    }
    // Mandatory fields seems to not exist
    else
    {
      console.log("il manque des champ obligatoires: " + posterr + " || " + data_tab)
      POSTerror = true;
    }

    // En cas d'erreur rencontrée, on affiche une page d'erreur
    if(POSTerror){
      return res.view('Inscription/Inscription',{layout:'layout',POSTerror,posterr, data_tab})
    }

    // On regarde qu'il n'y a pas d'entrerpise avec le même email déja enregistrées
    Company.findOne({mailAddress:req.param('UserEmail')}).exec(function(err,record){
      // La recherche n'a pas posé de problèmes
      if (!err) {

        // Entreprise trouvée => On retourne une erreur à l'inscription
        if (typeof record !='undefined') {
          console.log('A company with the same mailAddress was found ...User result:'+record.mailAddress);
          console.log("Impossible to create a new user, the email is already used...");
          return res.view('Inscription/CompanyNotCreated', {layout:'layout',Email:record.mailAddress});
        }

        // Pas d'entrepise trouvée => Ajout ds la BDD
        else {

          var uploadFile = req.file('logo');
          uploadFile.upload({dirname: '../../assets/images/logos', saveAs: req.param('Siret') + ".png"},function onUploadComplete (err, files) { //Upload du logo, si ca se passe bien on passe au reste

            if (err) return res.serverError(err);
            //	IF ERROR Return and send 500 error with error

            // Création du lien d'activation (sha1 sur chrono courrant du serveur)
            var sha1 = require('sha1');
            var date = new Date();
            var ActivationUrl = sha1(date.getTime());

            // Ajout de l'entreprise dans la BDD
            Company.create({
              firstName: req.param('UserFirstName'),
              lastName: req.param('UserLastName'),
              position: req.param('Position'),
              phoneNumber: req.param('PhoneNumber'),
              mailAddress: req.param('UserEmail'),
              password: req.param('UserPassword'),
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
              country:req.param('CompanyAddressCountry'),
              logoPath:req.param('Siret') + ".png",
              isPME:req.param('isPME'),
              /* bFirstName: req.param('BUserFirstName'), Il ne faut pas le mettre là mais dans le bon de commande
               bLastName: req.param('BUserLastName'),
               bPosition: req.param('BPosition'),
               bPhoneNumber: req.param('BPhoneNumber'),
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
                  if(error) {
                    console.log(error);
                  }
                  smtpTransport.close();
                });

                // We show a positive result to the CompanySpace created
                return res.view('Inscription/UserCreated', {firstName: created.firstName,layout:'layout'});
                console.log("Company created: "+req.param("UserEmail"));

              }
              else {
                console.log('Error while creating a new CompanySpace. Error: ' + err);
                return res.view('404', {error: err});
              }
            });
          });
        }
      }

      // La recherche d'une Cie a posé un problème
      else {
        console.log('A problem occured during search for existing companies. Error: '+err);
      }
    });
  },

  //AuthentificateCompany: Check the email/password request sent by user and allow or not to set an Authentified User
  AuthentificateCompany:function(req,res){
    console.log('User try to authentificate... Email: '+req.param('login')+' Password: '+req.param('password'));
    var sha1 = require('sha1');
    // Looking for IDs in the database
    Company.findOne({mailAddress:req.param('login'),password:sha1(req.param('password'))}).exec(function(err,record){
      // Good IDs for authentication
      if(!err) {
        if(typeof record !='undefined'){

          // User authenticated and active
          if(record.active==1){
            // We set up session variables
            req.session.authenticated=true;
            req.session.mailAddress=record.mailAddress;
            req.session.sessionType = "company";
            req.session.connectionFailed = false;
            req.session.siret= record.siret;
            req.session.companyName=record.companyName;

            // We confirm the authentication
            console.log('Authentification succeed: '+record.firstName);
            return res.redirect('/Company/MemberSpace');
          }

          // User authenticated but not active
          else{
            console.log("CompanySpace not activated...");
            return res.view('Connection_Password/Connection',{error:'Votre compte n\'est pas activé veuillez vous réfférer au mail d\'activation reçu à l\'inscription...',layout:'layout'});
          }
        }
        // Bad IDs for authentication
        else
        {
          console.log("Wrong password/email, auth aborted...");
          //return res.view('Connection_Password/Connection',{error:'Mauvaise combinaison mot de passe - email',layout:'layout'});
          return res.view("Connection_Password/Connection", {layout:'layout', companyConnectionFailed:true});
        }
      }
      // Bad IDs for authentication
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
    res.view('CompanySpace/CompanySpace',{layout:'layout'});
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
      // Check for valid GET args in url request: email and url wich are the IDs for confirmation in DB
      if(typeof req.param('url') != 'undefined' && req.param('email') != 'undefined' ){
        // We try to update an existing user to set him Active:1
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
  InitPasswdCompany:function(req,res) {
    // Check if the user exists and we take his old password to create the new
    Company.findOne({mailAddress: req.param('UserAuthEmail')}).exec(function (err, record) {

      if (!err) {
        // An user has been found in the DB
        if (typeof record != 'undefined') {

          // We take the old pass to make a new one
          var old_pass = record.password;
          var sha1 = require('sha1');
          var new_pass = sha1(old_pass).substring(0,8);

          // We update the password in the DB
          Company.update({mailAddress: req.param('UserAuthEmail')}, {password:sha1(new_pass)}).exec(function afterwards(err, updated) {

            if(!err) {
              //Sending an email to the user with the new password
              var nodemailer = require("nodemailer");

              // create reusable transport method (opens pool of SMTP connections)
              var smtpTransport = nodemailer.createTransport("SMTP", {
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
                text: "Bonjour " + updated.firstName + ",\n\nVous venez de réinitialiser votre mot de passe, votre nouveau mot de passe est le suivant:\n" + new_pass + "\nPour vous connecter, cliquez ici: http://localhost:1337/CompanySpace/Connexion\nA très bientot !\nL'équipe de localhost.", // plaintext body
                html: "" // html body
              };

              // send mail with defined transport object
              smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Message sent: " + response.message);
                }

                smtpTransport.close();
              });

              // We display the confirmation view if reset passwd worked successfully
              return res.view('Connection_Password/ResetPassOK', {layout: 'layout'})
            }
          })
        }
        // No user was found in DB, we send an error message
        else {
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
    var year = new Date().getFullYear();
    GeneralSettings.findOne({year:year}).exec(function giveInfo(err, record){
      return res.view("CompanySpace/Command", {
        layout:'layout',
        year:year,
        forumPrice:record.forumPrice,
        sjdPrice:record.sjdPrice,
        sjdSessionPrice:record.sjdSessionPrice,
        premiumPrice:record.premiumPrice
      });
    });
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

