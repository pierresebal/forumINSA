/**
 * SellsController.jsController
 *
 * @description :: Server-side logic for managing sellscontroller.js
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  addASell :  function (req,res) {

    var year = new Date().getFullYear();

    Sells.findOne({companySiret:req.session.siret, year:year}).exec(function afterwards(err,found1){
      if (err)
        return err;
      if (found1)
        return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Commande déjà passée. Contacter le webmaster en cas de problème"});

      if (!found1) {
        YearSettings.findOne({year:year}).exec(function afterwards(err,found2) {
          if (err)
            return err;
          if (!found2)
            return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Les prix n'ont pas encore été définis pour cette année"});


          /* Traitement des informations de ventes */
          var forum, forumPrice, sjd, sjdPrice, premiumPack, premiumPackPrice, moreSjd, moreSjdPrice;

          if (typeof req.param("numberSjdSession") == 'undefined' || req.param("numberSjdSession") == "" || req.param("Command") == "forum") //S'ils prennent que forum alors ils ne peuvent pas avoir de sessionSJD supplémentaires
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
            forumPrice = found2.forumPricePME;
            sjdPrice = found2.sjdPricePME;
            premiumPackPrice = found2.premiumPricePME;
            moreSjdPrice = found2.sjdSessionPricePME;
          } else {
            forumPrice = found2.forumPrice;
            sjdPrice = found2.sjdPrice;
            premiumPackPrice = found2.premiumPrice;
            moreSjdPrice = found2.sjdSessionPrice;
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


            Company.findOne({siret:req.session.siret}).exec(function afterwards(err,found3){
              if (err)
                return err;

              //Todo : Envoyer un mail avec la facture et la stocker
              var pdf = require('html-pdf');
              var fs = require("fs");

              var contenu = fs.readFileSync('files/facture_template/facture_template.html').toString();
              var date = new Date();

              var companyAddress = found3.road + "<br />" + found3.complementaryInformation;
              if (found3.complementaryInformation !=  "")
                companyAddress = companyAddress + "<br />";
              companyAddress = companyAddress + found3.postCode + " " + found3.city + "<br />" + found3.country;

              var product, productPrice;
              if (forum == true) {
                product = "Stand taille unique (2 repas inclus)";
                productPrice = forumPrice;
              } else if (sjd == true) {
                product = "Speed Job Dating (? repas inclus)";
                productPrice = forumPrice;
              } else if (premiumPack == true) {
                product = "Pack premium (stand + sjd)";
                productPrice = forumPrice;
              }


              contenu = contenu.replace("@year", date.getFullYear());
              contenu = contenu.replace("@billNumber", (date.getMonth()+1).toString() + date.getFullYear().toString());
              contenu = contenu.replace("@date", date.getDate() +"/" + (date.getMonth()+1).toString() + "/" + date.getFullYear());
              contenu = contenu.replace("@companyName", found3.companyName);
              contenu = contenu.replace("@companyAddress", companyAddress);
              contenu = contenu.replace("@forum", product);
              contenu = contenu.replace("@forumPrice", productPrice);
              contenu = contenu.replace("@forumPrice", productPrice);
              contenu = contenu.replace("@sjdQuantity", moreSjd);
              contenu = contenu.replace("@sjdPrice", moreSjdPrice);
              contenu = contenu.replace("@totalSjdPrice", moreSjd * moreSjdPrice);
              contenu = contenu.replace("@totalTTC", productPrice + moreSjd * moreSjdPrice);

              var options = {format:'A4', orientation: "portrait", border:"1cm"};
              pdf.create(contenu, options).toFile('files/facture_template/test.pdf', function afterwards (err) {
                if (err)
                  console.log("Erreur :'(");

                return res.view("CompanySpace/CommandSent", {layout:"layout"});
              });
            });
          });
        });
      }
    });

  }

};

