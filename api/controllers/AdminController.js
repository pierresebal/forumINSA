/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    adminLogin: function (req, res) {
        if (req.param('password') === sails.config.configFIE.adminPassword) {
            req.session.isAdmin = true
        } else {
            req.session.isAdmin = false
        }

        return res.redirect('/Admin')
    },

    displayYearSettings: function (req, res) {
        GeneralSettings.findOrCreate({id: 1}).exec((err, found) => {
            if (err) {
                return err
            }

            var year = new Date().getFullYear()
            YearSettings.findOrCreate({year: year}).exec((err, record) => {
                if (err) {
                    return err
                }

                return res.view('Admin/YearSettings', {
                    layout: 'layout',
                    year: year,
                    generalSettings: found,
                    yearSettings: record,
                })
            })
        })
    },

    setPrices: function (req, res) {
        var year = new Date().getFullYear();

        YearSettings.findOrCreate({year: year}).exec((err, records) => {
            if (err) {
                console.log('year not found and not created')
                return
            }

            YearSettings.update({year: records.year}, {
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
                    console.log('Price not updated : ' + err)
                    return res.view('ErrorPage', {
                        layout: 'layout',
                        ErrorTitle: 'Error, avez-vous bien rempli tous les champs ?'
                    })
                }

                console.log("Modifications faites pour l'année " + records.year + ' ajouté !')
                return res.redirect('/Admin/YearSettings')
            })
        })
    },

    setInscriptionOpen: function (req, res) {
        GeneralSettings.findOrCreate({id: 1}).exec((err, found) => {
            if (err) {
                return err
            }

            var areOpened
            if (req.param('inscriptions') === "1") {
                areOpened = true
            } else {
                areOpened = false
            }

            GeneralSettings.update({id: 1}, {areInscriptionsOpened: areOpened}).exec((err) => {
                if (err) {
                    return err
                }

                return res.redirect('/Admin/YearSettings')
            })
        })
    },

    setInscriptionDeadline: function (req, res) {
        var deadline = new Date(req.param('inscriptionDeadline'))

        GeneralSettings.update({id: 1}, {inscriptionDeadline: deadline}).exec((err) => {
            if (err) {
                return err
            }

            return res.redirect('/Admin/YearSettings')
        })
    },

    displayCompanies: function (req, res) {
        Company.find().exec(function (err, companies) {
            if (err) {
                console.log('error : ' + err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Les entreprises ne sont pas récupérées'})
            }

            var sortedCompanies = companies
            sortedCompanies.sort((a, b) => a.active)

            return res.view('Admin/RegisteredCompanies', {layout: 'layout', companies: sortedCompanies})
        })
    },

    checkTasks: function (req, res) {
        // Fonction qui permet de valider les taches faites par les entreprises
        // L'ensemble des verifs sont contenues dans le JSON de config sails.config.TODOtasks(/config/TODOtasks.js
        Company.find().exec((err, companies) => {
            if (!err) {
                // Récupération de la configuration (fichier /config/TODOtasks.js)
                var TODOtasks = sails.config.TODOtasks

                // Initialisation du tableau pour la view Admin(pour chaque entreprise, les attribut oui ou non sont donné dans les colonnes)
                var checkCompaniesTasks = []

                for (var a = 0; a < companies.length; a++) {
                    // Pour chaque entreprise on vérifie les taches a faire...
                    var company = companies[a]
                    // Chargement des données pour retrouver l'entreprise dans le tableau
                    checkCompaniesTasks[a] = {
                        mailAddress: company.mailAddress,
                        siret: company.siret,
                        companyName: company.companyName,
                        tasksCheck: []
                    }

                    // Vérification des taches a partir de la config TODOtasks
                    for (var i = 0; i < TODOtasks.length; i++) {
                        if (TODOtasks[i].checkFun(company)) {
                            // Si la tache est a faire on enregistre le message a passer à la view
                            checkCompaniesTasks[a].tasksCheck[i] = 'Non fait'
                        } else {
                            // Si la taches est faite on met FAIT :D
                            checkCompaniesTasks[a].tasksCheck[i] = 'Fait'
                        }
                    }
                }
                return res.view('Admin/CheckList', {layout: 'layout', checkCompaniesTasks: checkCompaniesTasks})
            } else {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: 'Controller Admin, Action Check Tasks, Erreur lors de la lecture BDD Company'
                })
            }
        })
    },

    displaySells: function (req, res) {
        Sells.find().exec(function (err, sells) {
            if (err) {
                console.log('error : ' + err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Erreur: les ventes n'ont pas été récupérées."
                })
            }

            if (!sells) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Aucune ventes trouvées.'})
            }

            const companiesSiret = sells.map((sell) => sell.companySiret)
            const sortSettings = {siret: companiesSiret}

            Company.find(sortSettings).exec((err2, companies) => {
                if (err2) {
                    console.log('error : ' + err)
                    return res.view('ErrorPage', {
                        layout: 'layout',
                        ErrorTitle: "Erreur: les entreprises n'ont pas été récupérées."
                    })
                }

                if (!companies) {
                    return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Aucune entreprises trouvées.'})
                }

                var companiesMail = companies.reduce((a, b, i) => a + ', ' + b.mailAddress, '')
                companiesMail = companiesMail.substring(2)

                return res.view('Admin/Sells', {layout: 'layout', sells: sells, companiesMail: companiesMail})
            })
        })
    },

    setDidPay: function (req, res) {
        var siret = req.param('siret')
        var didPay = req.param('didPay')
        var yearTargeted = req.param('year')

        Sells.update({companySiret: siret, year: yearTargeted}, {didPay: didPay}).exec((err, updated) => {
            if (err) {
                console.log('error : ' + err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Erreur lors de la mise à jour.'})
            }

            if (!updated) {
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Aucune entreprise trouvée avec ce siret.'})
            }

            return res.redirect('/Admin/Sells')
        })
    },

    displayParticipatingStudents: function (req, res) {
        ParticipatingStudent.find().exec((err, students) => {
            if (err) {
                console.log('error : ' + err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Les étudiants ne sont pas récupérés'})
            }

            return res.view('Admin/ParticipatingStudents', {layout: 'layout', students: students})
        })
    },

    displayParticipatingCompanies: function (req, res) {
        Company.find().exec((err, companies) => {
            if (err) {
                console.log('error : ' + err)
                return res.view('ErrorPage', {layout: 'layout', ErrorTitle: 'Les entreprises ne sont pas récupérés'})
            }

            return res.view('Admin/ParticipatingCompanies', {layout: 'layout', companies: companies})
        })
    },

    displaySjdParticipants: function (req, res) {
        const actualYear = new Date().getFullYear()
        Sjd.find({year: actualYear}).exec((err, founds) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            return res.view('Admin/SjdParticipants', {layout: 'layout', participants: founds})
        })
    },

    initializeSjdSessions: function (req, res) {
        const criterias = [
            {sessionId: 1},
            {sessionId: 2},
            {sessionId: 3},
            {sessionId: 4}
        ]

        const sessions = [
            {sessionId: 1, hours: '9h30-10h30'},
            {sessionId: 2, hours: '11h00-12h00'},
            {sessionId: 3, hours: '14h00-15h00'},
            {sessionId: 4, hours: '15h30-16h30'}
        ]

        SjdSession.findOrCreate(criterias, sessions).exec((err, founds) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            return res.redirect('/admin/SjdSessions')
        })
    },

    displaySjdSessions: function (req, res) {
        var specialities = ['AE', 'IR', 'GMM', 'GC', 'GM', 'GB', 'GP', 'GPE']
        SjdSession.find().exec((err, sessions) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            return res.view('Admin/SjdSessions', {
                layout: 'layout',
                sessions: sessions,
                specialities: specialities,
                maxCompanies: 8
            })
        })
    },

    addCompaniesToSjd: function (req, res) {
        SjdSession.findOne({sessionId: req.param('sessionId')}).exec((err, session) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            if (!session) {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'L\'id de session est incorrect.'
                })
            }

            var newCompanies = []

            for (var i = 0; i < 8; i++) {
                if (req.param(i)) {
                    newCompanies.push(req.param(i))
                }
            }

            const newSpecialities = session.specialities.map((speciality) => { // On aurait aussi pu utiliser findIndex()
                if (speciality.name === req.param('speciality')) {
                    return {name: speciality.name, companies: newCompanies, students: speciality.students}
                }
                return speciality
            })

            SjdSession.update({sessionId: req.param('sessionId')}, {specialities: newSpecialities}).exec((err, updated) => {
                if (err) {
                    console.log('err', err)
                    return res.view('ErrorPage', {
                        layout: 'layout',
                        ErrorTitle: "Une erreur s'est produite",
                        ErrorDesc: 'Erreur lors de la mise à jour'
                    })
                }

                return res.redirect('/Admin/SjdSessions')
            })
        })
    },

    displayStudents: function (req, res) {
        Student.find().exec((err, students) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            var sortedStudents = students
            sortedStudents.sort((a, b) => {
                if (typeof a.speciality && b.speciality) {
                    return a.speciality.localeCompare(b.speciality)
                } else if (a.speciality && !b.speciality) {
                    return a.speciality.localeCompare('undefined')
                } else if (!a.speciality && b.speciality) {
                    return 'undefined'.localeCompare(b.speciality)
                } else if (!a.speciality && !b.speciality) {
                    return -1
                }
            })

            return res.view('Admin/RegisteredStudents', {layout: 'layout', students: sortedStudents})
        })
    },

    changeStudentSjd: function (req, res) {
        const login = req.param('student')
        const add = req.param('addOrRemove') === 'add'
        const sjdSession = add ? req.param('sessionId') : ''
        const sjdSpeciality = add ? req.param('speciality') : ''

        Student.findOne({login: login}).exec((err, found) => {
            if (err) {
                console.log('err', err)
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "Une erreur s'est produite",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            if (!found) {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "L'étudiant " + login + " n'est pas inscrit sur le site",
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            if (found && found.sjdRegistered && add) {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "L'étudiant " + login + ' est déjà inscrit ailleurs',
                    ErrorDesc: 'Veuillez réessayer'
                })
            }

            Student.update({login: login}, {
                sjdRegistered: add,
                sjdSession: sjdSession,
                sjdSpeciality: sjdSpeciality
            }).exec((err, updated) => {
                if (err) {
                    console.log('err', err)
                    return res.view('ErrorPage', {
                        layout: 'layout',
                        ErrorTitle: "Une erreur s'est produite",
                        ErrorDesc: 'Veuillez réessayer'
                    })
                }

                SjdSession.findOne({sessionId: req.param('sessionId')}).exec((err, session) => {
                    if (err) {
                        console.log('err', err)
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: "Une erreur s'est produite",
                            ErrorDesc: 'Veuillez réessayer'
                        })
                    }

                    if (!session) {
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: 'Session non trouvée',
                            ErrorDesc: 'Veuillez réessayer'
                        })
                    }

                    var newSpecialities = session.specialities
                    const index = session.specialities.findIndex((spe) => spe.name === req.param('speciality'))

                    var newStudents = session.specialities[index].students

                    const studentIndex = newStudents.indexOf(login)

                    if (studentIndex > -1 && add) {
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: 'Etudiant déjà présent dans ce créneau',
                            ErrorDesc: 'Veuillez réessayer'
                        })
                    } else if (studentIndex === -1 && !add) {
                        return res.view('ErrorPage', {
                            layout: 'layout',
                            ErrorTitle: 'Etudiant non présent dans ce créneau',
                            ErrorDesc: 'Veuillez réessayer'
                        })
                    }

                    if (add) {
                        newSpecialities[index].students.push(login)
                    } else {
                        console.log('COUCOU : ', studentIndex)
                        newSpecialities[index].students.splice(studentIndex, 1)
                    }

                    SjdSession.update({sessionId: req.param('sessionId')}, {specialities: newSpecialities}).exec((err, updated) => {
                        if (err) {
                            console.log('err', err)
                            return res.view('ErrorPage', {
                                layout: 'layout',
                                ErrorTitle: "Une erreur s'est produite",
                                ErrorDesc: 'Veuillez réessayer'
                            })
                        }

                        return res.redirect('/Admin/SjdSessions')
                    })
                })
            })
        })
    },

    getCompany: function(req, res)  {
        Company.findOne(req.allParams()).exec((err, company) => {
            if(err)  {
                sails.log.error('[AdminController.getCompany] an error occured when find a company :');
                sails.log.error(err);
                return res.serverError();
            }

            if(!company) {
                return res.view('ErrorPage', {
                    layout: 'layout',
                    ErrorTitle: "L'entreprise au siret " + req.param('siret') + " n'existe pas."
                });
            }

            Sells.find(req.allParams()).exec((err, sells) => {
                if(err)  {
                    sails.log.error('[AdminController.getCompany] an error occured when find a sell:');
                    sails.log.error(err);
                    return res.serverError();
                }

                let sellsExist = sells.length > 0;

                return res.view('Admin/CompanyInfo', {
                    layout: 'layout',
                    company: company,
                    sells: sells,
                    sellsExist: sellsExist
                });
            })
        });
    },

    //datatables -----------
    getCompanies: function(req, res)    {
        return res.view('Admin/getCompanies',  {
            layout: 'layout',
            title: 'FIE - Admin Companies'
        })
    },

    // api request give json response ---------

    apiCompany: function(req, res)  {

        Company.find({}, {select: ['siret', 'companyName', 'type', 'createdAt', 'blacklist', 'active']})
            .exec((err, companies)  =>  {
                if(err) {
                    sails.log.error('[CompanyController.apiCompany] error when find all companies:');
                    sails.log.error(err);
                    return res.serverError();
                }

                return res.json(200, companies);
            });

    },

    // not used for instance
    apiCompanyFeature: function(req, res)    {
        let columns = {
            'firstname': 'First Name',
            'lastName' : 'Last Name',
            'mailAddress': 'Mail',
            'phoneNumber': 'PhoneNumber'
        };
        DatatablesService.getGenerator(columns, (datatables) =>  {
            if(!datatables)  {
                console.log('hello 5');
                return res.json(500);
            }

            console.log('hello 3');
            Company.find({}, datatables.dtProjection()).exec((err, companies)    =>  {
                if(err) {
                    return res.json(500, err);
                }
                console.log('hello 4');
                return res.json(200, companies);
            });
        });
    },

    editBill: function (req, res) {

    }
}
