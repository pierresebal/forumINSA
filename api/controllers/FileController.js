/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var path = require('path');

module.exports = {

  upload: function  (req, res) {
    if(req.method === 'GET')
      return res.view('ErrorPage', {layout:'layout', ErrorTitle:"Access denied", ErrorDesc:"Vous ne pouvez pas accéder à cette page de cette façon"});
    //	Call to /upload via GET is error
    var file, prefix;

    if (req.param('language') == 'fr') {
      file = "fr-cv";
      prefix = "cv_fr_";
    } else if (req.param('language') == 'en') {
      file = "en-cv";
      prefix = "cv_en_";
    } else {
      console.log("language : " + req.param('language') + " " + req.param('fr-cv'));
      return res.view('ErrorPage', {layout:'layout', ErrorTitle:"Erreur lors de l'upload", ErrorDesc:"Votre CV n'est ni uploadé en anglais ni en français"});
    }

    var uploadFile = req.file(file);
    var fileName = prefix + req.session.login + ".pdf";

    uploadFile.upload({dirname: '../../files/'+file, saveAs: fileName},function onUploadComplete (err, files) {
      //	Files will be uploaded to .tmp/uploads

      if (err) return res.serverError(err);
      //	IF ERROR Return and send 500 error with error

      //Ajout de l'url dans la database
      if (file=="fr-cv") {
        Student.update({login: req.session.login}, {frCVPath:fileName}).exec(function afterwards(err,updated) {
          if (err) {
            return;
          }

          console.log("Probleme pour update le fr-cv")
        });

      } else if (file=="en-cv") {
        Student.update({login: req.session.login}, {enCVPath:fileName}).exec(function afterwards(err,updated) {
          if (err) {
            console.log("Probleme pour update le en-cv")
            return;
          }


        });
      }

      console.log("c'est bon, redirection");

      setTimeout(function() { //Attends 1 seconde le temps que la bdd s'actualise
        return res.redirect('/Student/Profile');
      }, 1000);
    });
  },

  download: function(req, res) {

    var fileFr ="", fileEn="";
    // Get the URL of the file to download
    Student.findOne({login:req.session.login}, function (err, record) {
      if (err)
        return res.view("ErrorPage", {layout:'layout', ErrorTitle:"Erreur téléchargement", ErrorDesc:"Nous n'avons pas trouvé votre profil."});
      fileFr = record.frCVPath;
      fileEn = record.enCVPath;
      console.log("Trouvé cv-fr : " + fileFr + " cv-en :" + fileEn);

      var filePath;
      if (req.param('dl') == "fr") {
        filePath = path.resolve("files/fr-cv", fileFr.toString());
      } else if (req.param('dl') == "en") {
        filePath = path.resolve("files/en-cv", fileEn.toString());
      }

      console.log("filePath : " + filePath);

      // Should check that it exists here, but for demo purposes, assume it does
      // and just pipe a read stream to the response.
      //fs.createReadStream(filePath).pipe(res);
      res.download(filePath);

    });

  }
};

