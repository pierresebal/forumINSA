/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    home: function (req, res) {
        return res.view('AdminLTE/home', {
            layout: 'Layout/AdminLTE'
        })
    },

    login: function (req, res) {

        if(req.session.isAdmin)
            return res.redirect(sails.getUrlFor('AdminController.home'));

        if (req.param('password') === sails.config.configFIE.adminPassword) {
            req.session.isAdmin = true;
            // if user has url to go
            if (req.session.cbUrl) {
                let next = _.clone(req.session.cbUrl);
                delete req.session.cbUrl;
                return res.redirect(next);
            }

            return res.redirect(sails.getUrlFor('AdminController.home'));
        }

        req.session.isAdmin = false;
        return res.view('AdminLTE/login', {
            layout: false
        });
    },

    displayYearSettings: function (req, res) {

        GeneralSettings.findOrCreate({id: 1}, {id: 1}).exec((err, found) => {
            if (err) {
                console.log(err);
                return err
            }

            var year = new Date().getFullYear();
            YearSettings.findOrCreate({year: year}, {year: year}).exec((err, record) => {
                if (err) {
                    console.log(err);
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

        console.log('setPrices');

        YearSettings.findOne({year: year}).exec((err, settings) => {
            if (err) {
                console.log('year not found and not created')
                return
            }
            console.log('settings1: ', settings);

            YearSettings.update({year: settings.year}, {
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

                console.log("Modifications faites pour l'année " + settings.year + ' ajouté !')
                return res.redirect('/Admin/YearSettings')
            })
        })
    },

    setInscriptionOpen: function (req, res) {
        GeneralSettings.findOrCreate({id: 1}, {id: 1}).exec((err, found) => {
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
                maxCompanies: 10
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

            for (var i = 0; i < 10; i++) {
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

    // references: getStudents
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
/*
    getCompany: function(req, res)  {
        // find company by id and show it

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

            Sells.find({companySiret: company.siret}).exec((err, sells) => {
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
*/

    updateSell: function(req, res, next)  {

        if(!req.param('id'))    {
            sails.log.error('[AdminController.updateSell] id param not found');
            return res.serverError();

        }   else if(!req.body)   {

            // get params
            Sells.findOne({id: req.param('id')}).exec((err, sell) => {
                if(err) {
                    sails.log.error('[AdminController.updateSell] no sell found with id: '+ req.param('id'));
                    return next(err);
                }

                if (!sell) {
                    sails.log.error('[AdminController.updateSell] No company found with query: ', req.allParams());
                    return res.notFound();
                }

                return res.view('AdminLTE/updateSell', {
                    layout: 'Layout/AdminLTE',
                    sell: sell
                });
            });

        }   else    {

            // handle query
            let params = req.allParams();
            delete params.id;

            Sells.update({id: req.param('id')}, params).exec((err, sells) => {
                if(err) {
                    sails.log.error('[AdminController.updateSell] error when update a sell: ', err);
                    return next(err);

                }   else if(!sells || sells.length === 0)    {

                    sails.log.warn('[AdminController.updateSell] sell id '+ req.param('id') +' has not been updated, query: ', params);
                    req.addFlash('warning', 'Sell id '+ req.param('id') +' has not been updated');
                    return res.redirect(sails.getUrlFor('AdminController.updateSell'));
                }   else    {

                    let updatedSell = sells[0];

                    // sell updated
                    sails.log.info('[AdminController.updateSell] sell id '+ req.param('id') +' has been updated');
                    req.addFlash('success', 'Sell id '+ req.param('id') +' has been updated');

                    // update pdf
                    Company.findOne({siret: updatedSell.companySiret}).exec((err, company) => {
                        if(err) {
                            sails.log.error('[AdminController.updateSell] error when find company: ', err);
                            return next(err);
                        }

                        PdfService.createFromEjs('Template/facture_template', {
                                sell: updatedSell,
                                date: new Date(),
                                company: company
                            }, 'files/factures/' + updatedSell.year + '/' + company.siret + '.pdf',
                            (err, pdf) =>   {

                                if(err) {
                                    sails.log.error('[AdminController.updateSell] error when find company: ', err);
                                    return next(err);
                                }

                                let year = new Date().getFullYear();

                                Sjd.update({year: year, companySiret: updatedSell.companySiret}, {sessionNb: 2 + updatedSell.moreSjd}).exec((err, updatedSjd) => {
                                    if(err) {
                                        sails.log.error('[AdminController.updateSell] error when update sjd: ', err);
                                        req.addFlash('danger', 'Error occured when update sjd');
                                        return next(err);
                                    }

                                    if(!updatedSjd || updatedSjd.length === 0) {

                                        Sjd.create({year: year, companySiret: updatedSell.companySiret, companyName: updatedSell.companyName, sessionNb: 2 + updatedSell.moreSjd}).exec((err, newSjd) => {

                                            if(err) {
                                                sails.log.error('[AdminController.updateSell] error when create a new sjd: ', err);
                                                req.addFlash('danger', 'Error occured when create sjd');
                                                return next(err);
                                            }

                                            sails.log.info('[AdminController.updateSell] a new Sjd session has been created');
                                            req.addFlash('success', 'A new sjd session has been created');

                                            return res.redirect(sails.getUrlFor('AdminController.getSells'));
                                        });

                                    } else {

                                        sails.log.info('[AdminController.updateSell] sjd '+ updatedSjd[0].companyName+ ' for '+year+' has been updated');
                                        req.addFlash('success', 'sjd '+updatedSjd[0].companyName+ ' for '+year+' has been updated');

                                        return res.redirect(sails.getUrlFor('AdminController.getSells'));
                                    }

                                });

                            });
                    });

                }

            });
        }


    },

    updateSpeciality: function(req, res, next) {
        if(!req.body)   {
            Speciality.findOne({abbreviation: req.param('abbreviation')}).exec((err, speciality) => {
                if(err) {
                    sails.log.error('[AdminController.updateSpeciality] error when find speciality: ', err);
                    return next(err);
                }

                if(!speciality) {
                    sails.log.error('[AdminController.updateSpeciality] no speciality found ');
                    return res.notFound();
                }

                return res.view('AdminLTE/updateSpeciality', {
                   layout: 'Layout/AdminLTE',
                   speciality: speciality
                });
            });
        } else {
            Speciality.update({abbreviation: req.param('abbreviation')}, req.body).exec((err, updated) => {
                if(err) {
                    sails.log.error('[AdminController.updateSpeciality] error when update speciality: ', err);
                    return next(err);
                }

                if(!updated || updated.length === 0) {
                    sails.log.error('[AdminController.updateSpeciality] no update for speciality ');
                    req.addFlash('warning', 'Speciality '+ updated[0] + ' is not updated');
                    return res.serverError();
                }

                req.addFlash('success', 'Speciality '+ updated[0] +  'has been updated');
                return res.redirect(sails.getUrlFor('AdminController.getSpecialities'));
            });
        }


    },

    createSpeciality: function(req, res, next) {
        if(!req.body)   {
            return res.view('AdminLTE/createSpeciality', {
                layout: 'Layout/AdminLTE',
                speciality: {}
            });
        } else {
            Speciality.create(req.body).exec((err, speciality) => {
                if(err) {

                    sails.log.error('[CompanyController.createSpeciality] error when create a speciality: ', err);

                    // get error message from validator. (cf locale/*.json)
                    for(var attribute of Object.keys(err.invalidAttributes))  {
                        for(var error of err.Errors[attribute])    {
                            req.addFlash(attribute, error.message);
                        }
                    }

                    return res.view('AdminLTE/createSpeciality', {
                        layout: 'Layout/AdminLTE',
                        speciality: req.body
                    });
                }

                if(!speciality || speciality.length === 0) {
                    req.addFlash('warning', 'No speciality has been created');
                    return res.view('AdminLTE/createSpeciality', {
                        layout: 'Layout/AdminLTE',
                        speciality: req.body
                    });
                }

                req.addFlash('success', 'A new speciality created: ' + speciality.abbreviation);
                return res.redirect(sails.getUrlFor('AdminController.getSpecialities'));
            })
        }
    },

    createOffer: function(req, res, next) {
        if(!req.body)   {
            return res.view('AdminLTE/createOffer', {
                layout: 'Layout/AdminLTE',
                offer: {}
            });
        } else {
            Offer.create(req.body).exec((err, offer) => {
                if(err) {

                    sails.log.error('[CompanyController.createOffer] error when create an offer: ', err);

                    // get error message from validator. (cf locale/*.json)
                    for(var attribute of Object.keys(err.invalidAttributes))  {
                        for(var error of err.Errors[attribute])    {
                            req.addFlash(attribute, error.message);
                        }
                    }

                    return res.view('AdminLTE/createOffer', {
                        layout: 'Layout/AdminLTE',
                        offer: req.body
                    });
                }

                if(!offer || offer.length === 0) {
                    req.addFlash('warning', 'No offer has been created');
                    return res.view('AdminLTE/createOffer', {
                        layout: 'Layout/AdminLTE',
                        offer: req.body
                    });
                }

                req.addFlash('success', 'A new offer created: ' + offer.name);
                return res.redirect(sails.getUrlFor('AdminController.getOffers'));
            })
        }
    },

    updateOffer: function(req, res, next) {
        if(!req.body)   {
            Offer.findOne({id: req.param('id')}).exec((err, offer) => {
                if(err) {
                    sails.log.error('[AdminController.updateOffer] error when find offer: ', err);
                    return next(err);
                }

                if(!offer) {
                    sails.log.error('[AdminController.updateOffer] no offer found ');
                    return res.notFound();
                }

                return res.view('AdminLTE/updateOffer', {
                    layout: 'Layout/AdminLTE',
                    offer: offer
                });
            });
        } else {
            Offer.update({abbreviation: req.param('id')}, req.body).exec((err, updated) => {
                if(err) {
                    sails.log.error('[AdminController.updateOffer] error when update an offer: ', err);
                    return next(err);
                }

                if(!updated || updated.length === 0) {
                    sails.log.error('[AdminController.updateOffer] no update for offer ');
                    req.addFlash('warning', 'Offer '+ updated[0] + ' is not updated');
                    return res.serverError();
                }

                req.addFlash('success', 'Offer '+ updated[0] +  'has been updated');
                return res.redirect(sails.getUrlFor('AdminController.updateOffer'));
            });
        }
    },

    createCompanyStatus: function(req, res, next) {
        if(!req.body)   {
            return res.redirect(sails.getUrlFor('AdminController.getCompanyStatus'));
        }   else    {
            CompanyStatus.create(req.body).exec((err, status) => {
                if(err) {
                    sails.log.error('[CompanyController.createCompanyStatus] error when create an offer: ', err);
                    req.addFlash('danger', 'An error occured : '+err);
                    return res.redirect(sails.getUrlFor('AdminController.getCompanyStatus'));
                }

                if(!status || status.length === 0) {
                    req.addFlash('warning', 'No status has been created');
                    return res.redirect(sails.getUrlFor('AdminController.getCompanyStatus'));
                }

                req.addFlash('success', 'A new status created: ' + status.name);
                return res.redirect(sails.getUrlFor('AdminController.getCompanyStatus'));
            })
        }

    },

    //datatables -----------

    getSells: function(req, res)    {
        return res.view('AdminLTE/getSells',  {
            layout: 'Layout/AdminLTE'
        });
    },

    getSjds: function(req, res)  {
        return res.view('AdminLTE/getSjds',  {
            layout: 'Layout/AdminLTE'
        });
    },

    getSpecialities: function(req, res, next)   {
        return res.view('AdminLTE/getSpecialities',  {
            layout: 'Layout/AdminLTE'
        });
    },

    getOffers: function(req, res, next)   {
        return res.view('AdminLTE/getOffers',  {
            layout: 'Layout/AdminLTE'
        });
    },

    getCompanyStatus: function(req, res, next)   {
        return res.view('AdminLTE/getCompanyStatus',  {
            layout: 'Layout/AdminLTE'
        });
    },

    // api request give json response ---------

    apiGetAllSells: function(req, res)  {
        Sells.find({}).exec((err, sells) => {
            if(err) {
                sails.log.error('[AdminController.apiGetAllSells] error when find all sells :', err);
                return res.json(500, err);
            }

            return res.json(200, sells);
        })
    },

    apiUpdateSells: function(req, res)  {

        // warning: this function won't modify our pdf file

        let id = req.param('id');
        let params = req.allParams();
        delete params.id;

        Sells.update({id: id}, params).exec((err, sells)  =>  {

            if(err) {
                sails.log.error('[AdminController.apiUpdateSells] error when update sells: ' + err);
                return res.json(500, err);
            }

            if(!sells || sells.length === 0) {
                sails.log.warn('[AdminController.apiUpdateSells] no sells has been updated, querry: ', req.allParams());
                return res.json(500, {msg: 'no sells updated'});
            }

            sails.log.info('[AdminController.apiUpdateSells] updated Sells number '+ sells[0].billNumber);
            return res.json(200, {msg: 'Sell ' + sells[0].billNumber + ' has been updated successfully!'});

        });
    },

    apiGetAllSjds: function(req, res) {
        const actualYear = new Date().getFullYear();
        Sjd.find({year: actualYear}).exec((err, sjds) => {
            if(err) {
                sails.log.error('[AdminController.apiGetAllSells] error when find all sells :', err);
                return res.json(500, err);
            }

            return res.json(200, sjds);
        });
    },

    apiGetAllSpecialities: function(req, res) {
        Speciality.find().exec((err, specialities) => {
            if(err) {
                sails.log.error('[AdminController.apiGetAllSpecialities] error when find all Speciality :', err);
                return res.json(500, err);
            }

            return res.json(200, specialities);
        });
    },

    apiDeleteSpeciality: function(req, res) {
        Speciality.destroy(req.allParams()).exec((err, speciality) => {
            if(err) {
                sails.log.error('[AdminController.apiDeleteSpeciality] error when delete speciality ', err);
                return res.json(500, err);
            }

            if(!speciality || speciality.length === 0) {
                sails.log.error('[AdminController.apiDeleteSpeciality] No speciality deleted ');
                return res.json(500, 'No speciality deleted!');
            }

            return res.json(200, {msg: 'Speciality ' + speciality.abbreviation + ' has been deleted!'});
        });
    },

    apiGetAllOffers: function(req, res) {
        Offer.find().exec((err, offers) => {
            if(err) {
                sails.log.error('[AdminController.apiGetAllOffers] error when find all Offers :', err);
                return res.json(500, err);
            }

            return res.json(200, offers);
        });
    },

    apiUpdateOffer: function(req, res)  {

        let id = req.param('id');
        let params = req.allParams();
        delete params.id;

        Offer.update({id: id}, params).exec((err, updated)  =>  {

            if(err) {
                sails.log.error('[AdminController.apiUpdateOffer] error when update offer: ' + err);
                return res.json(500, err);
            }

            if(!updated || updated.length === 0) {
                sails.log.warn('[AdminController.apiUpdateOffer] no offer has been updated, querry: ', req.allParams());
                return res.json(500, {msg: 'no offer updated'});
            }

            sails.log.info('[AdminController.apiUpdateOffer] updated offer '+ updated[0].name);
            return res.json(200, {msg: 'Sell ' + updated[0].name + ' has been updated successfully!'});

        });
    },

    apiDeleteOffer: function(req, res) {
        Offer.destroy(req.allParams()).exec((err, offer) => {
            if(err) {
                sails.log.error('[AdminController.apiDeleteOffer] error when delete an offer ', err);
                return res.json(500, err);
            }

            if(!offer || offer.length === 0) {
                sails.log.error('[AdminController.apiDeleteOffer] No offer deleted ');
                return res.json(500, 'No offer deleted!');
            }

            return res.json(200, {msg: 'Offer ' + offer[0].name + ' has been deleted!'});
        });
    },

    apiGetAllCompanyStatus: function(req, res) {
        CompanyStatus.find().exec((err, status) => {
            if(err) {
                sails.log.error('[AdminController.apiGetAllOffers] error when find all Offers :', err);
                return res.json(500, err);
            }

            return res.json(200, status);
        });
    },

    apiDeleteCompanyStatus: function(req, res) {
        CompanyStatus.destroy(req.allParams()).exec((err, status) => {
            if(err) {
                sails.log.error('[AdminController.apiDeleteCompanyStatus] error when delete a status ', err);
                return res.json(500, err);
            }

            if(!status || status.length === 0) {
                sails.log.error('[AdminController.apiDeleteCompanyStatus] No status deleted ');
                return res.json(500, 'No status deleted!');
            }

            return res.json(200, {msg: 'Offer ' + status[0].name + ' has been deleted!'});
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

}
