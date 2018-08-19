/**
 * Admin/CompanyController
 *
 * @description :: Server-side logic for managing Admin/companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    listing: function (req, res) {
        return res.view('AdminLTE/Company/listing',  {
            layout: 'Layout/AdminLTE'
        })
    },

    update: function(req, res, next) {
        if (!req.param('siret')) {
            sails.log.error('[Admin/CompanyController.update] siret param not found');
            return res.serverError();

        } else if (!req.body) {

            // as no query has been sent, display the update with information
            Company.findOne({siret: req.param('siret')}).populate('status').populate('specialities').exec((err, company) => {
                if (err) {
                    sails.log.error('[Admin/CompanyController.update] an error occured when find a company: ', err);
                    return next(err);
                }

                if (!company) {
                    sails.log.error('[Admin/CompanyController.update] No company found with query: ', req.allParams());
                    return res.notFound();
                }

                // the next 3 query, we'll give the elements for some listing choices for the front page

                CompanyStatus.find().exec((err, status) => {
                    if(err) {
                        sails.log.error('[Admin/CompanyController.update] error when find all status: ', err);
                        return res.serverError(err);
                    }

                    Sells.find({companySiret: company.siret}).exec((err, sells) => {
                        if(err) {
                            sails.log.error('[Admin/CompanyController.update] error when find sells for company ' + company.companyName + ': ', err);
                            return res.serverError(err);
                        }

                        Speciality.find().exec((err, specialities) => {
                            if(err) {
                                sails.log.error('[Admin/CompanyController.update] error when find all speciality: ', err);
                                return res.serverError(err);
                            }

                            return res.view('AdminLTE/Company/update', {
                                layout: 'Layout/AdminLTE',
                                company: company,
                                sells: sells,
                                allStatus: status,
                                specialities: specialities
                            });

                        });

                    });


                });
            });
        } else {

            // handle query
            let params = req.allParams();
            delete params.siret;
            Company.update({siret: req.param('siret') }, params).exec((err, updated) => {

                if(err) {
                    sails.log.error('[Admin/CompanyController.update] err occured when update company '+ req.param('siret') + ': ', err);
                    return next(err);
                }

                else if(!updated || updated.length === 0)    {
                    sails.log.warn('[Admin/CompanyController.update] company siret '+ req.param('siret') +' has not been updated, query: ', params);
                    req.addFlash('warning', 'Company dont siret '+ req.param('siret') +' has not been updated');
                    return res.redirect(sails.getUrlFor('Admin/CompanyController.listing'));
                }   else {

                    sails.log.info('[Admin/CompanyController.update] company '+ updated[0].companyName +' has been updated');
                    req.addFlash('success', 'Company '+ updated[0].companyName +' has been updated');
                    return res.redirect(sails.getUrlFor('Admin/CompanyController.listing'));
                }
            });
        }
    },

    create: function(req, res, next) {

        if(!req.body)   {
            return res.view('AdminLTE/Company/create', {
                layout: 'Layout/AdminLTE',
                company: {}
            });
        } else {
            Company.create(req.body).exec((err, company) => {
                if(err) {

                    sails.log.error('[Admin/CompanyController.create] error when create a company: ', err);

                    // get error message from validator. (cf locale/*.json)
                    req.addFlash('danger', err);
                    return res.view('AdminLTE/Company/create', {
                        layout: 'Layout/AdminLTE',
                        company: req.body
                    });
                }

                if(!company || company.length === 0) {
                    req.addFlash('warning', 'No company has been created');
                    return res.view('AdminLTE/Company/create', {
                        layout: 'Layout/AdminLTE',
                        company: req.body
                    });
                }           

                req.addFlash('success', 'A new company has been created: ' + company.companyName);
                return res.redirect(sails.getUrlFor('Admin/CompanyController.listing'));
            })
        }
    },

    apiGetAll: function (req, res) {
        // give all companies in json

        Company.find({}).exec((err, companies)  =>  {
            if(err) {
                sails.log.error('[Admin/CompanyController.apiGetAll] error when find all companies:', err);
                return res.json(500, err);
            }

            return res.json(200, companies);
        });

    },

    apiUpdate: function (req, res) {
        let id = req.param('id');
        let params = req.allParams();
        delete params.id;

        Company.update({id: id}, params).exec((err, companies)  =>  {

            if(err) {
                sails.log.error('[Admin/CompanyController.apiUpdate] error when update company: ' + err);
                return res.json(500, err);
            }

            if(!companies || companies.length === 0) {
                sails.log.warn('[Admin/CompanyController.apiUpdate] no company has been updated, querry: ', req.allParams());
                return res.json(500, {msg: 'no company updated'});
            }

            let company = companies[0];
            sails.log.info('[Admin/CompanyController.apiUpdate] updated Company '+ company.companyName);

            if (params.active !== undefined) {
                if (params.active) {
                    // We send an email with the function send email contained inside services/SendMail.js
                    SendMail.sendEmail({
                        destAddress: company.mailAddress,
                        objectS: "Confirmation de la création de votre compte",
                        messageS: '\nMadame/Monsieur ' + company.lastName + ', bonjour' +
                        "\n\nNous vous confirmons par l’envoi de ce mail que nous avons créé un compte pour votre entreprise sur le site Forum by INSA. Nous vous invitons maintenant à cliquer sur le lien suivant afin de vous connecter à votre espace :" +
                        '\nhttps://' + sails.config.configFIE.FIEdomainName + "/Company/" +
                        "\n\nVous pouvez dès à présent visiter votre espace personnel sur le site afin d'éditer votre profil, voir vos factures et consulter la CVthèque. Vous pouvez également choisir quelle prestation vous souhaitez commander." +
                        '\n\nNous vous rappelons que votre venue au FIE ne sera prise en compte que lorsque vous aurez effectué une commande de prestation (forum, speed job dating ou les deux).' +
                        "\n\nLe site ayant été mis à jour récemment, il est possible que des bugs soient encore présents. N’hésitez pas à nous signaler le moindre problème ou à nous poser des questions si vous rencontrez une difficulté  à l'adresse contact@foruminsaentreprises.fr." +
                        '\n\nNous vous remercions de votre confiance et avons hâte de vous rencontrer le 23 octobre prochain.' +
                        "\nCordialement,\nL'équipe FIE 2018",
                        messageHTML: '<br /><p>Madame/Monsieur ' + company.lastName + ', bonjour' +
                        "<br /><br />Nous vous confirmons par l’envoi de ce mail que nous avons créé un compte pour votre entreprise sur le site du Forum by INSA. Nous vous invitons maintenant à cliquer sur le lien suivant afin de vous connecter à votre espace :" +
                        '<br /><a href="https://' + sails.config.configFIE.FIEdomainName + '/Company/' + '">Cliquez ici</a>' +
                        "<br /><br />Vous pouvez dès à présent visiter votre espace personnel sur le site afin d'éditer votre profil, voir vos factures et consulter la CVthèque. Vous pouvez également choisir quelle prestation vous souhaitez commander." +
                        '<br /><br />Nous vous rappelons que votre venue au FIE ne sera prise en compte que lorsque vous aurez effectué une commande de prestation (forum, speed job dating ou les deux).' +
                        "<br /><br />Le site ayant été mis à jour récemment, il est possible que des bugs soient encore présents. N’hésitez pas à nous signaler le moindre problème ou à nous poser des questions si vous rencontrez une difficulté  à l'adresse contact@foruminsaentreprises.fr." +
                        '<br /><br />Nous vous remercions de votre confiance et avons hâte de vous rencontrer le 23 octobre prochain.</p>' +
                        "<p>Cordialement,<br />L'équipe FIE 2018</p>"
                    });
                }
            }

            return res.json(200, {msg: 'Company ' + company.companyName + ' has updated info !'});

        });
    }
};

