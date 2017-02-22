/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  trackLogin: function (req, res) {
    if (req.param('password') === sails.config.configFIE.trackPassword) {
      req.session.isTrack = true
    } else {
      req.session.isTrack = false
    }

    return res.redirect('/Track')
  },

  displayYearSettings: function (req, res) {
    GeneralSettings.findOrCreate({id: 1}).exec((err, found) => {
      if (err) {
        return err
      }

      var year = new Date().getFullYear()
      YearSettings.findOrCreate({year: year}).exec((err, record) => {
        if (err) {
          return err
        }

        return res.view('Track/YearSettings', {
          layout: 'layout',
          year: year,
          inscriptionsAreOpen: found.areInscriptionsOpened,
          inscriptionDeadline: found.inscriptionDeadline,
          forumPrice: record.forumPrice,
          sjdPrice: record.sjdPrice,
          sjdSessionPrice: record.sjdSessionPrice,
          premiumPrice: record.premiumPrice,
          forumPricePME: record.forumPricePME,
          sjdPricePME: record.sjdPricePME,
          sjdSessionPricePME: record.sjdSessionPricePME,
          premiumPricePME: record.premiumPricePME,
          mealPrice: record.mealPrice
        })
      })
    })
  },

  displayCompanies: function (req, res) {
    Company.find().exec(function (err, companies) {
      if (err) {
        console.log('error : ' + err)
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Les entreprises ne sont pas récupérées'})
      }

      return res.view('Track/RegisteredCompanies', {layout: 'layout', companies: companies})
    })
  },

  displayACompany: function (req, res) {
    Company.findOne({siret: req.param('siret')}).exec((err, company) => {
      if (err) {
        console.log('error : ' + err)
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "L'entreprise n'est pas récupérée"})
      }

      if (!company) {
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "L'entreprise au siret " + req.param('siret') + " n'existe pas."})
      }

      Sells.find({companySiret: req.param('siret')}).exec((err, sells) => {
        if (err) {
          console.log('error : ' + err)
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Les ventes ne sont pas récupérées'})
        }

        var sellsExist = true
        if (!sells) {
          sellsExist = false
        }

        return res.view('Track/CompanyInfo', {layout: 'layout', company: company, sells: sells, sellsExist: sellsExist})
      })
    })
  },

  displaySells: function (req, res) {
    Sells.find().exec(function (err, sells) {
      if (err) {
        console.log('error : ' + err)
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Erreur: les ventes n'ont pas été récupérées."})
      }

      if (!sells) {
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Aucune ventes trouvées.'})
      }

      return res.view('Track/Sells', {layout: 'layout', sells: sells})
    })
  }
}
