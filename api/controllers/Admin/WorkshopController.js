/**
 * Admin/WorkshopController
 *
 * @description :: Server-side logic for managing Admin/workshop
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    listing: function (req, res) {
        return res.view('AdminLTE/Workshop/listing',  {
            layout: 'Layout/AdminLTE'
        });
    },

    create: function(req, res, next) {
        if(!req.body)   {
            return res.view('AdminLTE/Workshop/create', {
                layout: 'Layout/AdminLTE',
                workshop: {}
            });
        } else {
            Workshop.create(req.body).exec((err, workshop) => {
                if(err) {

                    sails.log.error('[Admin/WorkshopController.create] error when create a workshop: ', err);

                    // get error message from validator. (cf locale/*.json)
                    for(var attribute of Object.keys(err.invalidAttributes))  {
                        for(var error of err.Errors[attribute])    {
                            req.addFlash(attribute, error.message);
                        }
                    }

                    return res.view('AdminLTE/Workshop/create', {
                        layout: 'Layout/AdminLTE',
                        workshop: req.body
                    });
                }

                if(!workshop || workshop.length === 0) {
                    req.addFlash('warning', 'No workshop has been created');
                    return res.view('AdminLTE/Workshop/create', {
                        layout: 'Layout/AdminLTE',
                        workshop: req.body
                    });
                }

                req.addFlash('success', 'A new workshop created: ' + workshop.abbreviation);
                return res.redirect(sails.getUrlFor('Admin/WorkshopController.listing'));
            })
        }
    },

    update: function (req, res, next) {
        if(!req.body)   {
            Workshop.findOne({abbreviation: req.param('abbreviation')}).exec((err, workshop) => {
                if(err) {
                    sails.log.error('[Admin/WorkshopController.update] error when find workshop: ', err);
                    return next(err);
                }

                if(!workshop) {
                    sails.log.error('[Admin/WorkshopController.update] no workshop found ');
                    return res.notFound();
                }

                return res.view('AdminLTE/Workshop/update', {
                    layout: 'Layout/AdminLTE',
                    workshop: workshop
                });
            });
        } else {
            let params = req.allParams();
            sails.log.info(params);
            Workshop.update({ abbreviation: params.abbreviation }, req.body).exec((err, updated) => {
                if(err) {
                    sails.log.error('[Admin/WorkshopController.update] error when update workshop: ', err);
                    return next(err);
                }

                if(!updated || updated.length === 0) {
                    sails.log.error('[Admin/WorkshopController.update] no update for workshop ');
                    req.addFlash('warning', 'Workshop '+ updated[0].abbreviation + ' is not updated');
                    return res.serverError();
                }

                req.addFlash('success', 'Workshop '+ updated[0].abbreviation +  'has been updated');
                return res.redirect(sails.getUrlFor('Admin/WorkshopController.listing'));
            });
        }
    },

    apiGetAll: function(req, res) {
        Workshop.find().exec((err, workshops) => {
            if(err) {
                sails.log.error('[Admin/WorkshopController.apiGetAll] error when find all Workshop :', err);
                return res.json(500, err);
            }
            return res.json(200, workshops);
        });
    },

    apiDelete: function(req, res) {
        Workshop.destroy(req.allParams()).exec((err, workshop) => {
            if(err) {
                sails.log.error('[Admin/WorkshopController.apiDelete] error when delete workshop ', err);
                return res.json(500, err);
            }

            if(!workshop || workshop.length === 0) {
                sails.log.error('[Admin/WorkshopController.apiDelete] No workshop deleted ');
                return res.json(500, 'No workshop deleted!');
            }

            return res.json(200, {msg: 'Workshop ' + workshop[0].abbreviation + ' has been deleted!'});
        });
    }
};

