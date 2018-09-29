/**
* SjdWishController
*
* @description :: Server-side logic for managing Sjds
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {

  create: function(req, res, next) {

    Sjd.find().exec((err, sjd) => {
      if (err) {
          console.log('err', err)
          return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
      }
      Student.findOne({login: req.session.login}).exec((err, student) => {
          if (err) {
              console.log('err', err)
              return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
          }

          SjdWish.create(req.body).exec((err, wish) => {
            if(err) {
                sails.log.error('[SjdWishController.create] error when create a wish: ', err);
    
                // get error message from validator. (cf locale/*.json)
                for(var attribute of Object.keys(err.invalidAttributes))  {
                    for(var error of err.Errors[attribute])    {
                        req.addFlash(attribute, error.message);
                    }
                }
    
                return res.view('StudentSpace/Sjd', {layout: 'layout', student: student, sjd: sjd})
            }
            if(!wish || wish.length === 0) {
                req.addFlash('warning', 'No wish has been created');
                return res.view('StudentSpace/Sjd', {layout: 'layout', student: student, sjd: sjd})
            }

            Student.update({login: req.session.login}, {
              sjdRegistered: true,
            }).exec((err) => {
                if (err) {
                    console.log('err', err)
                    return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Votre inscription s\'est mal passée et est dans un état instable. Veuillez prévenir le webmaster pour qu\'il règle le problème.'})
                }
                student.sjdRegistered = true
                req.addFlash('success', 'A new wish has been created: ');
                return res.view('StudentSpace/Profile', {
                  layout: 'layout',
                  login: student.login,
                  firstName: student.firstName,
                  lastName: student.lastName,
                  mailAddress: student.mailAddress,
                  year: student.year,
                  speciality: student.speciality,
                  frCVPath: student.frCVPath,
                  enCVPath: student.enCVPath,
                  personalWebsite: student.personalWebsite,
                  linkedin: student.linkedin,
                  viadeo: student.viadeo,
                  github: student.github,
                  specialities: Student.definition.speciality.enum
                })
            })
          })
        })
    })
  }
}
