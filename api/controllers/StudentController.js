/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: function (req, res) {
        var data = {login: req.param('login'), password: req.param('password')}
        var request = require('request');
        //https://srv-falcon.etud.insa-toulouse.fr/~forum/FBI/connection.php
        request.post({url: 'https://etud.insa-toulouse.fr/~forum/FBI/connection.php', form: data}, (err, httpResponse, body) => { // Demande de connection au ldap via le script php qui renvoie '0' si la connexion echoue

            if (!err && httpResponse.statusCode === 200) {

                if (body !== '0' && body[0] != 's') { // si la personne a pu se connecter au ldap
                    var result = JSON.parse(body)
                    delete result.studentId // On n'a pas besoin de cette property

                    Student.findOne({login: result.login}).exec((err, student) => {
                        if (err) {
                            return res.negotiate(err)
                        }
                        if (!student) { // Première connexion
                            Student.create(result).exec((err, created) => {
                                if (err) {
                                    return res.negotiate(err)
                                }
                                StudentSession.setStudentSessionVariables(req, created.login, created.firstName, created.lastName, created.mailAddress, true, 'student')

                                return res.view('StudentSpace/FirstConnection_1', {
                                    layout: 'layout',
                                    login: created.login,
                                    firstName: created.firstName,
                                    lastName: created.lastName,
                                    mailAddress: created.mailAddress,
                                    specialities: Student.definition.speciality.enum
                                })
                            })
                        } else {

                            req.session.user = student;
                            StudentSession.setStudentSessionVariables(req, student.login, student.firstName, student.lastName, student.mailAddress, true, 'student');

                            if (req.session.cbUrl) {
                                let next = _.clone(req.session.cbUrl);
                                delete req.session.cbUrl;
                                return res.redirect(next);
                            }

                            return res.redirect('Student/Profile');
                        }
                    })
                } else { // Personne non reconnu par le ldap
                    StudentSession.setStudentSessionVariables(req, '', '', '', false, '');

                    let errMessage = {};
                    errMessage['login'] = 'Veuillez bien choisir votre email et mot de passe';

                    return res.view('Connection_Password/Connection', {
                        layout: 'layout',
                        errMessage: errMessage,
                        studentConnectionFailed: true,
                        title: 'Connexion - Forum by INSA'
                    });
                }
            } else {
                sails.err.log('erreur : ', err);
            }
        })
    },

    testPhp: (req, res, next) => {
        var execPhp = require('exec-php');

        execPhp('../../files/phpCAS/login.php', function(error, php, outprint){

            console.log('outprint = ', outprint);

            /*
            php.loginCAS('toto', function(err, result, output, printed){
                console.log('output = ', output);
                console.log('printed = ', printed);
            });*/
        });

        return res.json(200);
    },

    /* ---------------------------------------------------------------------------------------------- */
    // StudentLogout: set session var as an unauthentificated user
    StudentLogout: function (req, res) {
        if (req.session.authenticated && req.session.sessionType === 'student') {
            StudentSession.setStudentSessionVariables(req, '', '', '', false, '')
            res.redirect('/')
        } else {
            console.log('An unauthenticated user tried to disconnect.')
            res.view('500')
        }
    },

    /* ----------------------------------------------------------------------------------------------- */

    // Affiche les informations du profil
    profile: function (req, res) {
        Workshop.find().exec((err, workshop) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
            }
            Student.findOne({login: req.session.login}).exec((err, student) => {
                if (err) {
                    return res.negotiate(err)
                }
                if (!student) {
                    return res.view('errorPage', {layout: 'layout', ErrorTitle: 'La recherche du profil a échouée', ErrorDesc: 'Etes-vous bien connecté ? Contacter le webmaster si le problème persiste'})
                } else {
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
                                specialities: Student.definition.speciality.enum,
                                sjdWishes: sjdWishes,
                                workshop: workshop,
                                workshopWishes: workshopWishes
                            })
                        })
                    })
                }
            })
        })
    },

    /* ---------------------------------------------------------------------------------------------- */

    // Modifie une information de l'utilisateur
    setAUserInfo: function (req, res) {
        var data = req.param('data').charAt(0) // Type d'info à modifier
        switch (data) {
            case 'y':
                var year = req.param('year')
                // Todo: Verification de year
                Student.update({login: req.session.login}, {year: year}).exec((err, student) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update year.'})
                    }

                    return res.redirect('/Student/Profile')
                })
                break

            case 'w':
                var personalWebsite = req.param('personalWebsite')

                if (personalWebsite.charAt(4) !== ':' && personalWebsite.charAt(5) !== ':') {
                    personalWebsite = 'http://' + personalWebsite
                }

                // Todo: Verification de personnalWebsite
                Student.update({login: req.session.login}, {personalWebsite: personalWebsite}).exec((err, student) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update personalWebsite.'})
                    }

                    return res.redirect('/Student/Profile')
                })
                break

            case 'l':
                var linkedin = req.param('linkedin')

                if (linkedin.charAt(4) !== ':' && linkedin.charAt(5) !== ':') {
                    linkedin = 'https://' + linkedin
                }
                // Todo: Verification de year
                Student.update({login: req.session.login}, {linkedin: linkedin}).exec((err, student) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update Linkedin.'})
                    }

                    return res.redirect('/Student/Profile')
                })
                break

            case 'v':
                var viadeo = req.param('viadeo')
                if (viadeo.charAt(4) !== ':' && viadeo.charAt(5) !== ':') {
                    viadeo = 'https://' + viadeo
                }

                // Todo: Verification de year
                Student.update({login: req.session.login}, {viadeo: viadeo}).exec((err, student) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update Viadeo.'})
                    }

                    return res.redirect('/Student/Profile')
                })
                break

            case 'g' :
                var github = req.param('github')

                if (github.charAt(4) !== ':' && github.charAt(5) !== ':') {
                    github = 'https://' + github
                }
                // Todo: Verification de year
                Student.update({login: req.session.login}, {github: github}).exec((err, student) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update github.'})
                    }

                    return res.redirect('/Student/Profile')
                })
                break

            case 's' :
                var speciality = req.param('speciality')
                // Todo: Verification de year
                Student.update({login: req.session.login}, {speciality: speciality}).exec((err, student) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update github.'})
                    }

                    return res.redirect('/Student/Profile')
                })
                break

            case 'm' :
                var mailAddress = req.param('mailAddress')
                // Todo: Verification de year
                Student.update({login: req.session.login}, {mailAddress: mailAddress}).exec((err, student) => {
                    if (err) {
                        return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'prb update mailAddress.'})
                    }

                    return res.redirect('/Student/Profile')
                })
                break

            default :
                console.log('Type de data inconnu')
        }
    },

    // Modifie toutes les info que l'utilisateur veut modifier.
    setAllInfo: function (req, res) {
        var mailAddress = req.session.mailAddress

        if (req.param('maillAddress') === '') {
            mailAddress = req.param('mailAddress')
        }

        var personalWebsite = req.param('personalWebsite')
        var linkedin = req.param('linkedin')
        var viadeo = req.param('viadeo')
        var github = req.param('github')

        // Add 'http://' if not yet present (or not 'https://')
        if (personalWebsite.charAt(4) !== ':' && personalWebsite.charAt(5) !== ':' && personalWebsite !== '') {
            personalWebsite = 'http://' + personalWebsite
        }

        if (linkedin.charAt(4) !== ':' && linkedin.charAt(5) !== ':' && linkedin !== '') {
            linkedin = 'https://' + linkedin
        }

        if (github.charAt(4) !== ':' && github.charAt(5) !== ':' && github !== '') {
            github = 'https://' + github
        }

        if (viadeo.charAt(4) !== ':' && viadeo.charAt(5) !== ':' && viadeo !== '') {
            viadeo = 'https://' + viadeo
        }

        // Todo : vérifier que l'adresse n'existe pas déjà

        Student.update({login: req.session.login}, {
            mailAddress: mailAddress,
            year: req.param('year'),
            speciality: req.param('speciality'),
            personalWebsite: personalWebsite,
            linkedin: linkedin,
            viadeo: viadeo,
            github: github
        }).exec((err, updatedUser) => {
            if (err) {
                console.log(err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Update failed'})
            }

            return res.view('StudentSpace/FirstConnection_2', {layout: 'layout', title: 'Connexion - Forum by INSA'})
        })
    },

    companies: function (req, res) {
        Speciality.find().exec((err, specialities) => {
            if (err) {
                sails.log.error('[StudentController.companies] error when find all speciality: ', err);
                return res.serverError(err);
            }
            var selectedSpeciality;
            const actualYear = new Date().getFullYear()

            if (!req.param('speciality')) { // Si aucune spécialité choisie
                selectedSpeciality = '-';
            } else {
                selectedSpeciality = req.param('speciality')
            }

            Sells.find({ year: actualYear }).exec((err, sells) => {
                if (err) {
                    console.log('error : ' + err)
                    return res.view('ErrorPage', { layout: 'layout', ErrorTitle: "Erreur: les ventes n'ont pas été récupérées." })
                }

                const companiesSiret = sells.map((sell) => sell.companySiret)
                var sortSettings = { siret: companiesSiret }

                if (selectedSpeciality !== '-') { // On rajoute le tri sur les spé que si on ne les veut pas toutes
                    sortSettings[req.param('speciality')] = "on"
                }

                Company.find(sortSettings).sort('companyName ASC').exec((err, companies) => {
                    if (err) {
                        console.log('error : ' + err)
                        return res.view('ErrorPage', { layout: 'layout', ErrorTitle: 'Les entreprises ne sont pas récupérées' })
                    }
                    const actualYear = new Date().getFullYear()
                    return res.view('StudentSpace/Companies', { 
                        layout: 'layout', 
                        companies: companies,
                        specialities: specialities, 
                        selectedSpeciality: selectedSpeciality, 
                        year: actualYear 
                    })
                })
            })
        })
    },

    displayACompany: function (req, res) {
        Company.findOne({siret: req.param('siret')}).exec((err, company) => {
            const actualYear = new Date().getFullYear()

            if (err) {
                console.log('error : ' + err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "L'entreprise n'est pas récupérée"})
            }

            if (!company) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "L'entreprise au siret " + req.param('siret') + " n'existe pas."})
            }

            Sells.findOne({companySiret: req.param('siret'), year: actualYear}).exec((err, sell) => {
                if (err) {
                    console.log('error : ' + err)
                    return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Les ventes ne sont pas récupérées'})
                }

                var sellsExist = true
                if (!sell) {
                    sellsExist = false
                }

                return res.view('StudentSpace/CompanyInfo', {
                    layout: 'layout', 
                    company: company, 
                    sell: sell, 
                    sellsExist: sellsExist})
            })
        })
    },

    sjd: function (req, res) {

        Sjd.find().sort('companyName ASC').exec((err, sjd) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
            }
            Student.findOne({login: req.session.login}).exec((err, student) => {
                if (err) {
                    console.log('err', err)
                    return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                }
                if (!student) {
                    return res.view('errorPage', {layout: 'layout', ErrorTitle: 'La recherche du profil a échouée', ErrorDesc: 'Etes-vous bien connecté ? Contacter le webmaster si le problème persiste'})
                } else { 
                    SjdWish.findOne({login: req.session.login}).exec((err, wishes) => {
                        if (err) {
                            console.log('err', err)
                            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                        }
                        Speciality.find().exec((err, specialities) => {
                            if (err) {
                                sails.log.error('[StudentController.sjd] error when find all speciality: ', err);
                                return res.serverError(err);
                            }
                            const companiesSiret = sjd.map((cie) => cie.companySiret)
                            var sortSettings = { siret: companiesSiret }
                            Company.find(sortSettings).sort('companyName ASC').exec((err, companies) => {
                                if (err) {
                                    console.log('error : ' + err)
                                    return res.view('ErrorPage', { layout: 'layout', ErrorTitle: 'Les entreprises ne sont pas récupérées' })
                                }
                                
                                return res.view('StudentSpace/Sjd', {
                                    layout: 'layout',
                                    student: student, 
                                    sjd: sjd, 
                                    wishes: wishes,
                                    specialities: specialities,
                                    companies: companies,
                                })
                            })
                        })
                    })
                }
            })
        })
    },

    workshop: function (req, res) {
        Workshop.find().sort('theme ASC').sort('startHour ASC').exec((err, workshops) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
            }
            Student.findOne({login: req.session.login}).exec((err, student) => {
                if (err) {
                    console.log('err', err)
                    return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                }
                if (!student) {
                    return res.view('errorPage', {layout: 'layout', ErrorTitle: 'La recherche du profil a échouée', ErrorDesc: 'Etes-vous bien connecté ? Contacter le webmaster si le problème persiste'})
                } else { 
                    WorkshopWish.findOne({login: req.session.login}).exec((err, wishes) => {
                        if (err) {
                            console.log('err', err)
                            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                        }
                        return res.view('StudentSpace/Workshop', {
                            layout: 'layout', 
                            student: student, 
                            workshops: workshops, 
                            wishes: wishes
                        })
                    })
                }
            })
        })
    },

    sjdInscription: function (req, res) {
        /*Student.findOne({login: req.session.login}).exec((err, student) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
            }

            if (student.sjdRegistered) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Vous êtes déjà inscrit'})
            }

            SjdWish.create(req.body).exec((err, company) => {

            }

            /*SjdSession.findOne({sessionId: req.param('sessionId')}).exec((err, session) => {
                if (err) {
                    console.log('err', err)
                    return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                }

                const index = session.specialities.findIndex((spe) => spe.name === req.param('speciality'))

                if (session.specialities[index].students.length >= 10) {
                    return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Créneau complet', ErrorDesc: 'Le créneau sélectionné est déjà complet. Nous vous invitons à en choisir un autre.'})
                } else {
                    var newSpecialities = session.specialities
                    newSpecialities[index].students.push(req.session.login)

                    SjdSession.update({sessionId: req.param('sessionId')}, {specialities: newSpecialities}).exec((err, updated) => {
                        if (err) {
                            console.log('err', err)
                            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Veuillez réessayer'})
                        }

                        Student.update({login: req.session.login}, {
                            sjdRegistered: true,
                            sjdSession: req.param('sessionId'),
                            sjdSpeciality: req.param('speciality')
                        }).exec((err, newStudent) => {
                            if (err) {
                                console.log('err', err)
                                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: "Une erreur s'est produite", ErrorDesc: 'Votre inscription s\'est mal passée et est dans un état instable. Veuillez prévenir le webmaster pour qu\'il règle le problème.'})
                            }

                            return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Inscription réussie', ErrorDesc: 'Votre inscription a bien été enregistrée.'})
                        })
                    })
                }
            })
        })*/
    },

    getSpecialities: function (req, res) {
        return res.json(Student.definition.speciality.enum)
    },

    getStudents: function (req, res) {
        Student.find().exec((err, students) => {
            if (err) {
                console.log('Erreur renvoi students')
                return
            }

            var lightRecords = students.map(function (found) {
                return {
                    'login': found.login,
                    'lastName': found.lastName,
                    'firstName': found.firstName,
                    'year': found.year,
                    'speciality': found.speciality,
                    'personalWebsite': found.personalWebsite,
                    'linkedin': found.linkedin,
                    'viadeo': found.viadeo,
                    'github': found.github,
                    'frCVPath': found.frCVPath,
                    'enCVPath': found.enCVPath
                }
            })

            return res.json(lightRecords)
        })
    }
}
