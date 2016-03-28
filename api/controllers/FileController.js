/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
    console.log(uploadFile);

    uploadFile.upload({dirname: '../../files/'+file, saveAs: prefix + req.session.login + ".pdf"},function onUploadComplete (err, files) {
      //	Files will be uploaded to .tmp/uploads

      if (err) return res.serverError(err);
      //	IF ERROR Return and send 500 error with error

      //Ajout de l'url dans la database
      /* if (file=="fr-cv") {
        Student.update({login: req.session.login}, {frCVPath:});

      } else if (file=="en-cv") {

      } */

      console.log("c'est bon, redirection");
      return res.redirect('/Student/Profile');
    });
  },

};

