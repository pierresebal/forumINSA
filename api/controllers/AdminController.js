/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  adminLogin : function(req, res) {

    if (req.param('password') == "adminOnlyTMTC")
      req.session.isAdmin = true;
    else
      req.session.isAdmin = false;

    return res.redirect("/Admin");
  },

  displayYearSettings : function(req, res) {

    GeneralSettings.findOrCreate({id:1}).exec(function afterwards(err, found){
      if (err)
        return err;

      var year = new Date().getFullYear();
      return res.view('Admin/YearSettings', {layout:'layout', year:year, inscriptionsAreOpen:found.areInscriptionsOpened});
    });
  },

  setPrices : function(req, res) {
    var year = new Date();

    YearSettings.findOrCreate({year: year.getFullYear()}).exec(function addPrices(err, records) {
      if (err) {
        console.log("year not found and not created")
        return;
      }

      YearSettings.update({year: records.year}, {
        forumPrice: req.param('forumPrice'),
        sjdPrice: req.param('sjdPrice'),
        premiumPrice: req.param('premiumPrice'),
        sjdSessionPrice: req.param('sjdSessionPrice'),
        forumPricePME: req.param('forumPricePME'),//PME
        sjdPricePME: req.param('sjdPricePME'),
        premiumPricePME: req.param('premiumPricePME'),
        sjdSessionPricePME: req.param('sjdSessionPricePME')
      }).exec(function updatePrices(err, updated) {
        if (err) {
          console.log("Price not updated :" + err);
          return;
        }

        console.log("Modifications faites pour l'année " + records.year + " ajouté !");
        return res.redirect('/Admin/YearSettings');
      });
    });
  },

  setInscriptionOpen : function(req,res) {
    GeneralSettings.findOrCreate({id:1}).exec(function afterwards(err,found){
      if (err)
        return err;

      var areOpened;
      if (req.param('inscriptions') == 1)
        areOpened = true;
      else
        areOpened = false;

      GeneralSettings.update({id:1}, {areInscriptionsOpened:areOpened}).exec(function afterwards(err){
        if (err)
          return err;

        return res.redirect('/Admin/YearSettings')
      });
    });
  }
};

