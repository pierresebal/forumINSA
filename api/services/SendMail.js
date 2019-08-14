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

    var copie = mailparam.Bcc ? mailparam.Bcc : '';

    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: sails.config.configFIE.FIEmailAddress, // sender address
      to: mailparam.destAddress, // list of receivers
      bcc: copie,
      subject: mailparam.objectS, // Subject line
      text: mailparam.messageS, // text body
      html: '<!DOCTYPE html><html>'
      + '<head>'
      + '<meta charset="utf-8" />'
      + '<title>Mail de la part de l\'équipe du Forum by INSA</title>'
      + '</head>'
      //+'<style type="text/css"> h1,p{color:#333333;}</style>'
      + '<body style="width:80%;margin-left:auto;margin-right:auto;margin-top:0px">'

        // header
        + '<div '
        + 'style="background-image: linear-gradient(to bottom right, #0070C0, #00C057);'
        + 'height:150px;width:100%;overflow:hidden;border-radius:0px 0px 5px 5px"">'
          + '<a href="'+sails.config.configFIE.FIEdomainName+'">'
            + '<img title="Forum by INSA" alt="Forum by INSA" '
            + 'style="height:auto;max-height:95%;margin:15px;" '
            + 'src="https://'+sails.config.configFIE.FIEdomainName+'/images/logo_blanc.png" />'
          + '</a>'
        + '</div>'

        // body
        + '<div style="width:95%;margin:20px;">'
          + '<br/>' 
          +mailparam.messageHTML+''
          + '<br/><br/>' 
        + '</div>' 

        // footer
        + '<div class="pure-g">' 
          + '<div class="pure-u-1 pure-u-md-1 footer">'
            + '<div style="text-align:center" class="center-column">'
              + '<img id="logo-img" width="400" alt="logo" '
              + 'src="https://'+sails.config.configFIE.FIEdomainName+'/images/logo_noir.png" />'
            + '</div>'
          + '</div>'
        + '</div>'
      + '</body>'
      + '</html>', // html body
      attachments: mailparam.attachments
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error) {
        console.log(error);
      }

      console.log('[Sendmail] Mail sent from: '+sails.config.configFIE.FIEmailAddress + ' to: '+mailparam.destAddress);
      smtpTransport.close();
    });

  }
};
