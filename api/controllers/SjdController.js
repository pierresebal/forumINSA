/**
* SjdController
*
* @description :: Server-side logic for managing Sjds
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {
  initialize: function (req, res) { // Devrait etre fait automatiquement lors de la création de la facture
    const actualYear = new Date().getFullYear()
    Sells.find({ // Entreprises inscrites au SJD
      year: actualYear,
      or: [
        {sjd: "on"}
      ]
    }).exec((err, sells) => {
      if (err) {
        return res.negotiate(err)
      }
      var entries = []

      sells.forEach((sell) => {
        entries.push({
          year: actualYear,
          companyName: sell.companyName,
          companySiret: sell.companySiret
        })
      })

      Sjd.create(entries).exec((err, record) => {
        if (err) {
          console.log('err :', err)
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Erreur lors de la création'})
        }
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'initialization done'})
      })
    })
  },

  addSpecialities: function (req, res) {
    const actualYear = new Date().getFullYear()

    Sjd.findOne({companySiret: req.session.siret, year: actualYear}).exec((err, found) => {
      if (err) {
        console.log('err :', err)
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
      }

      if (!found) {
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Votre entreprise n\'a pas été trouvée. Veuillez réessayer ou contacter le webmaster'})
      }

      var specialities = []
      var i
      for (i = 0; i < found.sessionNb; i++) {
        specialities.push(req.param(i))
      }

      Sjd.update({companySiret: req.session.siret, year: actualYear}, {specialities: specialities}).exec((err, record) => {
        if (err) {
          console.log('err :', err)
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
        }

        return res.redirect('/Company/ManageSjd')
      })
    })
  },

  showSjdCompanyInscription: function (req, res) {
    const actualYear = new Date().getFullYear()
    const possibleSpecialities = ['AE', 'GB', 'GP', 'GMM', 'GM', 'GPE', 'IR', 'GC']

    Sjd.findOne({companySiret: req.session.siret, year: actualYear}).exec((err, found) => {
      if (err) {
        console.log('err :', err)
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
      }

      console.log('found : ' + JSON.stringify(found, null, 2))

      if (found) {
        return res.view('CompanySpace/ManageSjd', {layout: 'layout', specialities: found.specialities, sessionNb: found.sessionNb, possibleSpecialities: possibleSpecialities})
      } else {
        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Commande non passée', ErrorDesc: 'Pour pouvoir gérer vos paramètres du SJD, vous devez dabord passer commande (Pack premium ou SJD).'})
      }
    })
  }
}
