/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require('path')

module.exports = {
    uploadCV: function (req, res) {
        if (req.method === 'GET') {
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Access denied', ErrorDesc: 'Vous ne pouvez pas accéder à cette page de cette façon'})
        }
        var file, prefix

        if (req.param('language') === 'fr') {
            file = 'fr-cv'
            prefix = 'cv_fr_'
        } else if (req.param('language') === 'en') {
            file = 'en-cv'
            prefix = 'cv_en_'
        } else {
            console.log('language : ' + req.param('language') + ' ' + req.param('fr-cv'))
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Erreur lors de l'upload", ErrorDesc: "Votre CV n'est ni uploadé en anglais ni en français"})
        }

        var uploadFile = req.file(file);
        var fileName = prefix + req.session.login + '.pdf'

        uploadFile.upload({dirname: '../../files/' + file, saveAs: fileName, maxBytes: 10000000}, (err, files) => {
            if (err) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Erreur lors de l'upload", ErrorDesc: 'Fichier supérieur à 10 Mo ?'})
            }
            // IF ERROR Return and send 500 error with error

            // Ajout de l'url dans la database
            if (file === 'fr-cv') {
                Student.update({login: req.session.login}, {frCVPath: fileName}).exec((err, updated) => {
                    if (err) {
                        console.log('Probleme pour update le fr-cv')
                        return
                    }
                })
            } else if (file === 'en-cv') {
                Student.update({login: req.session.login}, {enCVPath: fileName}).exec((err, updated) => {
                    if (err) {
                        console.log('Probleme pour update le en-cv')
                        return
                    }
                })
            }

            console.log("c'est bon, redirection")

            setTimeout(() => { // Attends 1 seconde le temps que la bdd s'actualise
                Student.findOne({login: req.session.login}).exec((err, found) => {
                    if (err) {
                        return err
                    }

                    if (req.param('redirect') === 'first') {
                        return res.view('StudentSpace/FirstConnection_2', {layout: 'layout', frCVPath: found.frCVPath, enCVPath: found.enCVPath, title: 'Connection - FIE'})
                    } else { // if (req.param('redirect') === "profile")
                        return res.redirect('/Student/Profile')
                    }
                })
            }, 1000)
        })
    },

    download: function (req, res) {
        var fileFr = ''
        var fileEn = ''
        var cvLogin

        if (req.session.sessionType === 'student') {
            cvLogin = req.session.login
        } else if (req.session.sessionType === 'company' || req.session.isAdmin) {
            cvLogin = req.param('cvLogin')
        }

        // Get the URL of the file to download
        Student.findOne({login: cvLogin}, function (err, record) {
            if (err || !record) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Erreur téléchargement', ErrorDesc: "Nous n'avons pas trouvé votre profil."})
            }
            fileFr = record.frCVPath
            fileEn = record.enCVPath
            console.log('Trouvé cv-fr : ' + fileFr + ' cv-en : ' + fileEn)

            var filePath
            if (req.param('dl') === 'fr') {
                filePath = path.resolve('files/fr-cv', fileFr.toString())
            } else if (req.param('dl') === 'en') {
                filePath = path.resolve('files/en-cv', fileEn.toString())
            }

            console.log('filePath : ' + filePath)

            res.download(filePath)
        })
    },

    uploadLogo: function (req, res) {
        if (req.method === 'GET') {
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Access denied', ErrorDesc: 'Vous ne pouvez pas accéder à cette page de cette façon'})
        }

        var uploadFile = req.file('logo')
        uploadFile.upload({dirname: '../../assets/images/logos', saveAs: req.session.siret + '.png', maxBytes: 10000000}, (err, files) => {
            if (err) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Erreur lors de l'upload", ErrorDesc: 'Fichier supérieur à 10 Mo ?'})
            }

            // Ajout de l'url dans la database
            Company.update({mailAddress: req.session.mailAddress}, {logoPath: req.session.siret + '.png'}).exec((err, updated) => {
                if (err) {
                    console.log('Probleme pour update le logoPath')
                    return
                }

                req.session.user = updated[0];

                setTimeout(() => {
                    return res.redirect('/Company/Profile')
                }, 2000)
            })
        })
    },

    downloadBill: function (req, res) {
        var siret
        var yearRequired = req.param('dl')
        if (req.session.isAdmin) {
            siret = req.param('siret') || req.session.siret
        } else {
            siret = req.session.siret
        }

        var filePath = path.resolve('files/factures/' + yearRequired, siret + '.pdf')
        console.log('filePath : ' + filePath)

        Sells.findOne({year: yearRequired, companySiret: siret}).exec(function (err, sell) {
            if (err) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Erreur lors du téléchargement', ErrorDesc: 'Réessayez ou contactez un admin.'})
            }

            if (!sell) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Vente non trouvée', ErrorDesc: 'Réessayez ou contactez un admin.'})
            }

            res.download(filePath, sell.billNumber.toString() + '.pdf')
        })
    },

    downloadSJDOffers: function (req, res) {
        var siret = req.param('siret');
        var year = new Date().getFullYear();
        var filePath = path.resolve('files/sjdOffers/'+ year, siret + '.pdf');
        console.log('filePath : ' + filePath);
        sails.log.info('FilePath: ', filePath);
        Sjd.findOne({companySiret: siret}).exec(function (err, sjdCompany) {
            if (err) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Erreur lors du téléchargement', ErrorDesc: 'Réessayez ou contactez un admin.'})
            }

            if (!sjdCompany) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Offres de stages non trouvées', ErrorDesc: 'Réessayez ou contactez un admin.'})
            }
            res.download(filePath, 'Offres ' + sjdCompany.companyName + ' 2019.pdf')
        })
    },
    
    downloadBooklet: function (req, res) {
        var year = new Date().getFullYear();
        var filePath = path.resolve('files/com/'+ year, 'livret-entreprises.pdf');
        res.download(filePath, 'Livret entreprises ' + year + '.pdf')
    }
}
