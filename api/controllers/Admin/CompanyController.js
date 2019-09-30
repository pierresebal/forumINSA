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
            Company.findOne({siret: req.param('siret')}).populate('status').exec((err, company) => {
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
                            }/*
                            sails.log.info('cie:', company);
                            sails.log.info('cie:', company[0]);
                            if (company.specialities) {
                                company.specialities.forEach(function(mySpe) {
                                    sails.log.info('ppp:', mySpe.abbreviation);        
                                });
                            }*/
                            return res.view('AdminLTE/Company/update', {
                                layout: 'Layout/AdminLTE',
                                company: company,
                                sells: sells,
                                allStatus: status,
                                allSpecialities: specialities
                            });
                        });
                    });
                });
            });
        } else {
            //sails.log.info("all :", req.allParams);
            // handle query
            
            let params = req.allParams();
            Speciality.find().exec((err, specialities) => {
                if(err) {
                    sails.log.error('[Admin/CompanyController.update] error when find all speciality: ', err);
                    return res.serverError(err);
                }
                
               specialities.forEach(function(spe) {
                    if (typeof req.param(spe.abbreviation) === 'undefined')
                        params[spe.abbreviation] = 'off';
                });
                Company.update({siret: req.param('siret')}, params).exec((err, updated) => {
                    
                    if(err) {
                        sails.log.error('[Admin/CompanyController.update] err occured when update company '+ req.param('siret') + ': ', err);
                        return next(err);
                    }
                    else if (!updated || updated.length === 0)    {
                        sails.log.warn('[Admin/CompanyController.update] company siret '+ req.param('siret') +' has not been updated, query: ', params);
                        req.addFlash('warning', 'Company dont siret '+ req.param('siret') +' has not been updated');
                        return res.redirect(sails.getUrlFor('Admin/CompanyController.listing'));
                    } 
                    else {
                        CompanyStatus.find().exec((err, status) => {
                            if(err) {
                                sails.log.error('[Admin/CompanyController.update] error when find all status: ', err);
                                return res.serverError(err);
                            }
        
                            Sells.find({companySiret: updated[0].siret}).exec((err, sells) => {
                                if(err) {
                                    sails.log.error('[Admin/CompanyController.update] error when find sells for company ' + updated[0].companyName + ': ', err);
                                    return res.serverError(err);
                                }
        
                                sails.log.info('[Admin/CompanyController.update] company '+ updated[0].companyName +' has been updated');
                                req.addFlash('success', 'Company '+ updated[0].companyName +' has been updated');

                                return res.view('AdminLTE/Company/update', {
                                    layout: 'Layout/AdminLTE',
                                    company: updated[0],
                                    sells: sells,
                                    allStatus: status,
                                    allSpecialities: specialities
                                });
                            });
                        });
                    }
                });
            });
        }
    },

    renew: function(req, res, next) {


        if (!req.param('siret')) {
            sails.log.error('[Admin/CompanyController.renew] siret param not found');
            return res.serverError();

        } else if (!req.body) {

            // as no query has been sent, display the renewed with information
            Company.findOne({siret: req.param('siret')}).populate('status').exec((err, company) => {
                if (err) {
                    sails.log.error('[Admin/CompanyController.renew] an error occured when find a company: ', err);
                    return next(err);
                }

                if (!company) {
                    sails.log.error('[Admin/CompanyController.renew] No company found with query: ', req.allParams());
                    return res.notFound();
                }

                // the next 3 query, we'll give the elements for some listing choices for the front page

                CompanyStatus.find().exec((err, status) => {
                    if(err) {
                        sails.log.error('[Admin/CompanyController.renew] error when find all status: ', err);
                        return res.serverError(err);
                    }

                    Sells.find({companySiret: company.siret}).exec((err, sells) => {
                        if(err) {
                            sails.log.error('[Admin/CompanyController.renew] error when find sells for company ' + company.companyName + ': ', err);
                            return res.serverError(err);
                        }

                        Speciality.find().exec((err, specialities) => {
                            if(err) {
                                sails.log.error('[Admin/CompanyController.renew] error when find all speciality: ', err);
                                return res.serverError(err);
                            }

                            return res.view('AdminLTE/Company/renew', {
                                layout: 'Layout/AdminLTE',
                                company: company,
                                sells: sells,
                                allStatus: status,
                                allSpecialities: specialities
                            });
                        });
                    });
                });
            });
        } else {

            // handle query
            let params = req.allParams();
            Speciality.find().exec((err, specialities) => {
                if(err) {
                    sails.log.error('[Admin/CompanyController.renew] error when find all speciality: ', err);
                    return res.serverError(err);
                }
                specialities.forEach(function(spe) {
                    if (typeof req.param(spe.abbreviation) === 'undefined')
                        params[spe.abbreviation] = 'off';
                });
                Company.update({siret: params.siret}, params).exec((err, company) => {

                    if(err) {
                        sails.log.error('[Admin/CompanyController.renew] err occured when renew company '+ req.param('siret') + ' : ', err);
                        sails.log.error('[Admin/CompanyController.renew](err occured when renew company '+ params.siret + ') : ', err);
                        return next(err);
                    }
                    else if (!company || company.length === 0)    {
                        sails.log.warn('[Admin/CompanyController.renew] renewed: ', !company, company.length);
                        sails.log.error('[Admin/CompanyController.renew] err occured when renew company '+ req.param('siret') + ': ', err);
                        sails.log.warn('[Admin/CompanyController.renew] company siret '+ req.param('siret') +' has not been renewed, query: ', params);
                        req.addFlash('warning', 'Company dont siret '+ req.param('siret') +' has not been renewed');
                        return res.redirect(sails.getUrlFor('Admin/CompanyController.listing'));
                    } 
                    else {

                        this.addASell(company[0], sendBillEmail = true);
            
                        sails.log.info('[Admin/CompanyController.renew] company '+ company[0].companyName +' has been renewed');
                        req.addFlash('success', 'Company '+ company[0].companyName +' has been renewed');

                        CompanyStatus.find().exec((err, status) => {
                            if(err) {
                                sails.log.error('[Admin/CompanyController.renew] error when find all status: ', err);
                                return res.serverError(err);
                            }        
                            Sells.find({companySiret: company[0].siret}).exec((err, sells) => {
                                if(err) {
                                    sails.log.error('[Admin/CompanyController.renew] error when find sells for company ' + company[0].companyName + ': ', err);
                                    return res.serverError(err);
                                }        

                                return res.view('AdminLTE/Company/update', {
                                    layout: 'Layout/AdminLTE',
                                    company: company[0],
                                    sells: sells,
                                    allStatus: status,
                                    allSpecialities: specialities
                                });
                            });
                        });
                    }
                });
            });
        }
    },

    create: function(req, res, next) {
        sails.log.info("LET'S CREATE :" );

        if(!req.body)   {
            CompanyStatus.find().exec((err, status) => {
                if(err) {
                    sails.log.error('[Admin/CompanyController.create] error when find all status: ', err);
                    return res.serverError(err);
                }
                Speciality.find().exec((err, specialities) => {
                    if(err) {
                        sails.log.error('[Admin/CompanyController.create] error when find all specialities: ', err);
                        return res.serverError(err);
                    }
                    return res.view('AdminLTE/Company/create', {
                        layout: 'Layout/AdminLTE',
                        company: {},
                        allStatus: status,
                        allSpecialities: specialities
                    });
                });
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
                } 
                else {
                    this.addASell(company, sendBillEmail = true);
                    req.addFlash('success', 'A new company has been created: ' + company.companyName);
                    
                    CompanyStatus.find().exec((err, status) => {
                        if(err) {
                            sails.log.error('[Admin/CompanyController.renew] error when find all status: ', err);
                            return res.serverError(err);
                        }        
                        Sells.find({companySiret: company.siret}).exec((err, sells) => {
                            if(err) {
                                sails.log.error('[Admin/CompanyController.renew] error when find sells for company ' + company.companyName + ': ', err);
                                return res.serverError(err);
                            }        
                            Speciality.find().exec((err, specialities) => {
                                if(err) {
                                    sails.log.error('[Admin/CompanyController.create] error when find all specialities: ', err);
                                    return res.serverError(err);
                                }

                                return res.view('AdminLTE/Company/update', {
                                    layout: 'Layout/AdminLTE',
                                    company: company,
                                    sells: sells,
                                    allStatus: status,
                                    allSpecialities: specialities
                                });
                            });
                        });
                    });
                        
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

        Company.update({id: id}, params).exec((err, companies) => {

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

            /*
            if (params.sendBillEmail !== undefined) {
                if (params.sendBillEmail) {
                    // Create  the sell
                    this.addASell(company, sendBillEmail);
                }
            }
            */

            return res.json(200, {msg: 'Company ' + company.companyName + ' has updated info !'});

        });
    },

    regenerateSell: function (req, res) {
        let id = req.param('id');
        let send = req.param('send');
        
        // from string to bool
        send = (send === "true");

        Company.find({id: id}).exec((err, companies) => {

            if(err) {
                sails.log.error('[Admin/CompanyController.regenerateSell] error when finding company: ' + err);
                return res.json(500, err);
            }

            if(!companies || companies.length === 0) {
                sails.log.warn('[Admin/CompanyController.regenerateSell] no company has been found, querry: ', req.allParams());
                return res.json(500, {msg: 'No company found for generating and send bill'});
            }

            let company = companies[0];
            sails.log.info('[Admin/CompanyController.regenerateSell] regenerateSell Company '+ company.companyName);
            
            this.addASell(company, send);
            return res.json(200, {msg: 'Bill generated ' + (send? 'and send to ' + company.companyName : '')});

        });
    },

    addASell: function (company, sendBillEmail) {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        month++;

        YearSettings.findOne({year: year}).exec((err, yearSetting) => {
            if (err) {
                return err;
            }
            
            // Erase all previous bills of current year
            // - Avoid duplicated bills 
            // - Allow to re-generate a bill using the same way
            var fullBillNumber = 0;
            Sells.destroy({companySiret: company.siret, year: year}).exec((err, sellsFounds) => {
                if (err) {
                    return err;
                }
               if (sellsFounds && sellsFounds.length > 0) {
                    fullBillNumber = sellsFounds[0].billNumber;
                }

                var forumPrice = yearSetting.forumPrice;
                var sjdPrice = yearSetting.sjdPrice;

                // reductions for PME && research,
                // on standard forum offer, and forum+SJD offer
                if(company.status === 'Start-up/PME') {
                    forumPrice = yearSetting.forumPricePME;
                    sjdPrice = yearSetting.sjdPricePME;
                } else if (company.status === 'Organisme de recherche') {
                    forumPrice = yearSetting.forumPriceResearch;
                    sjdPrice = yearSetting.sjdPriceResearch;
                } else if (company.status === 'Entreprise Fondation INSA Toulouse') {
                    forumPrice = yearSetting.forumPriceFoundation;
                    sjdPrice = yearSetting.sjdPriceFoundation;
                }
                
                var product, productPrice;
                switch(company.orderOption) {
                    case "forum" :
                        product = 'Stand Forum';
                        productPrice = forumPrice;
                        break;
                    case "forumSJD" :
                        product = 'Stand Forum + SJD';
                        productPrice = sjdPrice;
                        break;
                    case "special" :
                        product = 'Stand Forum XL';
                        productPrice = yearSetting.offerPrice;
                        break;
                    case "double" :
                        product = 'Stand Forum x2';
                        productPrice = forumPrice+forumPrice;
                        break;
                }

                var orderMeals = company.orderMeals;
                var mealPrice = yearSetting.mealPrice;

                
                GeneralSettings.findOne({id: 1}).exec((err, found) => {
                    if (err) {
                        return err;
                    }

                    // Creation du numéro de facture entier
                    if (fullBillNumber === 0)
                        fullBillNumber = found.billNumberMonth * 1000000 + month * 10000 + year;

                    /* Creation de la vente */
                    Sells.create({
                        year: year,
                        companySiret: company.siret,
                        companyName: company.companyName,
                        companyType: company.status,
                        // order
                        orderOption: product,
                        optionPrice: productPrice,
                        orderMeals: orderMeals,
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

                            // Création de la facture en format HTML
                            contenu = contenu.replace('@year', date.getFullYear());
                            contenu = contenu.replace('@billNumber', fullBillNumber.toString());
                            contenu = contenu.replace('@date', date.getDate() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear());
                            contenu = contenu.replace('@companyName', company.companyName);
                            contenu = contenu.replace('@companyType', company.status);
                            contenu = contenu.replace('@siret', company.siret);
                            contenu = contenu.replace('@companyAddress', companyAddress);

                            contenu = contenu.replace('@forum', product);
                            contenu = contenu.replace('@forumPrice', productPrice);
                            contenu = contenu.replace('@totalForumPrice', productPrice);
                            
                            contenu = contenu.replace('@moreMeal', orderMeals);
                            contenu = contenu.replace('@mealPrice', mealPrice);
                            contenu = contenu.replace('@totalMealPrice', orderMeals * mealPrice);
                            contenu = contenu.replace('@totalTTC', productPrice + orderMeals * mealPrice);

                            var options = {format: 'A4', orientation: 'portrait', border: '1cm'}

                            pdf.create(contenu, options).toFile('files/factures/' + year + '/' + company.siret + '.pdf', function afterwards(err) {
                                if (err) {
                                    sails.log.error('[SellsController.addASell] error when create pdf: ');
                                    sails.log.error(err);
                                }

                                sails.log.info('send :', sendBillEmail === true);
                                if (sendBillEmail === true) {
                                    // Envoi du mail de facture
                                    SendMail.sendEmail({
                                        destAddress: company.mailAddress,
                                        //Bcc: 'contact@foruminsaentreprises.fr',
                                        objectS: 'Confirmation de commande et de participation au Forum by INSA ' + year,
                                        messageS: '\n\nBonjour,' +
                                        '\n\nNous vous confirmons que la commande de prestation pour le Forum by INSA a été prise en compte. Vous trouverez ci-joint la facture correspondante.' +
                                        '\n\nSi vous souhaitez modifier votre commande, merci de nous en faire part le plus tôt possible à l’adresse suivante : contact@foruminsaentreprises.fr' +
                                        '\n\nLe paiement doit être fait avant le 30 novembre ' + year + ' par virement (RIB en pièce jointe) ou par chèque à l\'ordre du FORUM INSA ENTREPRISES et envoyé à l\'adresse :' +
                                        '\nAmicale - Forum by INSA' +
                                        '\n135 Avenue de rangueil,' +
                                        '\n31400 Toulouse FRANCE' +
                                        '\n\nNous vous remercions pour votre participation et avons hâte de vous rencontrer le 22 octobre prochain !' +
                                        "\n\nCordialement,\nL'équipe Forum by INSA " + year, // plaintext body

                                        messageHTML: '<p>Bonjour Madame/Monsieur ' + company.lastName +  ',' +

                                        // new account...
                                        (company.firstConnectionDone ?
                                        '<br /><br />Nous vous confirmons par l’envoi de cet e-mail que nous avons mis à jour le compte de votre entreprise sur le site <b>Forum <i>by</i> INSA</b>. Nous vous invitons à cliquer sur <a href="https://' + sails.config.configFIE.FIEdomainName + '/Company/AuthCompany' + '">ce lien</a> afin de vous connecter à votre espace. Vous pouvez dès à présent y consulter vos factures ou encore la CVthèque.' +
                                        "<br /><br />Dans le cas où vous souhaiteriez renouveller votre mot de passe, n\'hésitez pas à vous rendre sur " + '<a href="https://' + sails.config.configFIE.FIEdomainName + '/Company/ResetPassPage' + '">cette page</a>.'
                                        : // ..or renewed one
                                        "<br /><br />Nous vous confirmons par l’envoi de cet e-mail que nous avons créé un compte pour votre entreprise sur le site <b>Forum <i>by</i> INSA</b>. Nous vous invitons maintenant à cliquer sur le lien suivant afin de vous connecter à votre espace, muni des identifiants ci-dessous :" +
                                        '<br /><br /><b>Email</b> : ' + company.mailAddress +
                                        "<br /><b>Password : </b>" + company.tmpPassword +
                                        '<br /><a href="https://' + sails.config.configFIE.FIEdomainName + '/Company/AuthCompany' + '">Connexion</a>' +
                                        "<br /><br />Vous pouvez dès à présent visiter votre espace personnel sur le site afin de changer votre mot de passe, consulter vos factures ou encore la CVthèque."
                                        ) +
                                        '<br /><br />Nous vous confirmons de même que votre commande de prestation a été validée. Vous trouverez ci-joint la facture correspondante. Si vous souhaitez modifier votre commande, merci de nous en faire part le plus tôt possible à l’adresse suivante : <a href="mailto:contact@foruminsaentreprises.fr">contact@foruminsaentreprises.fr</a>' +
                                        "<br /><br />Le paiement doit être fait <b>avant le 30 novembre " + year +"</b> par virement (RIB en pièce jointe) ou par chèque à l'ordre de FORUM INSA ENTREPRISES et envoyé à l'adresse :" +
                                        '<br /><br /><span style=" color:#666666">Amicale - Forum by INSA' +
                                        '<br />135 Avenue de rangueil,' +
                                        '<br />31400 Toulouse FRANCE</span>' +
                                        '<br /><br />Nous vous remercions de votre confiance et avons hâte de vous rencontrer le 22 octobre prochain !' +
                                        "<br /><br />Cordialement,<br /><br />L'équipe Forum by INSA " + date.getFullYear() +
                                        "<br /><br /><span style='font-size: small; color:#666666'>PS: Le site ayant été mis à jour récemment, il est possible que des bugs soient encore présents. N’hésitez pas à nous signaler le moindre problème ou à nous poser des questions si vous rencontrez une difficulté  à l'adresse <a href='mailto:contact@foruminsaentreprises.fr'>contact@foruminsaentreprises.fr</a></span>",                                
                                        attachments: [{filename: 'facture.pdf', filePath: 'files/factures/' + year + '/' + company.siret + '.pdf'}, {filename: 'RIB-FBI.pdf', filePath: 'files/facture_template/RIB-FBI.pdf'}]
                                    });
                                }

                                console.log('sjd : ', company.orderOption === 'forumSJD');

                                if (company.orderOption === 'forumSJD') {
                                    SJDspecialities = [];

                                    Speciality.find().exec((err, specialities) => {
                                        if(err) {
                                            sails.log.error('[Admin/CompanyController.addASell] error when find all speciality: ', err);
                                            return res.serverError(err);
                                        }
                                       specialities.forEach(function(spe) {
                                            if (company[spe.abbreviation] === 'on')
                                            SJDspecialities.push(spe.abbreviation);
                                        });
                                    
                                        console.log('sjd - specialities', SJDspecialities);
                                        Sjd.create({
                                            year: year,
                                            companyName: company.companyName,
                                            companySiret: company.siret,
                                            sessionNb: 1,
                                            specialities: SJDspecialities,
                                        })
                                        .exec((err, record) => {
                                            if (err) {
                                                sails.log.error('[SellsController.addASell] error when create a sjd: ');
                                                sails.log.error(err);
                                            } else {
                                                sails.log.info('Company added to SJD list');
                                            }
                                        })
                                    })
                                }
                            })
                        })
                        
                    })
                })
            })
        })
    }
};

