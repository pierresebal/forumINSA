/**
 * Admin/CompanyStatusController
 *
 * @description :: Server-side logic for managing Admin/companystatuses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    listing: function(req, res, next)   {
        return res.view('AdminLTE/CompanyStatus/listing',  {
            layout: 'Layout/AdminLTE'
        });
    },

    create: function(req, res, next) {
        if(!req.body)   {
            return res.redirect(sails.getUrlFor('Admin/CompanyStatusController.listing'));
        }   else    {
            CompanyStatus.create(req.body).exec((err, status) => {
                if(err) {
                    sails.log.error('[Admin/CompanyStatusController.create] error when create a new status: ', err);
                    req.addFlash('danger', 'An error occured : '+ err);
                    return res.redirect(sails.getUrlFor('Admin/CompanyStatusController.listing'));
                }

                if(!status || status.length === 0) {
                    req.addFlash('warning', 'No status has been created');
                    return res.redirect(sails.getUrlFor('Admin/CompanyStatusController.listing'));
                }

                req.addFlash('success', 'A new status created: ' + status.name);
                return res.redirect(sails.getUrlFor('Admin/CompanyStatusController.listing'));
            })
        }

    },
    
    generate: function(req, res) {
        let default_status = [
            {name: 'Entreprise classique'}, {name: 'Start-up/PME'}, {name: 'Organisme de recherche'}, {name: 'Entreprise Fondation INSA Toulouse'}
        ];
        CompanyStatus.create(default_status).exec((err, status) => {
            if(err) {
                sails.log.error('[Admin/CompanyStatusController.generate] error when create new status: ', err);
                req.addFlash('danger', 'An error occured : '+err);
                return res.redirect(sails.getUrlFor('Admin/CompanyStatusController.listing'));
            }
    
            if(!status || status.length === 0) {
                req.addFlash('warning', 'No status has been created');
                return res.redirect(sails.getUrlFor('Admin/CompanyStatusController.listing'));
            }
    
            req.addFlash('success', 'Status have been generated');
            return res.redirect(sails.getUrlFor('Admin/CompanyStatusController.listing'));
        })
    },

    apiGetAll: function(req, res) {
        CompanyStatus.find().exec((err, status) => {
            if(err) {
                sails.log.error('[Admin/CompanyStatusController.apiGetAll] error when find all status :', err);
                return res.json(500, err);
            }

            return res.json(200, status);
        });
    },

    apiDelete: function(req, res) {
        CompanyStatus.destroy(req.allParams()).exec((err, status) => {
            if(err) {
                sails.log.error('[Admin/CompanyStatusController.apiDelete] error when delete a status ', err);
                return res.json(500, err);
            }

            if(!status || status.length === 0) {
                sails.log.error('[Admin/CompanyStatusController.apiDelete] No status deleted ');
                return res.json(500, 'No status deleted!');
            }

            return res.json(200, {msg: 'Status ' + status[0].name + ' has been deleted!'});
        });
    }
};

