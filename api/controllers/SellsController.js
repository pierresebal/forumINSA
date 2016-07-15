/**
 * SellsController.jsController
 *
 * @description :: Server-side logic for managing sellscontroller.js
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  addASell :  function (req,res) {

    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    month++;

    if (req.param('cgu') != 'on')
      return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Les conditions de ventes n'ont pas été validées."});

    Sells.findOne({companySiret:req.session.siret, year:year}).exec(function afterwards(err,found1){
      if (err)
        return err;
      if (found1)
        return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Commande déjà passée.", ErrorDesc:"Vous pouvez consulter votre facture dans votre espace personnel. Contacter le webmaster en cas de problème."});

      if (!found1) {
        YearSettings.findOne({year:year}).exec(function afterwards(err,found2) {
          if (err)
            return err;
          if (!found2)
            return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Les prix n'ont pas encore été définis pour cette année"});


          /* Traitement des informations de ventes */
          var forum, forumPrice, sjd, sjdPrice, premiumPack, premiumPackPrice, moreSjd, moreSjdPrice;

          if (typeof req.param("numberSjdSession") == 'undefined' || req.param("numberSjdSession") == "" || req.param("Command") == "forum" || Number(req.param('numberSjdSession')) <= 0) //S'ils prennent que forum alors ils ne peuvent pas avoir de sessionSJD supplémentaires
            moreSjd = 0;
          else
            moreSjd = Number(req.param("numberSjdSession"));

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

          var moreMeal = 0
          if (typeof req.param('moreMeal') == 'undefined' || req.param('moreMeal') == "" || Number(req.param('moreMeal') <= 0))
            moreMeal = 0;
          else
            moreMeal = Number(req.param("moreMeal"));
          var mealPrice = found2.mealPrice;

          GeneralSettings.findOne({id:1}).exec(function getBillNumber(err, found){
            if (err)
              return err;

            //Creation du numéro de facture entier
            var fullBillNumber = found.billNumberMonth * 1000000 + month * 10000 + year;

            /* Creation de la vente */
            Sells.create({
              year:year,
              companySiret:req.session.siret,
              companyName:req.session.companyName,
              isPME:req.session.isPME,
              forum:forum,
              forumPrice:forumPrice,
              sjd:sjd,
              sjdPrice:sjdPrice,
              premiumPack:premiumPack,
              premiumPackPrice:premiumPackPrice,
              moreSjd:moreSjd,
              moreSjdPrice:moreSjdPrice,
              moreMeal:moreMeal,
              mealPrice:mealPrice,
              billNumber:fullBillNumber
            }).exec(function afterwards(err,created){
              if (err) {
                return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Une erreur s'est produite", ErrorDesc:"<a href=\"/Company/Command\">Réessayez </a> ou contactez l'équipe."});
              }

              GeneralSettings.update({id:1}, {billNumberMonth:found.billNumberMonth+1}).exec(function billNumberDidUpdate(err, updated) {

                if (err)
                  return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Une erreur s'est produite", ErrorDesc:"<a href=\"/Company/Command\">Réessayez </a> ou contactez l'équipe."});

                //Récupération des infos de l'entreprise pour remplir la facture
                Company.findOne({siret:req.session.siret}).exec(function afterwards(err,found3){
                  if (err)
                    return err;

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
                    product = "Forum Stand taille unique (3 repas inclus)";
                    productPrice = forumPrice;
                  } else if (sjd == true) {
                    product = "Speed Job Dating (1 repas/recruteur inclu)";
                    productPrice = sjdPrice;
                  } else if (premiumPack == true) {
                    product = "Pack premium (stand + sjd)";
                    productPrice = premiumPackPrice;
                  }

                  // Création de la facture en format HTML
                  contenu = contenu.replace("@year", date.getFullYear());
                  contenu = contenu.replace("@billNumber", fullBillNumber.toString());
                  contenu = contenu.replace("@date", date.getDate() +"/" + (date.getMonth()+1).toString() + "/" + date.getFullYear());
                  contenu = contenu.replace("@companyName", found3.companyName);
                  contenu = contenu.replace("@siret", req.session.siret);
                  contenu = contenu.replace("@companyAddress", companyAddress);
                  contenu = contenu.replace("@forum", product);
                  contenu = contenu.replace("@forumPrice", productPrice);
                  contenu = contenu.replace("@forumPrice", productPrice);
                  contenu = contenu.replace("@sjdQuantity", moreSjd);
                  contenu = contenu.replace("@sjdPrice", moreSjdPrice);
                  contenu = contenu.replace("@totalSjdPrice", moreSjd * moreSjdPrice);
                  contenu = contenu.replace("@moreMeal", moreMeal);
                  contenu = contenu.replace("@mealPrice", mealPrice);
                  contenu = contenu.replace("@totalMealPrice", moreMeal * mealPrice);
                  contenu = contenu.replace("@totalTTC", productPrice + moreSjd * moreSjdPrice + moreMeal * mealPrice);

                  var options = {format:'A4', orientation: "portrait", border:"1cm"};

                  pdf.create(contenu, options).toFile('files/factures/' + year + '/' + req.session.siret + '.pdf', function afterwards (err) {
                    if (err) {
                      console.log("Erreur :'( " + err);
                      return res.view("ErrorPage", {layout:"layout", ErrorTitle:"Une erreur a eu lieu lors de l'édition de la facture", ErrorDesc:"Contactez le webmaster à l'adresse contact@foruminsaentreprises.fr"});
                    }

                    //Envoi du mail de facture
                    SendMail.sendEmail({
                      destAddress: req.session.mailAddress,
                      Bcc: "contact@foruminsaentreprises.fr",
                      objectS: "Confirmation de commande",
                      messageS: "\n\nBonjour,"
                      + "\n\nNous vous confirmons que la commande de prestation pour le FIE a été prise en compte. Vous trouverez ci-joint la facture correspondante."
                      + "\n\nSi vous souhaitez modifier votre commande, merci de nous en faire part le plus tôt possible à l’adresse suivante : contact@foruminsaentreprises.fr"
                      + "\n\nDans le cas où le plan vigipirate serait maintenu, vous serez recontactés peu de temps avant le forum afin d'enregistrer les noms de vos représentants. Une pièce d'identité vous sera alors nécessaire."
                      + "\n\nLe paiement doit être fait avant le 18 octobre 2016 par virement (RIB en pièce jointe) ou par chèque à l'ordre du FORUM INSA ENTREPRISES et envoyé à l'adresse :"
                      + "\nAmicale - Forum INSA Entreprises"
                      + "\n135 Avenue de rangueil,"
                      + "\n31400 Toulouse FRANCE"
                      + "\n\nNous vous remercions pour votre participation et avons hâte de vous rencontrer le 18 octobre prochain !"
                      + "\n\nCordialement,\nL'équipe FIE 2016", // plaintext body
                      messageHTML: "<br /><br />Bonjour,"
                      + "<br /><br />Nous vous confirmons que la commande de prestation pour le FIE a été prise en compte. Vous trouverez ci-joint la facture correspondante."
                      + "<br /><br />Si vous souhaitez modifier votre commande, merci de nous en faire part le plus tôt possible à l’adresse suivante : contact@foruminsaentreprises.fr"
                      + "<br /><br />Dans le cas où le plan vigipirate serait maintenu, vous serez recontactés peu de temps avant le forum afin d'enregistrer les noms de vos représentants. Une pièce d'identité vous sera alors nécessaire."
                      + "<br /><br />Le paiement doit être fait avant le 18 octobre 2016 par virement (RIB en pièce jointe) ou par chèque à l'ordre du FORUM INSA ENTREPRISES et envoyé à l'adresse :"
                      + "<br />Amicale - Forum INSA Entreprises"
                      + "<br />135 Avenue de rangueil,"
                      + "<br />31400 Toulouse FRANCE"
                      + "<br /><br />Nous vous remercions pour votre participation et avons hâte de vous rencontrer le 18 octobre prochain !"
                      + "<br /><br />Cordialement,<br />L'équipe FIE 2016",
                      attachments : [{filename:'facture.pdf', filePath:'files/factures/' + year + '/' + req.session.siret + '.pdf'}, {filename:'RIB-FIE.pdf', filePath:'files/facture_template/RIB-FIE.pdf'}]
                    });

                    return res.view("CompanySpace/CommandSent", {layout:"layout"});
                  });
                });
              });
            });
          });
        });
      }
    });
  }
};
