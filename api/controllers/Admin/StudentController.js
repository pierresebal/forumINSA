/**
 * Admin\StudentController
 *
 * @description :: Server-side logic for managing Admin\students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

    listing: function (req, res) {
        return res.view('AdminLTE/Student/listing', {
            layout: 'Layout/AdminLTE'
        })
    },

    update: function (req, res, next) {

        if(!req.param('id'))
            return res.next('absent :id');

        Student.find({'id': req.param('id')}).exec((err, data) => {
            if(err) {
                sails.log.error('[Admin/StudentController.update] error when update student :', err);
                return next(err);
            }

            return res.view('AdminLTE/Student/update', {
                student: data,
                layout: 'Layout/AdminLTE'
            })
        });

        return res.json({
            todo: 'update() is not implemented yet!'
        });
    },

    apiGetAll: function(req, res, next) {
        Student.find().exec((err, found) => {
            return res.json(200, found);
        });
    }
};

