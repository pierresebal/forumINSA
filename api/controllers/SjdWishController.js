/**
* SjdWishController
*
* @description :: Server-side logic for managing Sjds
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {

  create: function(req, res, next) {

    Workshop.find().exec((err, workshop) => {
        if (err) {
            console.log('err', err)
            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
        }
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
                sjdRegistered: true
                }).exec((err) => {
                    if (err) {
                        console.log('err', err)
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Votre inscription s\'est mal passée et est dans un état instable. Veuillez prévenir le webmaster pour qu\'il règle le problème.'})
                    }
                    SjdWish.findOne({login: req.session.login}).exec((err, sjdWishes) => {
                        if (err) {
                            console.log('err', err)
                            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                        }
                        WorkshopWish.findOne({login: req.session.login}).exec((err, workshopWishes) => {
                            if (err) {
                                console.log('err', err)
                                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                            }
                            return res.view('StudentSpace/Profile', {
                                layout: 'layout',
                                login: record.login,
                                firstName: record.firstName,
                                lastName: record.lastName,
                                mailAddress: record.mailAddress,
                                year: record.year,
                                speciality: record.speciality,
                                frCVPath: record.frCVPath,
                                enCVPath: record.enCVPath,
                                personalWebsite: record.personalWebsite,
                                linkedin: record.linkedin,
                                viadeo: record.viadeo,
                                github: record.github,
                                specialities: Student.definition.speciality.enum,
                                sjdWishes: sjdWishes,
                                workshop: workshop,
                                workshopWishes: workshopWishes
                            })
                        })
                    })
                })
            })
            })
        })
    })
  }
}
