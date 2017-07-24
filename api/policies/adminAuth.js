module.exports = function(req, res, next) {

    if (req.session.isAdmin)
        return next();

    req.session.cbUrl = req.url;  //save the url to redirect after logging in
    return res.redirect(sails.getUrlFor('AdminController.login'));
};
