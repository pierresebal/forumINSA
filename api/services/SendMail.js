// Service which contain a function able to send a mail

module.exports ={

  sendEmail: function(mailparam){

    // Exemple to use this function inside a controller:
    /*
    SendMail.sendEmail({
      destAddress: req.param('UserEmail'),
      objectS: "Message de confirmation de l'inscription",
      messageS: "Bonjour "+req.param('UserFirstName')+",\n\nVous êtes bien inscris sur notre site internet, vous pouvez maintenant activer votre compte à l'adresse suivante:\n"+"http://localhost:1337/Company/ActivateCompany?url="+ActivationUrl+"&email="+req.param('UserEmail')+"\nA très bientot !\nL'équipe de localhost.", // plaintext body
      messageHTML: ""
    });
    */

    //Sending an activation email to the new created user
    var nodemailer = require("nodemailer");

    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP",{
      service: sails.config.configFIE.FIEmailService,
      auth: {
        user: sails.config.configFIE.FIEmailAddress,
        pass: sails.config.configFIE.FIEmailPassword
      }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: sails.config.configFIE.FIEmailAddress, // sender address
      to: mailparam.destAddress, // list of receivers
      subject: mailparam.objectS, // Subject line
      text: mailparam.messageS, // text body
      html: mailparam.messageHTML, // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error) {
        console.log(error);
      }
      smtpTransport.close();
    });
    


  }

};
