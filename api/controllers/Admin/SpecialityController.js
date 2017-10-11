/**
 * Admin/SpecialityController
 *
 * @description :: Server-side logic for managing Admin/speciality
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    listing: function (req, res) {
        return res.view('AdminLTE/Speciality/listing',  {
            layout: 'Layout/AdminLTE'
        });
    },

    update: function (req, res, next) {
        if(!req.body)   {
            Speciality.findOne({abbreviation: req.param('abbreviation')}).exec((err, speciality) => {
                if(err) {
                    sails.log.error('[Admin/SpecialityController.update] error when find speciality: ', err);
                    return next(err);
                }

                if(!speciality) {
                    sails.log.error('[Admin/SpecialityController.update] no speciality found ');
                    return res.notFound();
                }

                return res.view('AdminLTE/Speciality/update', {
                    layout: 'Layout/AdminLTE',
                    speciality: speciality
                });
            });
        } else {
            Speciality.update({abbreviation: req.param('abbreviation')}, req.body).exec((err, updated) => {
                if(err) {
                    sails.log.error('[Admin/SpecialityController.update] error when update speciality: ', err);
                    return next(err);
                }

                if(!updated || updated.length === 0) {
                    sails.log.error('[Admin/SpecialityController.update] no update for speciality ');
                    req.addFlash('warning', 'Speciality '+ updated[0].abbreviation + ' is not updated');
                    return res.serverError();
                }

                req.addFlash('success', 'Speciality '+ updated[0].abbreviation +  'has been updated');
                return res.redirect(sails.getUrlFor('Admin/SpecialityController.listing'));
            });
        }
    },

    create: function(req, res, next) {
        if(!req.body)   {
            return res.view('AdminLTE/Speciality/create', {
                layout: 'Layout/AdminLTE',
                speciality: {}
            });
        } else {
            Speciality.create(req.body).exec((err, speciality) => {
                if(err) {

                    sails.log.error('[Admin/SpecialityController.create] error when create a speciality: ', err);

                    // get error message from validator. (cf locale/*.json)
                    for(var attribute of Object.keys(err.invalidAttributes))  {
                        for(var error of err.Errors[attribute])    {
                            req.addFlash(attribute, error.message);
                        }
                    }

                    return res.view('AdminLTE/Speciality/create', {
                        layout: 'Layout/AdminLTE',
                        speciality: req.body
                    });
                }

                if(!speciality || speciality.length === 0) {
                    req.addFlash('warning', 'No speciality has been created');
                    return res.view('AdminLTE/Speciality/create', {
                        layout: 'Layout/AdminLTE',
                        speciality: req.body
                    });
                }

                req.addFlash('success', 'A new speciality created: ' + speciality.abbreviation);
                return res.redirect(sails.getUrlFor('Admin/SpecialityController.listing'));
            })
        }
    },

    apiGetAll: function(req, res) {
        Speciality.find().exec((err, specialities) => {
            if(err) {
                sails.log.error('[Admin/SpecialityController.apiGetAll] error when find all Speciality :', err);
                return res.json(500, err);
            }

            return res.json(200, specialities);
        });
    },

    apiDelete: function(req, res) {
        Speciality.destroy(req.allParams()).exec((err, speciality) => {
            if(err) {
                sails.log.error('[Admin/SpecialityController.apiDelete] error when delete speciality ', err);
                return res.json(500, err);
            }

            if(!speciality || speciality.length === 0) {
                sails.log.error('[Admin/SpecialityController.apiDelete] No speciality deleted ');
                return res.json(500, 'No speciality deleted!');
            }

            return res.json(200, {msg: 'Speciality ' + speciality[0].abbreviation + ' has been deleted!'});
        });
    },
};

