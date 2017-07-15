/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sha1 = require('sha1');

module.exports = {

    /**
     * Give the inscription form for user
     */
    new: function (req, res) {
        var company = Company.instantiate(req.session.lastInput? _.clone(req.session.lastInput) : {});
        if(req.session.lastInput)   delete req.session.lastInput;

        return res.view('CompanySpace/Inscription', {
            layout: 'layout',
            typesCompany: Company.definition.type.enum,
            company: company
        });
    },

    /**
     * Create a new company
     */
    create: function(req, res)    {
        var lastInput = _.clone(req.params.all());

        Company.create(req.params.all()).exec((err, company) =>  {
           if(err)  {

               req.addFlash('error', true);

               // get error message from validator. (cf locale/*.json)
               for(var attribute of Object.keys(err.invalidAttributes))  {
                   for(var error of err.Errors[attribute])    {
                       req.addFlash(attribute, error.message);
                   }
               }

               req.session.lastInput = lastInput;
               return res.redirect('/Company/new');
           }

            // We send an email with the function send email contained inside services/SendMail.js
            // TODO: use mail template html
            SendMail.sendEmail({
                destAddress: company.mailAddress,
                objectS: "Message de confirmation de l'inscription",
                messageS: '\n\nMadame/Monsieur ' + company.lastName + ', bonjour' +
                "\n\nNous vous confirmons par l’envoi de ce mail que vous avez bien inscrit votre entreprise sur le site du Forum INSA Entreprises. Nous vous invitons maintenant à cliquer sur le lien suivant afin d'activer votre compte :" +
                '\nhttps://' + sails.config.configFIE.FIEdomainName + "/Company/ActivateCompany?url=" + company.activationUrl + '&email=' + company.mailAddress +
                "\n\nVous pouvez dès à présent visiter votre espace personnel sur le site afin d'éditer votre profil, voir vos factures et consulter la CVthèque. Vous pouvez également choisir quelle prestation vous souhaitez commander." +
                '\n\nNous vous rappelons que votre venue au FIE ne sera prise en compte que lorsque vous aurez effectué une commande de prestation (forum, speed job dating ou les deux).' +
                "\n\nLe site étant récent il est possible que des bugs soient encore présents. N’hésitez pas à nous signaler le moindre problème ou à nous poser des questions si vous rencontrez une difficulté  à l'adresse contact@foruminsaentreprises.fr." +
                '\n\nNous vous remercions de votre confiance et avons hâte de vous rencontrer le 24 octobre prochain.' +
                "\nCordialement,\nL'équipe FIE 2017",
                messageHTML: '<br /><br /><p>Madame/Monsieur ' + company.lastName + ', bonjour' +
                "<br /><br />Nous vous confirmons par l’envoi de ce mail que vous avez bien inscrit votre entreprise sur le site du Forum INSA Entreprises. Nous vous invitons maintenant à cliquer sur le lien suivant afin d'activer votre compte :" +
                '<br /><a href="https://' + sails.config.configFIE.FIEdomainName + '/Company/ActivateCompany?url=' + company.activationUrl + '&email=' + company.mailAddress + '">Cliquez ici</a>' +
                "<br /><br />Vous pouvez dès à présent visiter votre espace personnel sur le site afin d'éditer votre profil, voir vos factures et consulter la CVthèque. Vous pouvez également choisir quelle prestation vous souhaitez commander." +
                '<br /><br />Nous vous rappelons que votre venue au FIE ne sera prise en compte que lorsque vous aurez effectué une commande de prestation (forum, speed job dating ou les deux).' +
                "<br /><br />Le site étant récent il est possible que des bugs soient encore présents. N’hésitez pas à nous signaler le moindre problème ou à nous poser des questions si vous rencontrez une difficulté  à l'adresse contact@foruminsaentreprises.fr." +
                '<br /><br />Nous vous remercions de votre confiance et avons hâte de vous rencontrer le 24 octobre prochain.</p>' +
                "<p>Cordialement,<br />L'équipe FIE 2017</p>"
            });

            return res.view('Inscription/UserCreated', {
                firstName: company.firstName,
                layout: 'layout',
                title: 'Inscription - FIE'
            })
        });
    },

    // AuthentificateCompany: Check the email/password request sent by user and allow or not to set an Authentified User
    AuthentificateCompany: function (req, res, cb) {

        var errMessage = {}; // error message sent to Connection view

        //Check for email and password in params. If none: send to signin view
        if(!req.param('login') || !req.param('password')) {

            console.log(errMessage);
            errMessage['login'] = 'Veuillez remplir email et le mot de passe';
            return res.view('Connection_Password/Connection', {
                layout: 'layout',
                errMessage: errMessage,
                nexturl : req.param('nexturl'),
                title: 'Inscription - FIE'
            });
        }

        Company.findOne({mailAddress: req.param('login')}).exec((err, company) => {
            if (err) {
                sails.log.error('[CompanyController.AuthentificateCompany] error when find company' + err);
                return cb(err);
            }

            // account not exist
            if (!company) {
                sails.log.warn('[CompanyController.AuthentificateCompany] account with ' + JSON.stringify(req.params.all()) + ' not found.');
                errMessage['login'] = 'Le mail ' + req.param('login') + ' non trouvé';
            }

            // invalid password
            else if (!company.verifyPassword(req.param('password'))) {
                sails.log.warn('[CompanyController.AuthentificateCompany] invalide password: ' + JSON.stringify(req.params.all()));
                errMessage['password'] = 'Mot de passe invalide pour ' + req.param('login');
            }

            // not activated
            else if (company.active !== 1) {
                sails.log.warn('[CompanyController.AuthentificateCompany] Company ' + company.companyName + ' not activated.');
                errMessage['account'] = 'Le compte '+company.companyName + ' n\'est pas activé, veuillez vérifier dans votre mail: '+company.mailAddress;
            }

            if (!_.isEmpty(errMessage))
                return res.view('Connection_Password/Connection', {
                    layout: 'layout',
                    errMessage: errMessage,
                    nexturl: req.param('nexturl'),
                    title: 'Inscription - FIE'
                });

            // login ok: update session
            req.session.authenticated = true;
            req.session.mailAddress = company.mailAddress;
            req.session.sessionType = 'company';
            req.session.connectionFailed = false;
            req.session.siret = company.siret;
            req.session.companyName = company.companyName;
            req.session.firstName = company.firstName;
            req.session.type = company.type;
            req.session.descLength = company.description.length;
            req.session.user = company;

            sails.log.info('[CompanyController.AuthentificateCompany] Company ' + company.companyName + ' is logging in');

            // for first connection
            if (!company.firstConnectionDone) {
                Company.update({mailAddress: company.mailAddress}, {firstConnectionDone: true}).exec((err) => {
                    if (err) {
                        return err;
                    }
                    return res.view('CompanySpace/FirstConnection', {layout: 'layout'});
                })
            } else {

                if (typeof req.param('nexturl') === 'undefined')
                    return res.redirect('/');

                return res.redirect(req.param('nexturl'));
            }
        });
        /*
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
          */

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
        Company.findOne({mailAddress: req.param('UserAuthEmail')}).exec((err, record, next) => {

            if(err) {
                sails.log.error('[CompanyController.InitPasswdCompany] error when find company: '+err);
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: 'Erreur réinitialisation',
                    ErrorDesc: 'Une erreur inconnue est survenue durant la réinitialisation du mot de passe...'
                })
            }

            // An user has been found in the DB
            if (typeof record !== 'undefined') {
                // We take the old pass to make a new one
                var oldPass = record.password;
                var sha1 = require('sha1');
                var newPass = sha1(oldPass).substring(0, 8);

                sails.log.info('[CompanyController.InitPasswdCompany] Company '+req.param('UserAuthEmail')+' set new password: '+ newPass);

                // We update the password in the DB
                Company.update({mailAddress: req.param('UserAuthEmail')}, {password: newPass }).exec((err, updated, next) =>   {

                    if(err) {
                        sails.log.error('[CompanyController.InitPasswdCompany] error when update Company: '+err);
                        next(err);
                    }

                    if(!updated)    {
                        sails.log.warn('[CompanyController.InitPasswdCompany] no update');
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: 'Erreur réinitialisation',
                            ErrorDesc: 'Aucun utilisateur enregistré avec cet email...'
                        })
                    }

                    // We an email with the new password to the user
                    SendMail.sendEmail({
                        destAddress: updated[0].mailAddress,
                        objectS: 'FIE: Réinitialisation du mot de passe',
                        messageS: "Bonjour,\n\nVous venez de réinitialiser votre mot de passe, votre nouveau mot de passe est le suivant:\n" + newPass + "\nPour vous connecter, cliquez ici: " + sails.config.configFIE.FIEdomainName + "/CompanySpace/Connexion\nA très bientot !\nL'équipe du Forum INSA Entreprises.",
                        messageHTML: "<p>Bonjour,</p><p>Vous venez de réinitialiser votre mot de passe, votre nouveau mot de passe est le suivant:" + newPass + "</p><p>Pour vous connecter:<a href='" + sails.config.configFIE.FIEdomainName + "'/CompanySpace/Connexion'>Cliquez ICI</a>.</p><p>A très bientot !</p><p>L'équipe du Forum INSA Entreprises.</p>",
                        attachments: null
                    });

                    return res.view('Connection_Password/ResetPassOK', {layout: 'layout'});

                })
            } else { // No user was found in DB, we send an error message
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: 'Erreur réinitialisation',
                    ErrorDesc: 'Aucun utilisateur enregistré avec cet email...'
                })
            }
        });
    },

    Profile: function (req, res) {
        Company.findOne({mailAddress: req.session.user.mailAddress}).exec((err, found) => {
            if (err) {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: 'Erreur Affichage',
                    ErrorDesc: 'Une erreur inconnue est survenue lors de l\'affichage de votre profil'
                })
            }

            if (found) {
                var description = found.description;
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

    update: function(req, res, cb)  {
        Company.update({mailAddress: req.session.user.mailAddress}, req.params.all()).exec((err, updated)  =>  {
            if(err) {
                sails.log.error('[CompanyController.update] error when update Company: ');
                sails.log.error(err);
                return cb(err);
            }

            if(!updated || updated.length === 0)    {
                sails.log.warn('[CompanyController.update] no update has been made for '+ req.session.user.companyName);
                req.addFlash('global','Aucune modification a été sauvegardée');

            }   else    {
                req.session.user = updated[0];
                sails.log.info('[CompanyController.update] Company ' + req.session.user.companyName + ' has updated their profile');
                req.addFlash('global', 'Modification sauvegardée avec succès');
            }

            return  res.redirect(sails.getUrlFor('CompanyController.Profile'));

        });
    },

    displayBills: function (req, res) {
        Sells.find({companySiret: req.session.siret}).exec((err, founds) => {
            if (err) {
                return err
            }
            return res.view('CompanySpace/Bills', {layout: 'layout', bills: founds, title: 'Facture - FIE'})
        })
    },

    changePassword: function(req, res, cb)  {
        var password = req.param('password');
        var newpassword = req.param('newpassword');
        var confirmpassword = req.param('confirmpassword');

        if(newpassword !== confirmpassword)  {
            req.addFlash('password', 'La confirmation n\'est pas identique ');
            return res.redirect(sails.getUrlFor('CompanyController.Profile'));
        }

        Company.findOne({mailAddress: req.session.user.mailAddress}).exec((err, company)    =>  {
            if(err) {
                sails.log.error('[CompanyController.changePassword] error when find company: ');
                sails.log.error(err);
                cb(err);
            }

            //company not found
            if(!company)    {
                sails.log.error('[CompanyController.changePassword] Company '+ req.session.user.mailAddress + ' in session not found in mongodb');
                req.addFlash('password', 'Votre compte n\'existe pas dans notre base de donné');
                return res.redirect(sails.getUrlFor('CompanyController.Profile'));

            }

            //password incorrect
            if(!company.verifyPassword(password))  {
                sails.log.error('[CompanyController.changePassword] Company '+ req.session.user.mailAddress + ' in session not found in mongodb');
                req.addFlash('password', 'Mot de passe incorrect');
                return res.redirect(sails.getUrlFor('CompanyController.Profile'));
            }

            // ok
            Company.update({mailAddress: req.session.user.mailAddress}, {password: newpassword}).exec((err, update) =>   {

                if(err) {
                    sails.log.error('[CompanyController.changePassword] error when update company:');
                    sails.log.error(err);
                    return cb(err);
                }

                if(update.length === 0) {
                    sails.log.warn('[CompanyController.changePassword] no update has been made.');
                    req.addFlash('password', 'Aucune mise à jour a été faite');
                }   else    {
                    sails.log.info('[CompanyController.changePassword] Company '+ update.companyName + ' changed password to: ' + newpassword);
                    req.addFlash('password-success', 'Mot de passe changé');
                }

                return res.redirect(sails.getUrlFor('CompanyController.Profile'));

            });

        });

    },

    changePasswordOld: function (req, res) {
        var OldPass = req.param('OldPassA');
        var NewPassA = req.param('NewPassA');
        var NewPassB = req.param('NewPassB');

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

}
