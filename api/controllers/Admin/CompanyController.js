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
                if (err) {

                    sails.log.error('[Admin/CompanyController.create] error when create a company: ', err);

                    // get error message from validator. (cf locale/*.json)
                    req.addFlash('danger', err);
                    return res.view('AdminLTE/Company/create', {
                        layout: 'Layout/AdminLTE',
                        company: req.body
                    });
                }
                else if (!company || company.length === 0) {
                    req.addFlash('warning', 'No company has been created');
                    return res.view('AdminLTE/Company/create', {
                        layout: 'Layout/AdminLTE',
                        company: req.body
                    });

                } else {
                    sails.log.info(company.forum);
                    sails.log.info(company.sjd);

                    req.addFlash('success', 'A new company has been created: ' + company.companyName);
                    return res.redirect(sails.getUrlFor('Admin/CompanyController.listing'));
                } 
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
                    /*SendMail.sendEmail({
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
                    });*/
                    // Create  the sell
                    this.addASell(company);
                }
            }

            return res.json(200, {msg: 'Company ' + company.companyName + ' has updated info !'});

        });
    },

    addASell: function (company) {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        month++;

        YearSettings.findOne({year: year}).exec((err, found2) => {
            if (err) {
                return err;
            }
            sails.log.info(company.forum);
            sails.log.info(company.sjd);
            /* Traitement des informations de ventes */
            var forum, sjd;
            if (company.sjd) {
                forum = false;
                sjd = true;
            } else if (company.forum) {
                forum = true;
                sjd = false;
            }

            sails.log.info(forum);
            sails.log.info(sjd);

            var moreMeal = company.moreMeal;
            var mealPrice = found2.mealPrice;
            var forumPrice = found2.forumPrice;
            var sjdPrice = found2.sjdPrice;

            GeneralSettings.findOne({id: 1}).exec((err, found) => {
                if (err) {
                    return err;
                }

                // Creation du numéro de facture entier
                var fullBillNumber = found.billNumberMonth * 1000000 + month * 10000 + year;

                /* Creation de la vente */
                Sells.create({
                    year: year,
                    companySiret: company.siret,
                    companyName: company.companyName,
                    companyType: company.type,
                    forum: forum,
                    forumPrice: forumPrice,
                    sjd: sjd,
                    sjdPrice: sjdPrice,
                    moreMeal: moreMeal,
                    mealPrice: mealPrice,
                    billNumber: fullBillNumber
                }).exec((err, created) => {
                    if (err) {
                        sails.log.error('[SellsController.addASell] error when create sells: ');
                        sails.log.error(err);
                    }

                    GeneralSettings.update({id: 1}, {billNumberMonth: found.billNumberMonth + 1}).exec((err, updated) => {
                        if (err) {
                            sails.log.error('[SellsController.addASell] error when update GeneralSettings: ');
                            sails.log.error(err);
                        }

                        var pdf = require('html-pdf');
                        var fs = require('fs');

                        var contenu = fs.readFileSync('files/facture_template/facture_template.html').toString();
                        var date = new Date();

                        var companyAddress = company.road + '<br />' + company.complementaryInformation;
                        if (company.complementaryInformation !== '') {
                            companyAddress = companyAddress + '<br />';
                        }
                        companyAddress = companyAddress + company.postCode + ' ' + company.city + '<br />' + company.country;

                        var product, productPrice;
                        if (forum === true) {
                            product = 'Stand Forum';
                            productPrice = forumPrice;
                        } else if (sjd === true) {
                            product = 'Stand Forum + Speed Job Dating';
                            productPrice = sjdPrice;
                        }

                        // Création de la facture en format HTML
                        contenu = contenu.replace('@year', date.getFullYear())
                        contenu = contenu.replace('@billNumber', fullBillNumber.toString())
                        contenu = contenu.replace('@date', date.getDate() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear())
                        contenu = contenu.replace('@companyName', company.companyName)
                        contenu = contenu.replace('@siret', company.siret)
                        contenu = contenu.replace('@companyAddress', companyAddress)
                        contenu = contenu.replace('@forum', product)
                        contenu = contenu.replace('@forumPrice', productPrice)
                        contenu = contenu.replace('@totalForumPrice', productPrice)
                        contenu = contenu.replace('@moreMeal', moreMeal)
                        contenu = contenu.replace('@mealPrice', mealPrice)
                        contenu = contenu.replace('@totalMealPrice', moreMeal * mealPrice)
                        contenu = contenu.replace('@totalTTC', productPrice + moreMeal * mealPrice)

                        var options = {format: 'A4', orientation: 'portrait', border: '1cm'}

                        pdf.create(contenu, options).toFile('files/factures/' + year + '/' + company.siret + '.pdf', function afterwards(err) {
                            if (err) {
                                sails.log.error('[SellsController.addASell] error when create pdf: ');
                                sails.log.error(err);
                            }
                            // Envoi du mail de facture
                            SendMail.sendEmail({
                                destAddress: company.mailAddress,
                                //Bcc: 'contact@foruminsaentreprises.fr',
                                objectS: 'Confirmation de commande',
                                messageS: '\n\nBonjour,' +
                                '\n\nNous vous confirmons que la commande de prestation pour le FIE a été prise en compte. Vous trouverez ci-joint la facture correspondante.' +
                                '\n\nSi vous souhaitez modifier votre commande, merci de nous en faire part le plus tôt possible à l’adresse suivante : contact@foruminsaentreprises.fr' +
                                '\n\nDans le cas où le plan vigipirate serait maintenu, vous serez recontactés peu de temps avant le forum afin d\'enregistrer les noms de vos représentants. Une pièce d\'identité vous sera alors nécessaire.' +
                                '\n\nLe paiement doit être fait avant le 23 octobre 2018 par virement (RIB en pièce jointe) ou par chèque à l\'ordre du FORUM INSA ENTREPRISES et envoyé à l\'adresse :' +
                                '\nAmicale - Forum INSA Entreprises' +
                                '\n135 Avenue de rangueil,' +
                                '\n31400 Toulouse FRANCE' +
                                '\n\nNous vous remercions pour votre participation et avons hâte de vous rencontrer le 23 octobre prochain !' +
                                "\n\nCordialement,\nL'équipe FIE " + date.getFullYear(), // plaintext body
                                messageHTML: '<br /><br />Bonjour,' +
                                '<br /><br />Nous vous confirmons que la commande de prestation pour le FIE a été prise en compte. Vous trouverez ci-joint la facture correspondante.' +
                                '<br /><br />Si vous souhaitez modifier votre commande, merci de nous en faire part le plus tôt possible à l’adresse suivante : contact@foruminsaentreprises.fr' +
                                "<br /><br />Dans le cas où le plan vigipirate serait maintenu, vous serez recontactés peu de temps avant le forum afin d'enregistrer les noms de vos représentants. Une pièce d'identité vous sera alors nécessaire." +
                                "<br /><br />Le paiement doit être fait avant le 23 octobre 2018 par virement (RIB en pièce jointe) ou par chèque à l'ordre du FORUM INSA ENTREPRISES et envoyé à l'adresse :" +
                                '<br />Amicale - Forum INSA Entreprises' +
                                '<br />135 Avenue de rangueil,' +
                                '<br />31400 Toulouse FRANCE' +
                                '<br /><br />Nous vous remercions pour votre participation et avons hâte de vous rencontrer le 23 octobre prochain !' +
                                "<br /><br />Cordialement,<br />L'équipe FIE " + date.getFullYear(),
                                attachments: [{filename: 'facture.pdf', filePath: 'files/factures/' + year + '/' + company.siret + '.pdf'}, {filename: 'RIB-FIE.pdf', filePath: 'files/facture_template/RIB-FIE.pdf'}]
                            });

                            if (created.sjd) {
                                Sjd.create({
                                    year: year,
                                    companyName: company.companyName,
                                    companySiret: company.siret,
                                    sessionNb: 1
                                })
                                .exec((err, record) => {
                                    if (err) {
                                        sails.log.error('[SellsController.addASell] error when create a sjd: ');
                                        sails.log.error(err);
                                    }
                                })
                            }
                        })
                    })
                })
            })
        })
    }
};

