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
      html: '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Mail de la part de l\'équipe du Forum INSA Entreprise</title></head><style type="text/css">h1,p{color:#333333;}</style><body style="width:80%;margin-left:auto;margin-right:auto; border:1px solid; border-radius:25px;"><div style="background-color:#333333;height:150px;width:100%;overflow:hidden;border-radius:25px 25px 0px 0px"><a href="'+sails.config.configFIE.FIEdomainName+'"><img title="Forum INSA Entreprises" alt="Forum INSA Entreprises" style="height:auto;max-height:90%;margin:15px;" src="'+sails.config.configFIE.FIEdomainName+'/images/Logo_FIE_blanc.png"></img></a></div><div style="height:100%;width:100%;margin:20px;">'+ mailparam.messageHTML +"<br/><br/></div></body></html>", // html body
      attachments: mailparam.attachments
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
