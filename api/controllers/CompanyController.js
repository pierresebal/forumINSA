/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sha1 = require('sha1')

module.exports = {

    CompanyInscription: function (req, res) {
        return res.view('CompanySpace/Inscription', {
            layout: 'layout',
            typesCompany: Company.definition.type.enum
        })
    },

    // CreateCompany: Function that create a new user Company into the DB and send him a confirmation email (with confirmation URL)
    CreateCompany: function (req, res) {
        // var for redirecting decision
        var POSTerror = false

        // Creation of a table with all fields form POST form
        // The fields are in the same order as in the file Inscription.ejs
        var dataTab = [
            req.param('type'),
            req.param('Siret'),
            req.param('CompanyName'),
            req.param('CompanyGroup'),
            'none', // Field for the logo of the company, we don't harvest any data from this
            req.param('CompanyDescription'),
            req.param('CompanyWebsiteUrl'),
            req.param('CompanyCareerUrl'),
            req.param('CompanyAddressRoad'),
            req.param('complementaryInformation'),
            req.param('CompanyPostCode'),
            req.param('CompanyAddressCity'),
            req.param('CompanyAddressCountry'),
            req.param('UserFirstName'),
            req.param('UserLastName'),
            req.param('Position'),
            req.param('PhoneNumber'),
            req.param('UserEmail'),
            req.param('UserPassword')
        ]

        // Check for errors.
        var posterr = [
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false',
            'false'
        ]

        // Check for mandatory fields completion
        // Mandatory fields exists
        if (typeof req.param('type') !== 'undefined' &&
            typeof req.param('Siret') !== 'undefined' &&
            typeof req.param('CompanyName') !== 'undefined' &&
            typeof req.param('CompanyAddressRoad') !== 'undefined' &&
            typeof req.param('CompanyPostCode') !== 'undefined' &&
            typeof req.param('CompanyAddressCity') !== 'undefined' &&
            typeof req.param('CompanyAddressCountry') !== 'undefined' &&
            typeof req.param('UserFirstName') !== 'undefined' &&
            typeof req.param('UserLastName') !== 'undefined' &&
            typeof req.param('Position') !== 'undefined' &&
            typeof req.param('PhoneNumber') !== 'undefined' &&
            typeof req.param('UserEmail') !== 'undefined' &&
            typeof req.param('UserPassword') !== 'undefined') {
            // Check for the length and content of fields

            // Table with regex objects used to check the dataTab
            // 'none' means that no rules are applied
            var Regex = require('regex')
            var regexTab = [
                'none', //type TODO check if the validations works itself
                new Regex('[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{3}[ \.\-]?[0-9]{5}'), // Siret
                'none', // company Name
                'none', // Company Group
                'none', // Company logo
                'none', // Company Description
                'none',
                'none',
                // new Regex("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})"), // Url
                // new Regex("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})"), // Url
                new Regex('#[a-z]#'), // Adresse (route)
                'none', // Adresse (complement)
                // new Regex("([A-Z]+[A-Z]?\-)?[0-9]{1,2} ?[0-9]{3}"), // Postal Code
                'none',
                'none', // City
                'none', // Country
                'none', // User name
                'none', // User name
                'none', // POsition
                new Regex('^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$'), // Phone number
                new Regex('^\S+@(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$'), // Mail
                new Regex('^[\S\s]{0,50}') // Password
            ]

            // Table with min length
            // Set here the maximum length of each fields
            var minLengthTab = [
                0, // type
                0, // siret
                1, // CompanyName'
                0, // CompanyGroup
                0, //  CompanyLogo
                0, // CompanyDescription
                0, // CompanyWebsiteUrl
                0, // CompanyCareerUrl
                0, // CompanyAddressRoad
                0, // complementaryInformation
                0, // CompanyAddressPostalCode
                0, // CompanyAddressCity
                0, // CompanyAddressCountry
                0, // UserFirstName
                0, // UserLastName
                1, // Position
                0, // phoneNumber
                0, // UserMail
                6 // UserPassword
            ]

            // Table with max length
            // Set here the max length of each fields
            var maxLengthTab = [
                100, // type
                17, // siret
                50, // CompanyName'
                50, // CompanyGroup
                50, //  CompanyLogo
                500, // CompanyDescription
                200, // CompanyWebsiteUrl
                200, // CompanyCareerUrl
                50, // CompanyAddressRoad
                50, // complementaryInformation
                6, // CompanyAddressPostalCode
                200, // CompanyAddressCity
                50, // CompanyAddressCountry
                50, // UserFirstName
                50, // UserLastName
                50, // Position
                13, // phoneNumber
                150, // UserMail
                500 // UserPassword
            ]

            for (var i = 0; i <= 18; i++) {
                // We check the field i
                if (typeof dataTab[i] !== 'undefined') {
                    // Validation of length
                    if (dataTab[i].length >= minLengthTab[i] && dataTab[i].length <= maxLengthTab[i]) {
                        if (typeof dataTab[i] !== 'string') {
                            // Validation of entry by regular expressions
                            if (!regexTab[i].test(dataTab[i])) {
                                // Field not validated
                                POSTerror = true
                                posterr[i] = 'true'
                            }
                        }
                    } else {
                        POSTerror = true
                        posterr[i] = 'true'
                        console.log('error')
                    }
                }
                // We skip to the next field
            }
        } else { // Mandatory fields seems to not exist
            console.log('il manque des champs obligatoires: ' + posterr + ' || ' + dataTab)
            POSTerror = true
        }

        // En cas d'erreur rencontrée, on affiche une page d'erreur
        if (POSTerror) {
            return res.view('Inscription/Inscription', {
                layout: 'layout',
                POSTerror: POSTerror,
                posterr: posterr,
                dataTab: dataTab
            })
        }

        // On regarde qu'il n'y a pas d'entrerpise avec le même email déja enregistrées
        Company.findOne({mailAddress: req.param('UserEmail')}).exec((err, record) => {
            // La recherche n'a pas posé de problèmes
            if (!err) {
                // Entreprise trouvée => On retourne une erreur à l'inscription
                if (typeof record !== 'undefined') {
                    console.log('A company with the same mailAddress was found ...User result:' + record.mailAddress)
                    console.log('Impossible to create a new user, the email is already used...')
                    return res.view('Inscription/CompanyNotCreated', {
                        layout: 'layout',
                        Email: record.mailAddress,
                        title: 'Erreur - FIE'
                    })
                } else { // Pas d'entrepise trouvée => Ajout ds la BDD
                    if (err) return res.serverError(err)

                    // Création du lien d'activation (sha1 sur chrono courrant du serveur)
                    var sha1 = require('sha1')
                    var date = new Date()
                    var ActivationUrl = sha1(date.getTime())
                    var websiteUrl = req.param('CompanyWebsiteUrl')
                    var careerUrl = req.param('CompanyCareerUrl')

                    if (websiteUrl.charAt(4) !== ':' && websiteUrl.charAt(5) !== ':' && websiteUrl !== '') {
                        websiteUrl = 'http://' + websiteUrl
                    }

                    if (careerUrl.charAt(4) !== ':' && careerUrl.charAt(5) !== ':' && careerUrl !== '') {
                        careerUrl = 'http://' + careerUrl
                    }

                    // Ajout de l'entreprise dans la BDD
                    Company.create({
                        firstName: req.param('UserFirstName'),
                        lastName: req.param('UserLastName'),
                        position: req.param('Position'),
                        phoneNumber: req.param('PhoneNumber'),
                        mailAddress: req.param('UserEmail'),
                        password: req.param('UserPassword'),
                        siret: req.param('Siret'),
                        companyName: req.param('CompanyName'),
                        companyGroup: req.param('CompanyGroup'),
                        description: req.param('CompanyDescription'),
                        websiteUrl: websiteUrl,
                        careerUrl: careerUrl,
                        road: req.param('CompanyAddressRoad'),
                        complementaryInformation: req.param('complementaryInformation'),
                        city: req.param('CompanyAddressCity'),
                        postCode: req.param('CompanyPostCode'),
                        country: req.param('CompanyAddressCountry'),
                        logoPath: req.param('Siret') + '.png',
                        type: req.param('type'),
                        AE: (req.param('AE') === 'on'),
                        IR: (req.param('IR') === 'on'),
                        GB: (req.param('GB') === 'on'),
                        GP: (req.param('GP') === 'on'),
                        GPE: (req.param('GPE') === 'on'),
                        GC: (req.param('GC') === 'on'),
                        GM: (req.param('GM') === 'on'),
                        GMM: (req.param('GMM') === 'on'),
                        active: 0,
                        activationUrl: ActivationUrl
                    }, (err, created) => {
                        if (!err) {
                            console.log('[INFO] User created ) : ' + created.firstName + ' ' + created.lastName)

                            // We send an email with the function send email contained inside services/SendMail.js
                            SendMail.sendEmail({
                                destAddress: req.param('UserEmail'),
                                objectS: "Message de confirmation de l'inscription",
                                messageS: '\n\nMadame/Monsieur ' + req.param('UserLastName') + ', bonjour' +
                                "\n\nNous vous confirmons par l’envoi de ce mail que vous avez bien inscrit votre entreprise sur le site du Forum INSA Entreprises. Nous vous invitons maintenant à cliquer sur le lien suivant afin d'activer votre compte :" +
                                '\nhttps://' + sails.config.configFIE.FIEdomainName + "/Company/ActivateCompany?url=" + ActivationUrl + '&email=' + req.param('UserEmail') +
                                "\n\nVous pouvez dès à présent visiter votre espace personnel sur le site afin d'éditer votre profil, voir vos factures et consulter la CVthèque. Vous pouvez également choisir quelle prestation vous souhaitez commander." +
                                '\n\nNous vous rappelons que votre venue au FIE ne sera prise en compte que lorsque vous aurez effectué une commande de prestation (forum, speed job dating ou les deux).' +
                                "\n\nLe site étant récent il est possible que des bugs soient encore présents. N’hésitez pas à nous signaler le moindre problème ou à nous poser des questions si vous rencontrez une difficulté  à l'adresse contact@foruminsaentreprises.fr." +
                                '\n\nNous vous remercions de votre confiance et avons hâte de vous rencontrer le 18 octobre prochain.' +
                                "\nCordialement,\nL'équipe FIE 2016",
                                messageHTML: '<br /><br /><p>Madame/Monsieur ' + req.param('UserLastName') + ', bonjour' +
                                "<br /><br />Nous vous confirmons par l’envoi de ce mail que vous avez bien inscrit votre entreprise sur le site du Forum INSA Entreprises. Nous vous invitons maintenant à cliquer sur le lien suivant afin d'activer votre compte :" +
                                '<br /><a href="https://' + sails.config.configFIE.FIEdomainName + '/Company/ActivateCompany?url=' + ActivationUrl + '&email=' + req.param('UserEmail') + '">Cliquez ici</a>' +
                                "<br /><br />Vous pouvez dès à présent visiter votre espace personnel sur le site afin d'éditer votre profil, voir vos factures et consulter la CVthèque. Vous pouvez également choisir quelle prestation vous souhaitez commander." +
                                '<br /><br />Nous vous rappelons que votre venue au FIE ne sera prise en compte que lorsque vous aurez effectué une commande de prestation (forum, speed job dating ou les deux).' +
                                "<br /><br />Le site étant récent il est possible que des bugs soient encore présents. N’hésitez pas à nous signaler le moindre problème ou à nous poser des questions si vous rencontrez une difficulté  à l'adresse contact@foruminsaentreprises.fr." +
                                '<br /><br />Nous vous remercions de votre confiance et avons hâte de vous rencontrer le 18 octobre prochain.</p>' +
                                "<p>Cordialement,<br />L'équipe FIE 2016</p>"
                            })

                            // We show a positive result to the CompanySpace created
                            console.log('Company created: ' + req.param('UserEmail'))
                            return res.view('Inscription/UserCreated', {
                                firstName: created.firstName,
                                layout: 'layout',
                                title: 'Inscription - FIE'
                            })
                        } else {
                            console.log('Error while creating a new CompanySpace. Error: ' + err)
                            return res.view('404', {error: err})
                        }
                    })
                }
            } else { // La recherche d'une Cie a posé un problème
                console.log('A problem occured during search for existing companies. Error: ' + err)
            }
        })
    },

    // AuthentificateCompany: Check the email/password request sent by user and allow or not to set an Authentified User
    AuthentificateCompany: function (req, res) {
        console.log('User try to authentificate... Email: ' + req.param('login') + ' Password: ' + req.param('password'))
        var sha1 = require('sha1')
        // Looking for IDs in the database
        Company.findOne({
            mailAddress: req.param('login'),
            password: sha1(req.param('password'))
        }).exec((err, record) => {
            // Good IDs for authentication
            if (!err) {
                if (typeof record !== 'undefined') {
                    // User authenticated and active
                    if (record.active === 1) {
                        // We set up session variables
                        req.session.authenticated = true;
                        req.session.mailAddress = record.mailAddress;
                        req.session.sessionType = 'company';
                        req.session.connectionFailed = false;
                        req.session.siret = record.siret;
                        req.session.companyName = record.companyName;
                        req.session.firstName = record.firstName;
                        req.session.type = record.type;
                        req.session.descLength = record.description.length;
                        req.session.user = record;

                        // We confirm the authentication
                        console.log('Authentification succeed: ' + record.firstName)

                        if (!record.firstConnectionDone) {
                            Company.update({mailAddress: req.session.mailAddress}, {firstConnectionDone: true}).exec((err) => {
                                if (err) {
                                    return err
                                }
                                return res.view('CompanySpace/FirstConnection', {layout: 'layout'})
                            })
                        } else {
                            if (typeof req.param('nexturl') === 'undefined') {
                                return res.redirect('/')
                            } else {
                                return res.redirect(req.param('nexturl'))
                            }
                        }
                    } else { // User authenticated but not active
                        console.log('CompanySpace not activated...')
                        return res.view('Connection_Password/Connection', {
                            error: 'Votre compte n\'est pas activé veuillez vous réfférer au mail d\'activation reçu à l\'inscription...',
                            layout: 'layout',
                            title: 'Inscription - FIE'
                        })
                    }
                } else { // Bad IDs for authentication
                    console.log('Wrong password/email, auth aborted...')
                    return res.view('Connection_Password/Connection', {
                        layout: 'layout',
                        companyConnectionFailed: true,
                        title: 'Inscription - FIE'
                    })
                }
            } else { // Bad IDs for authentication
                console.log('Error during authentification...')
                return res.view('500')
            }
        })
    },

    // Show space reserved to members (test page for authentification)
    MemberHomeShow: function (req, res) {
        console.log('Showing member space...')
        res.view('CompanySpace/CompanySpace', {layout: 'layout', title: 'Espace Perso - FIE'})
    },

    // CompanyLogout: set session var as UnAuthentificated user
    CompanyLogout: function (req, res) {
        if (req.session.authenticated) {
            console.log('User with email ' + req.session.mailAddress + ' disconnected himself.')
            req.session.mailAddress = 'undefined'
            req.session.authenticated = false
            res.redirect('/')
        } else {
            console.log('An unauthenticated user tried to disconnect')
            res.view('500')
        }
    },

    // ActivateCompany: check URL request from email confirmation sent after User inscription in order to set Active:1 the Account
    // (this allow the user to connect)
    ActivateCompany: function (req, res) {
        if (req.session.authenticated) {
            // Error if the user is already authenticated
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Vous êtes déjà connecté'})
        } else {
            // Check for valid GEaddressT args in url request: email and url wich are the IDs for confirmation in DB
            if (typeof req.param('url') !== 'undefined' && req.param('email') !== 'undefined') {
                // We try to update an existing user to set him Active:1
                Company.update({
                    mailAddress: req.param('email'),
                    activationUrl: req.param('url'),
                    active: 0
                }, {active: 1}).exec((err, updated) => {
                    if (err) { // If we hit an error during update
                        console.log('Unable to activate user...')
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: 'Echec de l\'activation',
                            ErrorDesc: 'Erreur lors de la tentative d\'activation: Erreur interne au serveur'
                        })
                    } else { // We had no error
                        if (typeof updated[0] !== 'undefined') {
                            // If we updated the user with succes
                            console.log('A company has been activated: ' + updated[0].mailAddress)
                            return res.view('Inscription/UserActivated', {layout: 'layout'})
                        } else {
                            // If the right user wasn't encountered
                            console.log('User not find or bad authentication...')
                            return res.view('ErrorPage', {
                                layout: 'layout',
                                ErrorTitle: 'Echec de l\'activation',
                                ErrorDesc: 'Erreur lors de la tentative d\'activation: Mauvaise identification ou compte déja actif...'
                            })
                        }
                    }
                })
            } else {
                // If the url doesn't bring args
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Requete incorrect'})
            }
        }
    },

    // InitPasswd We call this function when the user needs to receive a new password by email (because he losts it)
    // This function need POST arg named "email" wich corespond to the attribute Email of the user who need to reset password
    InitPasswdCompany: function (req, res) {
        // Check if the user exists and we take his old password to create the new
        Company.findOne({mailAddress: req.param('UserAuthEmail')}).exec((err, record) => {
            if (!err) {
                // An user has been found in the DB
                if (typeof record !== 'undefined') {
                    // We take the old pass to make a new one
                    var oldPass = record.password
                    var sha1 = require('sha1')
                    var newPass = sha1(oldPass).substring(0, 8)

                    // We update the password in the DB
                    Company.update({mailAddress: req.param('UserAuthEmail')}, {password: sha1(newPass)}).exec((err, updated) => {
                        if (!err) {
                            // We an email with the new password to the user
                            SendMail.sendEmail({
                                destAddress: req.param('UserAuthEmail'),
                                objectS: 'FIE: Réinitialisation du mot de passe',
                                messageS: "Bonjour,\n\nVous venez de réinitialiser votre mot de passe, votre nouveau mot de passe est le suivant:\n" + newPass + "\nPour vous connecter, cliquez ici: " + sails.config.configFIE.FIEdomainName + "/CompanySpace/Connexion\nA très bientot !\nL'équipe du Forum INSA Entreprises.",
                                messageHTML: "<p>Bonjour,</p><p>Vous venez de réinitialiser votre mot de passe, votre nouveau mot de passe est le suivant:" + newPass + "</p><p>Pour vous connecter:<a href='" + sails.config.configFIE.FIEdomainName + "'/CompanySpace/Connexion'>Cliquez ICI</a>.</p><p>A très bientot !</p><p>L'équipe du Forum INSA Entreprises.</p>",
                                attachments: null
                            })

                            return res.view('Connection_Password/ResetPassOK', {layout: 'layout'})
                        }
                    })
                } else { // No user was found in DB, we send an error message
                    return res.view('ErrorPage', {
                        layout: 'layout',
                        ErrorTitle: 'Erreur réinitialisation',
                        ErrorDesc: 'Aucun utilisateur enregistré avec cet email...'
                    })
                }
            } else {
                // No user was found
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: 'Erreur réinitialisation',
                    ErrorDesc: 'Une erreur inconnue est survenue durant la réinitialisation du mot de passe...'
                })
            }
        })
    },

    Profile: function (req, res) {
        Company.findOne({mailAddress: req.session.mailAddress}).exec((err, found) => {
            if (err) {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: 'Erreur Affichage',
                    ErrorDesc: 'Une erreur inconnue est survenue lors de l\'affichage de votre profil'
                })
            }

            if (found) {
                var description = found.description
                description = description.replace(/(?:\r\n|\r|\n)/g, '<br />')

                return res.view('CompanySpace/Profile', {
                    layout: 'layout',
                    company: found,
                    canBook: found.canBook()
                })
            } else {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Votre compte n'a pas été trouvé."})
            }
        })
    },

    CvTheque: function (req, res) {
        Sells.findOne({companySiret: req.session.siret}).exec((err, found) => { // Il faut filtrer pour que la commande soit de l'année en cours.
            if (err) {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            if (found) {
                return res.view('CompanySpace/CvTheque', {layout: 'layout', title: 'CVThèque - FIE'})
            } else {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: 'Accès non autorisé',
                    ErrorDesc: 'Pour avoir accès à cette page, vous devez d\'abord passer commande.'
                })
            }
        })
    },

    Command: function (req, res) {
        // Inscription ouverte ?
        GeneralSettings.findOrCreate({id: 1}).exec((err, found) => {
            if (err) {
                return err
            }

            // check deadline
            var now = new Date();
            if (found.inscriptionDeadline < now) {
                return res.view('CompanySpace/DeadlinePassed', {
                    layout: 'layout',
                    deadline: found.inscriptionDeadline.toDateString(),
                    title: 'Date dépassée - FIE'
                })
            }

            var year = new Date().getFullYear();

            // check open close
            if(!found.areInscriptionsOpened) {
                return res.view('CompanySpace/NoInscriptions', {
                    layout: 'layout',
                    title: 'Réservation fermée - FIE',
                    year: year
                });
            }

            Company.findOne({mailAddress: req.session.user.mailAddress}).exec((err, record) =>    {
                if (err) {
                    return err
                }
                var company = record;


                // 2 views differents for 2 prices
                if (company.isBenefitPromotion()) {
                    YearSettings.findOne({year: year}).exec((err, record) => {
                        if (err) {
                            console.log(err);
                            return err;
                        }

                        return res.view('CompanySpace/Command', {
                            layout: 'layout',
                            title: 'Commande - FIE',
                            year: year,
                            forumPrice: record.forumPricePME,
                            sjdPrice: record.sjdPricePME,
                            sjdSessionPrice: record.sjdSessionPricePME,
                            premiumPrice: record.premiumPricePME,
                            mealPrice: record.mealPrice,
                            deadline: found.inscriptionDeadline.toDateString(),
                            priceImgUrl: '/images/pme.png',
                            reduit: true,
                            canBook: company.canBook()
                        })
                    })
                } else {
                    YearSettings.findOne({year: year}).exec((err, record) => {
                        if (err) {
                            console.log(err);
                            return err;
                        }

                        return res.view('CompanySpace/Command', {
                            layout: 'layout',
                            title: 'Commande - FIE',
                            year: year,
                            forumPrice: record.forumPrice,
                            sjdPrice: record.sjdPrice,
                            sjdSessionPrice: record.sjdSessionPrice,
                            premiumPrice: record.premiumPrice,
                            mealPrice: record.mealPrice,
                            deadline: found.inscriptionDeadline.toDateString(),
                            priceImgUrl: '/images/regular.png',
                            reduit: false,
                            canBook: company.canBook()
                        })
                    })
                }

            })
        })
    },

    // Modifie une information de l'utilisateur
    setAUserInfo: function (req, res) {
        if (!req.param('data')) {
            return res.redirect('/Company/Profile')
        }

        var data = req.param('data') // Type d'info à modifier
        switch (data) {
            case 'a':
                var firstName = req.param('firstName');
                var lastName = req.param('lastName');
                var position = req.param('position');
                var phoneNumber = req.param('phoneNumber');
                var mailAddress = req.param('mailAddress');

                Company.findOne({mailAddress: mailAddress}).exec((err, found) => {
                    if (err) {
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: 'problème pour trouver si adresse déjà existante.'
                        })
                    }

                    if (!found || found.mailAddress === req.session.mailAddress) {
                        Company.update({mailAddress: req.session.mailAddress}, {
                            firstName: firstName,
                            lastName: lastName,
                            position: position,
                            phoneNumber: phoneNumber,
                            mailAddress: mailAddress,
                        }).exec((err, record) => {
                            if (err) {
                                console.log(err);
                                return res.view('ErrorPage', {
                                    layout: 'layout',
                                    ErrorTitle: 'Problème lors de la mise à jour',
                                    ErrorDesc: 'Votre adresse mail est-elle valide ?'
                                })
                            }

                            req.session.mailAddress = record['0'].mailAddress
                            req.session.firstName = record['0'].firstName
                            return res.redirect('/Company/Profile')
                        })
                    } else {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Cette adresse existe déjà.'})
                    }
                })
                break

            case 'f':
                var bFirstName = req.param('bFirstName')
                var bLastName = req.param('bLastName')
                var bPosition = req.param('bPosition')
                var bPhoneNumber = req.param('bPhoneNumber')
                var bMailAddress = req.param('bMailAddress')

                // Todo: Verification de firstName
                Company.update({mailAddress: req.session.mailAddress}, {
                    bFirstName: bFirstName,
                    bLastName: bLastName,
                    bPosition: bPosition,
                    bPhoneNumber: bPhoneNumber,
                    bMailAddress: bMailAddress
                }).exec((err, record) => {
                    if (err) {
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: 'Problème lors de la mise à jour',
                            ErrorDesc: "L'adresse mail est-elle valide ?"
                        })
                    }
                    return res.redirect('/Company/Profile')
                })
                break

            case 'l':
                var companyName = req.param('companyName')
                // Todo: Verification de companyName
                Company.update({mailAddress: req.session.mailAddress}, {companyName: companyName}).exec((err, record) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update companyName.'})
                    }
                    return res.redirect('/Company/Profile')
                })
                break

            case 'm':
                var companyGroup = req.param('companyGroup')
                // Todo: Verification de companyGroup
                Company.update({mailAddress: req.session.mailAddress}, {companyGroup: companyGroup}).exec((err, record) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update companyGroup.'})
                    }

                    return res.redirect('/Company/Profile')
                })
                break

            case 'n':
                var description = req.param('description')
                // Todo: Verification de description
                Company.update({mailAddress: req.session.mailAddress}, {description: description}).exec((err, record) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update description.'})
                    }

                    req.session.descLength = description.length
                    return res.redirect('/Company/Profile')
                })
                break

            case 'o':
                var websiteUrl = req.param('websiteUrl')
                if (websiteUrl.charAt(4) !== ':' && websiteUrl.charAt(5) !== ':' && websiteUrl !== '') {
                    websiteUrl = 'http://' + websiteUrl
                }

                // Todo: Verification de websiteUrl
                Company.update({mailAddress: req.session.mailAddress}, {websiteUrl: websiteUrl}).exec((err, record) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update websiteUrl.'})
                    }

                    return res.redirect('/Company/Profile')
                })
                break

            case 'p':
                var careerUrl = req.param('careerUrl')

                if (careerUrl.charAt(4) !== ':' && careerUrl.charAt(5) !== ':' && careerUrl !== '') {
                    careerUrl = 'http://' + careerUrl
                }

                // Todo: Verification de careerUrl
                Company.update({mailAddress: req.session.mailAddress}, {careerUrl: careerUrl}).exec((err, record) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update careerUrl.'})
                    }

                    return res.redirect('/Company/Profile')
                })
                break

            case 'q':
                var road = req.param('road')
                var complementaryInformation = req.param('complementaryInformation')
                var postCode = req.param('postCode')
                var city = req.param('city')
                var country = req.param('country')
                // Todo: Verification de firstName
                Company.update({mailAddress: req.session.mailAddress}, {
                    road: road,
                    complementaryInformation: complementaryInformation,
                    postCode: postCode,
                    city: city,
                    country: country
                }).exec((err, record) => {
                    if (err) {
                        console.log(err);
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update postaddress.'})
                    }

                    return res.redirect('/Company/Profile')
                })
                break
            case 'z':
                Company.update({mailAddress: req.session.mailAddress}, {
                    AE: (req.param('AE') === 'on').toString(),
                    IR: (req.param('IR') === 'on').toString(),
                    GB: (req.param('GB') === 'on').toString(),
                    GP: (req.param('GP') === 'on').toString(),
                    GPE: (req.param('GPE') === 'on').toString(),
                    GC: (req.param('GC') === 'on').toString(),
                    GM: (req.param('GM') === 'on').toString(),
                    GMM: (req.param('GMM') === 'on').toString()
                }).exec((err, record) => {
                    if (err) {
                        console.log(err)
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update postaddress.'})
                    }

                    return res.redirect('/Company/Profile')
                })
                break;
            case 'type' :
                var type = req.param('type');
                Company.update({mailAddress: req.session.mailAddress}, {type: type}).exec((err, record) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update description.'})
                    }
                    req.session.user = record[0];
                    return res.redirect('/Company/Profile')
                })
                break
            default:
                console.log('Type de data inconnu', data);
        }
    },

    displayBills: function (req, res) {
        Sells.find({companySiret: req.session.siret}).exec((err, founds) => {
            if (err) {
                return err
            }
            return res.view('CompanySpace/Bills', {layout: 'layout', bills: founds, title: 'Facture - FIE'})
        })
    },

    changePassword: function (req, res) {
        var OldPass = req.param('OldPassA')
        var NewPassA = req.param('NewPassA')
        var NewPassB = req.param('NewPassB')

        if (NewPassA !== NewPassB) {
            return res.json({
                changePassResponse: {
                    succes: false,
                    msg: 'Les nouveaux mots de passe doivent être identiques'
                }
            })
        } else {
            Company.update({
                mailAddress: req.session.mailAddress,
                password: sha1(OldPass)
            }, {password: sha1(NewPassA)}).exec((err, updated) => {
                if (typeof updated[0] === 'undefined' && !err) {
                    return res.json({
                        changePassResponse: {
                            succes: false,
                            msg: 'Erreur... Le mot de passe courant saisi est incorrect.'
                        }
                    })
                } else {
                    // On supprime le compteur de tentatives
                    delete req.session.changePasswordTries
                    // On renvoie une réponse pour la requette AJAX
                    return res.json({changePassResponse: {succes: true, msg: 'Modification du mot de passe validée'}})
                }
            })
        }
    },

    displayVigipirate: function (req, res) {
        Company.findOne({siret: req.session.siret}).exec((err, company) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            return res.view('CompanySpace/Vigipirate', {layout: 'layout', company: company})
        })
    },

    addVigipirate: function (req, res) {
        var registeredPeople = []

        for (var i = 0; i < 15; i++) {
            if (req.param(i) !== '') {
                registeredPeople.push(req.param(i))
            }
        }

        Company.update({siret: req.session.siret}, {vigipirate: registeredPeople}).exec((err, updated) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            return res.redirect('/Company/vigipirate')
        })
    },

    TODOlist: function (req, res) {
        // Controller qui permet d'afficher les taches à faire aux entreprises
        // Les taches a faire sont contenues dans le JSON TODOtasks

        //TODOtasks (contenu dans le fichier /config/TODOtasks)
        // titre: titre de la notification qui apparait quand la tache n'a pas ete faite
        // msg: message affiché en dessous de la notification (supporte le html)
        // checkFun: fonction de validation de la tache qui renvoie un booléen, true si la notification doit être affichée

        var TODOtasks = sails.config.TODOtasks

        // Génération du JSON TODOlist qui sera envoyé à la view par traitement de TODOtasks
        var TODOlist = []

        // Traitment des taches
        Company.findOne({mailAddress: req.session.mailAddress}).exec((err, company) => {
            if (!err) {
                for (var i = 0; i < TODOtasks.length; i++) {
                    if (TODOtasks[i].checkFun(company)) {
                        // Si la tache est a faire on enregistre le message a passer à la view
                        TODOlist[i] = {title: TODOtasks[i].title, msg: TODOtasks[i].msg}
                    } else {
                        TODOlist[i] = false
                    }
                }

                // On envoie la view avec les taches à faire
                res.view('CompanySpace/TODOlist', {layout: 'layout', TODOlist: TODOlist})
            } else {
                res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Erreur lors de la génération de la TODOlist.'})
            }
        })
    },

    /** When we dev this function, sails is still 0.12.0,
     * Waterline does not support the projection, we need to do this
     */
    apiCompany: function(req, res)  {
        //TODO : make this cleaner in upper version
        Company.native(function(err, Collection) {
            if (err) {
                return res.serverError();
                console.log(err);
            }

            Collection.find(
                {},
                {'firstName': 1, 'lastName': 1, 'position': 1, 'mailAddress': 1, 'phoneNumber': 1, 'companyName': 1, 'companyGroup': 1 }
                ).toArray((err2, companies) => {
                if (err2) {
                    return res.serverError();
                    console.log(err2);
                }

                return res.json(200, companies);
            });
        });

    }
}
