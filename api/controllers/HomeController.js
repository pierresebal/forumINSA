/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    home: function (req, res, next) {

        GeneralSettings.findOne({id:1}).exec((err, config) => {

            if(err) {
                sails.log.error('[HomeController.home] error when find general settings ', err);
                return next(err);
            }

            return res.view('Homepage/Homepage', {
                inscriptionOpen: config.areInscriptionsOpened,
                layout: 'layout',
                title: 'Accueil - Forum by INSA'
            });
        })

    }
};

