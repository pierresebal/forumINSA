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
                    sails.log.error('[Admin/CompanyController.update] an error occured when find a company: ',err);
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
                                typesCompany: Company.definition.type.enum,
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
        //if(!req.body)   {
            return res.view('AdminLTE/Company/create', {
                layout: 'Layout/AdminLTE',
                company: {},
                typesCompany: Company.definition.type.enum
            });
        /*} else {
            Company.create(req.body).exec((err, company) => {
                if(err) {

                    sails.log.error('[Admin/CompanyController.create] error when create a company: ', err);

                    // get error message from validator. (cf locale/*.json)
                    for(var attribute of Object.keys(err.invalidAttributes))  {
                        for(var error of err.Errors[attribute])    {
                            req.addFlash(attribute, error.message);
                        }
                    }

                    return res.view('AdminLTE/Company/create', {
                        layout: 'Layout/AdminLTE',
                        company: req.body
                    });
                }

                if(!company || company.length === 0) {
                    req.addFlash('warning', 'No speciality has been created');
                    return res.view('AdminLTE/Company/create', {
                        layout: 'Layout/AdminLTE',
                        company: req.body
                    });
                }

                req.addFlash('success', 'A new company has been created: ' + company.abbreviation);
                return res.redirect(sails.getUrlFor('Admin/CompanyController.listing'));
            })
        }*/
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

            sails.log.info('[Admin/CompanyController.apiUpdate] updated Company '+ companies[0].companyName);
            return res.json(200, {msg: 'Company ' + companies[0].companyName + ' has updated info !'});

        });
    }
};

