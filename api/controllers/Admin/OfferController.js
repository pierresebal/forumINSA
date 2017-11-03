/**
 * Admin/OfferController
 *
 * @description :: Server-side logic for managing Admin/offers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    listing: function (req, res) {
        return res.view('AdminLTE/Offer/listing',  {
            layout: 'Layout/AdminLTE'
        });
    },

    create: function(req, res) {
        if(req.method !== 'POST')   {

            CompanyStatus.find().exec((err, allStatus) => {
                if(err) {
                    sails.log.error('[Admin/OfferController.create] error when create an offer: ', err);
                    return res.serverError(err);
                }

                return res.view('AdminLTE/Offer/create', {
                    offer: {},
                    allStatus: allStatus,
                    layout: 'Layout/AdminLTE'
                });
            });

        } else {
            Offer.create(req.body).exec((err, offer) => {
                if(err) {

                    sails.log.error('[Admin/OfferController.create] error when create an offer: ', err);

                    // get error message from validator. (cf locale/*.json)
                    for(let attribute of Object.keys(err.invalidAttributes))  {
                        for(let error of err.Errors[attribute])    {
                            req.addFlash(attribute, error.message);
                        }
                    }

                    CompanyStatus.find().exec((err, allStatus) => {
                        if(err) {
                            sails.log.error('[Admin/OfferController.create] error when create an offer: ', err);
                            return res.next
                        }

                        return res.view('AdminLTE/Offer/create', {
                            offer: req.body,
                            allStatus: allStatus,
                            layout: 'Layout/AdminLTE'
                        });

                    });


                }

                if(!offer || offer.length === 0) {
                    req.addFlash('warning', 'No offer has been created');
                    return res.view('AdminLTE/Offer/create', {
                        layout: 'Layout/AdminLTE',
                        offer: req.body
                    });
                }

                req.addFlash('success', 'A new offer created: ' + offer.name);
                return res.redirect(sails.getUrlFor('Admin/OfferController.listing'));
            })
        }
    },

    update: function(req, res, next) {
        if(req.method !== 'POST')   {
            Offer.findOne({id: req.param('id')}).populate('allow').exec((err, offer) => {
                if(err) {
                    sails.log.error('[Admin/OfferController.update] error when find offer: ', err);
                    return next(err);
                }

                if(!offer) {
                    sails.log.error('[Admin/OfferController.update] no offer found ');
                    return res.notFound();
                }

                CompanyStatus.find().exec((err, allStatus) => {
                    if(err) {
                        sails.log.error('[Admin/OfferController.update] error when find company status: ', err);
                        return next(err);
                    }

                    return res.view('AdminLTE/Offer/update', {
                        layout: 'Layout/AdminLTE',
                        allStatus: allStatus,
                        offer: offer
                    });
                });
            });
        } else {

            // if not have array, put empty array so that waterline delete it
            if(!req.param('allow')) {
                req.body.allow = [];
            }

            Offer.update({id: req.param('id')}, req.body).exec((err, updated) => {
                if(err) {
                    sails.log.error('[Admin/OfferController.update] error when update an offer: ', err);
                    return next(err);
                }

                if(!updated || updated.length === 0) {
                    sails.log.error('[Admin/OfferController.update] no update for offer ');
                    req.addFlash('warning', 'Offer '+ updated[0].name + ' is not updated');
                    return res.serverError();
                }

                // problem cas: when empty array, need to remove all element

                req.addFlash('success', 'Offer '+ updated[0].name +  'has been updated');
                return res.redirect(sails.getUrlFor('Admin/OfferController.listing'));
            });
        }
    },

    apiGetAll: function(req, res) {
        Offer.find().populate('allow', {select: ['name']}).exec((err, offers) => {
            if(err) {
                sails.log.error('[Admin/OfferController.apiGetAll] error when find all Offers :', err);
                return res.json(500, err);
            }

            return res.json(200, offers);
        });
    },

    apiUpdate: function(req, res)  {

        let id = req.param('id');
        let params = req.allParams();
        delete params.id;

        Offer.update({id: id}, params).exec((err, updated)  =>  {

            if(err) {
                sails.log.error('[Admin/OfferController.apiUpdate] error when update offer: ' + err);
                return res.json(500, err);
            }

            if(!updated || updated.length === 0) {
                sails.log.warn('[Admin/OfferController.apiUpdate] no offer has been updated, query: ', req.allParams());
                return res.json(500, {msg: 'no offer updated'});
            }

            sails.log.info('[Admin/OfferController.apiUpdate] updated offer '+ updated[0].name);
            return res.json(200, {msg: 'Offer ' + updated[0].name + ' has been updated successfully!'});

        });
    },

    apiDelete: function(req, res) {
        Offer.destroy(req.allParams()).exec((err, offer) => {
            if(err) {
                sails.log.error('[Admin/OfferController.apiDelete] error when delete an offer ', err);
                return res.json(500, err);
            }

            if(!offer || offer.length === 0) {
                sails.log.error('[Admin/OfferController.apiDelete] No offer deleted ');
                return res.json(500, 'No offer deleted!');
            }

            return res.json(200, {msg: 'Offer ' + offer[0].name + ' has been deleted!'});
        });
    }
};

