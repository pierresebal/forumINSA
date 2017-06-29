/**
 * Flash policy allows to push message though application
 */
module.exports = function(req, res, cb) {
    res.locals.flash = {};
    if(!req.session.flash)  return cb();

    res.locals.flash = _.clone(req.session.flash);

    //clear flash
    req.session.flash = {};

    cb();
};