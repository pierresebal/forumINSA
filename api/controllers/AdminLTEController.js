/**
 * AdminLTEController
 *
 * @description :: Server-side logic for managing Adminltes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * `AdminLTEController.home()`
     */
    home: function (req, res) {
        return res.view('AdminLTE/home', {
            layout: 'Layout/AdminLTE'
        })
    },


    /**
     * `AdminLTEController.login()`
     */
    login: function (req, res) {

        if (req.param('password') === sails.config.configFIE.adminPassword) {
            req.session.isAdmin = true;
            // if user has url to go
            if (req.session.cbUrl) {
                let next = _.clone(req.session.cbUrl);
                delete req.session.cbUrl;
                return res.redirect(next);
            }

            return res.redirect(sails.getUrlFor('AdminLTEController.home'));
        }

        req.session.isAdmin = false;
        return res.view('AdminLTE/login', {
            layout: false
        });
    },


    /**
     * `AdminLTEController.logout()`
     */
    logout: function (req, res) {
        return res.json({
            todo: 'logout() is not implemented yet!'
        });
    },


    /**
     * `AdminLTEController.getSettings()`
     */
    getSettings: function (req, res, cb) {

        GeneralSettings.findOrCreate({id: 1}, {id: 1}).exec((err, found) => {
            if (err) {
                sails.log.error('[AdminLTEController.getSettings] error when do findOrCreate: ', err);
                return cb(err);
            }

            var year = new Date().getFullYear();
            YearSettings.findOrCreate({year: year}, {year: year}).exec((err, record) => {
                if (err) {
                    console.log(err);
                    return err
                }

                console.log('year settings: ', record);

                return res.view('Admin/YearSettings', {
                    layout: 'layout',
                    year: year,
                    generalSettings: found,
                    yearSettings: record,
                })
            })
        })

        return res.json({
            todo: 'settings() is not implemented yet!'
        });
    }
};

