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
        return res.view('AdminLTE/Admin', {
            layout: 'Layout/AdminLTE'
        })
    },


    /**
     * `AdminLTEController.login()`
     */
    login: function (req, res) {
        return res.json({
            todo: 'login() is not implemented yet!'
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
     * `AdminLTEController.settings()`
     */
    settings: function (req, res) {
        return res.json({
            todo: 'settings() is not implemented yet!'
        });
    }
};

