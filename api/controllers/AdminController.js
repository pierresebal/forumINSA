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
      YearSettings.findOrCreate({year:year}).exec(function afterwards(err, record){
        if (err)
          return err;

        return res.view('Admin/YearSettings', {
          layout:'layout',
          year:year,
          inscriptionsAreOpen:found.areInscriptionsOpened,
          inscriptionDeadline:found.inscriptionDeadline,
          forumPrice:record.forumPrice,
          sjdPrice:record.sjdPrice,
          sjdSessionPrice:record.sjdSessionPrice,
          premiumPrice:record.premiumPrice,
          forumPricePME:record.forumPricePME,
          sjdPricePME:record.sjdPricePME,
          sjdSessionPricePME:record.sjdSessionPricePME,
          premiumPricePME:record.premiumPricePME,
          mealPrice:record.mealPrice
        });
      });
    });
  },

  setPrices : function(req, res) {
    var year = new Date().getFullYear;

    YearSettings.findOrCreate({year: year}).exec(function addPrices(err, records) {
      if (err) {
        console.log("year not found and not created");
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
        sjdSessionPricePME: req.param('sjdSessionPricePME'),
        mealPrice: req.param('mealPrice')
      }).exec(function updatePrices(err, updated) {
        if (err) {
          console.log("Price not updated :" + err);
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Error, avez-vous bien rempli tous les champs ?"});
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

        return res.redirect('/Admin/YearSettings');
      });
    });
  },

  setInscriptionDeadline : function(req, res) {


    var deadline = new Date(req.param("inscriptionDeadline"));

    console.log("1/ " + req.param("inscriptionDeadline"));
    console.log("2/ " + deadline);

    GeneralSettings.update({id:1}, {inscriptionDeadline:deadline}).exec(function afterwards(err){
      if (err)
        return err;

      return res.redirect('/Admin/YearSettings');
    });
  }
};

