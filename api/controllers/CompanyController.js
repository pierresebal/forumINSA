/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {





  //CreateCompany: Function that create a new user into the DB and send him a confirmation email (with confirmation URL)
  CreateCompany:function(req,res) {
    // TODO: Add verification of the form on controller or view (important: password similars)
    // Checking for existing companies
    Company.findOne({Email:req.param('UserEmail')}).exec(function(err,record){
      if (!err) {
        if (typeof record !='undefined') {
          console.log('A company with the same email was found ...User result:'+record.Email);
          console.log("Impossible to create a new user, the email is already used...");
          return res.view('Company/CompanyNotCreated', {Email:req.param('UserEmail'),layout:'layout'});
        }
        else {
          var sha1 = require('sha1');
          console.log('No companies with the same email were found...');
          console.log("Attempting to create a new user inside the database...");
          var date = new Date();
          var ActivationUrl = sha1(date.getTime());
          Company.create({
            FirstName: req.param('UserFirstName'),
            LastName: req.param('UserLastName'),
            Password: sha1(req.param('UserPassword')),
            Email: req.param('UserEmail'),
            Active:0,
            ActivationUrl:ActivationUrl
          },function (err, created) {
            if (!err) {
              console.log('[INFO] User created ;) : ' + created.FirstName + ' ' + created.LastName);

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
                text: "Bonjour "+req.param('UserFirstName')+",\n\nVous êtes bien inscris sur notre site internet, vous pouvez maintenant activer votre compte a l'adresse suivante:\n"+"http://localhost:1337/Company/ActivateCompany?url="+ActivationUrl+"&email="+req.param('UserEmail')+"\nA très bientot !\nL'équipe de localhost.", // plaintext body
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

              // We show a positive result to the Company created
              return res.view('Company/UserCreated', {FirstName: created.FirstName,layout:'layout'});

            }
            else {
              console.log('Error while creating a new Company. Error: ' + err);
              return res.view('404', {error: err});
            }
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
    console.log('User try to authentificate... Email: '+req.param('UserAuthEmail')+' Password: '+req.param('UserAuthPasswd'));
    var sha1 = require('sha1');
    Company.findOne({Email:req.param('UserAuthEmail'),Password:sha1(req.param('UserAuthPasswd'))}).exec(function(err,record){
      if(!err) {

        if(typeof record !='undefined'){
          // Cas ou on a authentifié un utilisateur
          if(record.Active==1){
            console.log('Authentification succeed: '+record.FirstName);
            req.session.authenticated=true;
            req.session.UserEmail=record.Email;
            return res.redirect(req.param('NextUrl'));          console.log('Authentification succeed: '+record.FirstName);
            req.session.authenticated=true;
            req.session.UserEmail=record.Email;
            return res.redirect(req.param('NextUrl'));
          }
          else{
            console.log("Company not activated...");
            return res.view('Company/AuthGate',{error:'Votre compte n\'est pas activé veuillez vous réfférer au mail d\'activation reçu à l\'inscription...',layout:'layout'});
          }
        }
        else
        {
          console.log("Wrong password/email, auth aborted...");
          return res.view('Company/AuthGate',{error:'Mauvaise combinaison mot de passe - email',layout:'layout'});
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
    res.view('Company/MemberSpace',{layout:'layout'});
  },





  // CompanyLogout: set session var as UnAuthentificated user
  CompanyLogout:function(req,res){
    if(req.session.authenticated){
      console.log("User with email "+ req.session.UserEmail + " disconnected himself.");
      req.session.UserEmail='undefined';
      req.session.authenticated=false;
      res.view('homepage',{layout:'layout'});
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
        Company.update({Email:req.param('email'),ActivationUrl:req.param('url'), Active:0},{Active:1}).exec(function afterwards(err, updated){
          if (err) { // If we hit an error during update
            console.log("Unable to activate user...");
            return res.view('ErrorPage',{layout:'layout',ErrorTitle:'Echec de l\'activation',ErrorDesc:'Erreur lors de la tentative d\'activation: Erreur interne au serveur'})
          }
          else { // We had no error
            if(typeof updated[0] != 'undefined') {
              // If we updated the user with succes
              console.log('A company has been activated: ' + updated[0].Email);
              return res.view('Company/UserActivated', {layout: 'layout'});
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
    Company.findOne({
      Email: req.param('UserAuthEmail'),
      Password: req.param('UserAuthPasswd')
    }).exec(function (err, record) {

      if (!err) {

        if (typeof record[0] != 'undefined') {

          // A user with this email was found
          var old_pass = record[0].Password;

          // Creation of a new password from part of the old
          var sha1 = require('sha1');
          var new_pass = sha1('old_pass').substring(0,8);

          // We update the password of the user
          Company.update({Email: req.param('email')}, {Password:new_pass}).exec(function afterwards(err, updated) {
            console.log("New password set: "+new_pass);
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
          ErrorDesc: 'Aucun utilisateur enregistré avec cet email...'
        });
      }

    })

  }

};

