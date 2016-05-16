/**
 * SellsController.jsController
 *
 * @description :: Server-side logic for managing sellscontroller.js
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  addASell :  function (req,res) {

    var year = new Date().getFullYear();

    Sells.findOne({companySiret:req.session.siret, year:year}).exec(function afterwards(err,found){
      if (err)
        return err;
      if (found)
        return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Commande déjà passée. Contacter le webmaster en cas de problème"});

      if (!found) {
        YearSettings.findOne({year:year}).exec(function afterwards(err,found) {
          if (err)
            return err;
          if (!found)
            return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Les prix n'ont pas encore été définis pour cette année"});


          /* Traitement des informations de ventes */
          var forum, forumPrice, sjd, sjdPrice, premiumPack, premiumPackPrice, moreSjd, moreSjdPrice;

          if (typeof req.param("numberSjdSession") == 'undefined' || req.param("numberSjdSession") == "")
            moreSjd = 0;
          else
            moreSjd = req.param("numberSjdSession");

          if (req.param("Command") == "forum") {
            forum = true;
            sjd = false;
            premiumPack = false;
          } else if (req.param("Command") == "sjd") {
            forum = false;
            sjd = true;
            premiumPack = false;
          } else if (req.param("Command") == "premium") {
            forum = false;
            sjd = false;
            premiumPack = true;
          } else {
            return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Commande non comprise", ErrorDesc:"<a href=\"/Company/Command\">Réessayer ?</a>"});
          }

          if (req.session.isPME) {
            forumPrice = found.forumPricePME;
            sjdPrice = found.sjdPricePME;
            premiumPackPrice = found.premiumPricePME;
            moreSjdPrice = found.sjdSessionPricePME;
          } else {
            forumPrice = found.forumPrice;
            sjdPrice = found.sjdPrice;
            premiumPackPrice = found.premiumPrice;
            moreSjdPrice = found.sjdSessionPrice;
          }

          /* Create de la vente */
          Sells.create({
            year:year,
            companySiret:req.session.siret,
            isPME:req.session.isPME,
            forum:forum,
            forumPrice:forumPrice,
            sjd:sjd,
            sjdPrice:sjdPrice,
            premiumPack:premiumPack,
            premiumPackPrice:premiumPackPrice,
            moreSjd:moreSjd,
            moreSjdPrice:moreSjdPrice
          }).exec(function afterwards(err,created){
            if (err)
              return err;

            //Todo : Envoyer un mail avec la facture et la stocker
            

            return res.view("CompanySpace/CommandSent", {layout:"layout"});
          });
        });
      }
    });

  }

};

