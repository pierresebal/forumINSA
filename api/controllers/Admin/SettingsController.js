/**
 * Admin/CompanyController
 *
 * @description :: Server-side logic for managing Admin/companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    display: function(req, res) {
        GeneralSettings.findOrCreate({id: 1}, {id: 1}).exec((err, generalSettings) => {
            if (err) {
                sails.log.error('[Admin/SettingsController.display] error when find general settings ', err);
                return res.serverError(err);
            }
        
            let year = new Date().getFullYear();
            YearSettings.findOrCreate({year: year}, {year: year}).exec((err, yearSettings) => {
                if (err) {
                    sails.log.error('[Admin/SettingsController.display] error when find year settings ', err);
                    return res.serverError(err);
                }
            
                return res.view('AdminLTE/GeneralSettings/display', {
                    layout: 'Layout/AdminLTE',
                    year: year,
                    generalSettings: generalSettings,
                    yearSettings: yearSettings,
                })
            });
        });
    },
    
    updateYearSettings: function(req, res, next) {
        let year = new Date().getFullYear();
        
        YearSettings.findOne({year: year}).exec((err, settings) => {
            if (err) {
                sails.log.error('[SettingsController.updateYearSettings] The setting for actual year is not set yet');
                return next(err);
            }
        
            YearSettings.update({year: settings.year}, {
                forumPrice: req.param('forumPrice'),
                sjdPrice: req.param('sjdPrice'),
                premiumPrice: req.param('premiumPrice'),
                sjdSessionPrice: req.param('sjdSessionPrice'),
                forumPricePME: req.param('forumPricePME'), // PME
                sjdPricePME: req.param('sjdPricePME'),
                premiumPricePME: req.param('premiumPricePME'),
                sjdSessionPricePME: req.param('sjdSessionPricePME'),
                mealPrice: req.param('mealPrice')
            }).exec((err, updated) => {
                if (err) {
                    sails.log.error('[SettingsController.updateYearSettings] error when update price', err);
                    return next(err);
                }
            
                sails.log.info('[SettingsController.updateYearSettings] Settings for '+ settings.year+' has been updated with success');
                req.addFlash('success', 'Year settings has been updated');
                return res.redirect(sails.getUrlFor('Admin/SettingsController.display'));
            })
        });
    },
    
    updateGeneralSettings: function(req, res, next) {
        GeneralSettings.findOrCreate({id: 1}, {id: 1}).exec((err) => {
            if (err) {
                sails.log.error('[SettingsController.updateGeneralSettings] An error occurs when find the general setting');
                return next(err);
            }
            
            GeneralSettings.update({id: 1}, req.body).exec((err, settings) => {
                if (err) {
                    sails.log.error('[SettingsController.updateGeneralSettings] An error occurs when find the general setting');
                    return next(err);
                }
    
                sails.log.info('[SettingsController.updateGeneralSettings] General settings has been updated: ', settings);
                req.addFlash('success', 'General settings has been updated');
                return res.redirect(sails.getUrlFor('Admin/SettingsController.display'));
            })
        })
    }
};

