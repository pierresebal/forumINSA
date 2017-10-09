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

        if(req.method === 'GET') {

            Student.findOne({'id': req.param('id')}).exec((err, data) => {
                if(err) {
                    sails.log.error('[Admin/StudentController.update] error when find student :', err);
                    return next(err);
                }

                return res.view('AdminLTE/Student/update', {
                    student: data,
                    years: Student.definition.year.enum,
                    specialities: Student.definition.speciality.enum,
                    genders: Student.definition.gender.enum,
                    layout: 'Layout/AdminLTE'
                });
            });

        }   else {

            Student.update({'id': req.param('id')}, req.body).exec((err, data) => {
                if(err) {
                    sails.log.error('[Admin/StudentController.update] error when update student :', err);
                    return next(err);
                }

                sails.log.info('[Admin/StudentController.update] student '+ data[0].login +' has been updated');
                req.addFlash('success', 'Student '+ data[0].firstName+ ' ' + data[0].lastName +' has been updated');

                return res.redirect(sails.getUrlFor('Admin/StudentController.listing'));
            });
        }

    },

    apiGetAll: function(req, res, next) {
        Student.find().exec((err, found) => {
            if(err) {
                sails.log.error('[Admin/StudentController.apiGetAll] error when find all students:', err);
                return res.json(500, err);
            }

            return res.json(200, found);
        });
    }
};

